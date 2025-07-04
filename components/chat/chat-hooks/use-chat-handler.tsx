"use client"

import { useAuth } from "@/context/auth-context"
import { MayuraContext } from "@/context/context"
import { createChat } from "@/db/chats"
import { createMessage } from "@/db/messages"
import { ChatMessage } from "@/types"
import { useRouter } from "next/navigation"
import { useContext, useRef } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { useRateLimit } from "@/lib/hooks/use-rate-limit"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const useChatHandler = () => {
  const router = useRouter()
  const { user, getToken } = useAuth()
  const { refreshRateLimit, updateFromHeaders } = useRateLimit()

  const {
    userInput,
    setUserInput,
    profile,
    selectedChat,
    setSelectedChat,
    setChatMessages,
    setIsGenerating,
    isGenerating,
    firstTokenReceived,
    setFirstTokenReceived,
    abortController,
    setAbortController,
    chats,
    setChats
  } = useContext(MayuraContext)

  const chatInputRef = useRef<HTMLTextAreaElement>(null)

  const handleNewChat = () => {
    setSelectedChat(null)
    setChatMessages([])
    setUserInput("")

    return router.push("/chat")
  }

  const handleFocusChatInput = () => {
    chatInputRef.current?.focus()
  }

  const handleSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    isRegeneration: boolean = false
  ) => {
    const startingInput = messageContent
    setUserInput("")
    setIsGenerating(true)
    setFirstTokenReceived(false)

    // Create abort controller for this request
    const newAbortController = new AbortController()
    setAbortController(newAbortController)

    // Prepare messages to send
    let messagesToSend: ChatMessage[] = []

    if (isRegeneration) {
      // For regeneration, remove the last assistant message and use existing messages
      const lastUserMessageIndex = chatMessages
        .map((msg, index) => ({ msg, index }))
        .filter(({ msg }) => msg.role === "user")
        .pop()?.index

      if (lastUserMessageIndex !== undefined) {
        messagesToSend = chatMessages.slice(0, lastUserMessageIndex + 1)
      }
    } else {
      // For new messages, add the user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        chat_id: selectedChat?.id || "",
        user_id: user?.uid || "",
        content: messageContent,
        role: "user",
        model_name: "",
        sequence_number: chatMessages.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      messagesToSend = [...chatMessages, userMessage]
    }

    // Add placeholder assistant message
    const assistantMessage: ChatMessage = {
      id: uuidv4(),
      chat_id: selectedChat?.id || "",
      user_id: user?.uid || "",
      content: "",
      role: "assistant",
      model_name: "",
      sequence_number: messagesToSend.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const newMessages = [...messagesToSend, assistantMessage]
    setChatMessages(newMessages)

    try {
      const token = await getToken()
      if (!token) {
        throw new Error("No authentication token available")
      }

      const response = await fetch(`${API_BASE_URL}/v1/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          previous_messages: messagesToSend,
          prompt: messageContent,
          profile_context: profile?.profile_context
        }),
        signal: newAbortController.signal
      })

      // Update rate limit status from response headers (for both success and error responses)
      const updatedStatus = updateFromHeaders(response.headers)
      // Always trigger UI refresh after sending a message
      refreshRateLimit()

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Authentication failed. Please log in again.")
          router.push("/login")
          return
        }

        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      let fullGeneratedText = ""

      // Handle the streaming response
      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.trim() === '') continue
          
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                fullGeneratedText += parsed.content
                
                if (!firstTokenReceived) {
                  setFirstTokenReceived(true)
                }

                // Update the assistant message with the new content
                setChatMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: fullGeneratedText,
                    model_name: parsed.model || "unknown"
                  }
                  return updated
                })
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Final message processing
      setChatMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: fullGeneratedText
        }
        return updated
      })

      // Create or update chat if needed
      let currentChat = selectedChat
      if (!currentChat) {
        const newChat = await createChat({
          user_id: user!.uid,
          name: messageContent.slice(0, 100),
          sharing: "private"
        })
        setSelectedChat(newChat)
        setChats(prev => [newChat, ...prev])
        currentChat = newChat

        // Update the message chat_ids
        setChatMessages(prev => prev.map(msg => ({ ...msg, chat_id: newChat.id })))
      }

      // Save messages to database
      if (currentChat && !isRegeneration) {
        try {
          const userMessageToSave = {
            chat_id: currentChat.id,
            user_id: user!.uid,
            content: messageContent,
            role: "user" as const,
            model_name: "",
            sequence_number: messagesToSend.length
          }

          const assistantMessageToSave = {
            chat_id: currentChat.id,
            user_id: user!.uid,
            content: fullGeneratedText,
            role: "assistant" as const,
            model_name: "gpt-4", // You might want to get this from the response
            sequence_number: messagesToSend.length + 1
          }

          await createMessage(userMessageToSave)
          await createMessage(assistantMessageToSave)
        } catch (error) {
          console.error("Error saving messages:", error)
          toast.error("Failed to save messages")
        }
      }

    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.error("Request was cancelled")
      } else {
        console.error("Error in handleSendMessage:", error)
        toast.error(error.message || "An error occurred while sending the message")
      }

      // Remove the placeholder messages on error
      setChatMessages(prev => prev.slice(0, -2))
    } finally {
      setIsGenerating(false)
      setUserInput(startingInput)
      setAbortController(null)
    }
  }

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
    setIsGenerating(false)
  }

  return {
    chatInputRef,
    handleNewChat,
    handleSendMessage,
    handleFocusChatInput,
    handleStopMessage
  }
}

"use client"

import { useAuth } from "@/context/auth-context"
import { MayuraContext } from "@/context/context"
import { ChatMessage } from "@/types"
import { useRouter } from "next/navigation"
import { useContext, useRef, useState } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { useRateLimit } from "@/lib/hooks/use-rate-limit"
import { isAnonymousUser } from "@/lib/firebase/auth"
import { SignupPromptModal } from "@/components/ui/signup-prompt-modal"
import { getChatsByUserId } from "@/db/chats"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const useChatHandler = () => {
  const router = useRouter()
  const { user, getToken } = useAuth()
  const { refreshRateLimit, updateFromHeaders } = useRateLimit()
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)

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
    setChats,
    rateLimitStatus
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
    // Check if this is a new chat (no selectedChat initially)
    const isNewChat = !selectedChat?.id && !isRegeneration

    // Check if anonymous user has exhausted their quota
    if (user && isAnonymousUser() && rateLimitStatus) {
      if (rateLimitStatus.requests_remaining <= 0) {
        setShowSignupPrompt(true)
        return
      }
    }

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
      // For new messages, add the user message to the UI immediately
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

    // Add placeholder assistant message to UI
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

      // Send request to backend - backend will handle chat creation and message saving
      const response = await fetch(`${API_BASE_URL}/v1/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          previous_messages: messagesToSend.slice(0, -1), // Don't send the placeholder assistant message
          prompt: messageContent,
          profile_context: (user && !isAnonymousUser()) ? profile?.profile_context : undefined,
          chat_id: selectedChat?.id || undefined // Let backend create chat if no chat_id
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

        if (response.status === 429) {
          setShowSignupPrompt(true)
          // remove the placeholder messages
          setChatMessages(chatMessages)
          return
        }

        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      let fullGeneratedText = ""
      let hasReceivedFirstToken = false

      if (reader) {
        try {
          let modelName = "Mayura"
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              break
            }

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)

                if (data === "[DONE]") {
                  break
                }

                try {
                  const parsed = JSON.parse(data)

                  if (parsed.error) {
                    throw new Error(parsed.error)
                  }
                  if (parsed.model) {
                    modelName = parsed.model
                    continue
                  }

                  if (parsed.message) {
                    if (!hasReceivedFirstToken) {
                      setFirstTokenReceived(true)
                      hasReceivedFirstToken = true
                    }

                    fullGeneratedText += parsed.message

                    // Update the assistant message in real-time
                    setChatMessages(prevMessages => {
                      const updatedMessages = [...prevMessages]
                      const lastMessage = updatedMessages[updatedMessages.length - 1]
                      if (lastMessage && lastMessage.role === "assistant") {
                        lastMessage.content = fullGeneratedText
                        lastMessage.model_name = modelName
                      }
                      return updatedMessages
                    })
                  }
                } catch (parseError) {
                  // Ignore parsing errors for non-JSON lines
                }
              }
            }
          }
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            console.log("Request was aborted")
          } else {
            throw error
          }
        } finally {
          reader.releaseLock()
        }
      }

      // If this was a new chat and we successfully sent a message, 
      // fetch the updated chat list and navigate to the new chat
      if (isNewChat && user && fullGeneratedText) {
        try {
          const userId = user.isAnonymous ? user.uid : profile?.user_id
          if (userId) {
            const updatedChats = await getChatsByUserId(userId)
            if (Array.isArray(updatedChats)) {
              setChats(updatedChats)
              
              // Find the most recent chat (should be the newly created one)
              const newestChat = updatedChats.reduce((latest, chat) => {
                return new Date(chat.created_at) > new Date(latest.created_at) ? chat : latest
              })
              
              if (newestChat) {
                setSelectedChat(newestChat)
                // Navigate to the specific chat ID route
                router.push(`/chat/${newestChat.id}`)
              }
            }
          }
        } catch (error) {
          console.error("Error fetching updated chats:", error)
        }
      } else {
        // Refresh chat list after successful message for existing chats
        if (user) {
          try {
            // We'll let the chat layout handle refreshing the chat list
            console.log("Message sent successfully")
          } catch (error) {
            console.error("Error refreshing chat list:", error)
          }
        }
      }
    } catch (error: any) {
      console.error("Error sending message:", error)

      if (error.name === "AbortError") {
        console.log("Request was aborted by user")
      } else {
        // Remove the placeholder messages on error
        setChatMessages(chatMessages)
        toast.error(error.message || "Failed to send message. Please try again.")
      }
    } finally {
      setIsGenerating(false)
      setFirstTokenReceived(false)
      setAbortController(null)
    }
  }

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
    setIsGenerating(false)
    setFirstTokenReceived(false)
  }

  return {
    chatInputRef,
    handleNewChat,
    handleSendMessage,
    handleStopMessage,
    handleFocusChatInput,
    showSignupPrompt,
    setShowSignupPrompt
  }
}

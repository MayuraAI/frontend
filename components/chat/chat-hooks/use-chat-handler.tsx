import { MayuraContext } from "@/context/context"
import { deleteMessagesIncludingAndAfter } from "@/db/messages"
import { supabase } from "@/lib/supabase/browser-client"
import { ChatMessage } from "@/types"
import { useRouter } from "next/navigation"
import { useContext, useRef } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import {
  handleCreateChat,
  handleCreateMessages,
  processResponse
} from "../chat-helpers"
import { useRateLimit } from "@/lib/hooks/use-rate-limit"

export const useChatHandler = () => {
  const {
    profile,
    chatSettings,
    userInput,
    setUserInput,
    chatMessages,
    setChatMessages,
    selectedChat,
    setSelectedChat,
    setChats,
    abortController,
    setAbortController,
    setIsGenerating,
    firstTokenReceived,
    setFirstTokenReceived,
    refreshRateLimit
  } = useContext(MayuraContext)

  const router = useRouter()
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const { updateFromHeaders, getStatusSummary } = useRateLimit()

  const handleFocusChatInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.focus()
    }
  }

  const handleNewChat = async () => {
    if (!profile) return

    setChatMessages([])
    setSelectedChat(null)
    setUserInput("")
    setIsGenerating(false)
    setFirstTokenReceived(false)
    router.push("/chat")
  }

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsGenerating(false)
      setFirstTokenReceived(false)
    }
  }

  const handleSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    isRegeneration: boolean
  ) => {
    if (!profile) return

    try {
      setIsGenerating(true)

      const newAbortController = new AbortController()
      setAbortController(newAbortController)

      const tempUserMessage = {
        id: uuidv4(),
        chat_id: selectedChat?.id || "",
        user_id: profile.user_id,
        content: messageContent,
        role: "user",
        model_name: null,
        sequence_number: chatMessages.length,
        created_at: new Date().toISOString(),
        updated_at: null
      }

      const tempAssistantMessage = {
        id: uuidv4(),
        chat_id: selectedChat?.id || "",
        user_id: profile.user_id,
        content: "",
        role: "assistant",
        model_name: null,
        sequence_number: chatMessages.length + 1,
        created_at: new Date().toISOString(),
        updated_at: null
      }

      const tempUserChatMessage: ChatMessage = { ...tempUserMessage }
      const tempAssistantChatMessage: ChatMessage = {
        ...tempAssistantMessage
      }

      if (!isRegeneration) {
        setChatMessages(prev => [...prev, tempUserChatMessage])
      }

      setChatMessages(prev => [...prev, tempAssistantChatMessage])

      const messages = isRegeneration
        ? chatMessages
        : [...chatMessages, tempUserChatMessage]

      // Get the access token from Supabase session
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw new Error("Failed to get session: " + sessionError.message)
      }

      if (!session?.access_token) {
        throw new Error("No valid session found. Please log in again.")
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          messages: messages,
          profile_context: chatSettings.includeProfileContext
            ? profile.profile_context
            : undefined
        }),
        signal: newAbortController.signal
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.")
        }
        if (response.status === 429) {
          throw new Error(
            "Rate limit exceeded. Please wait before sending another message."
          )
        }
        throw new Error(
          `Failed to send message: ${response.status} ${response.statusText}`
        )
      }

      // Update rate limit status from response headers
      const updatedStatus = updateFromHeaders(response.headers)
      // Always trigger UI refresh after sending a message
      refreshRateLimit()
      if (updatedStatus) {
        const summary = getStatusSummary()
        
        // Show appropriate toasts based on rate limit status
        if (summary?.isRunningLow && !summary.isInFreeMode) {
          toast.warning(`Only ${summary.requestsRemaining} pro requests remaining today!`, {
            description: `${summary.timeUntilReset}`
          })
        } else if (summary?.isInFreeMode) {
          toast.info("You're now in free mode - unlimited requests!", {
            description: "Pro requests will reset tomorrow"
          })
        }
      }

            const [generatedText, modelName] = await processResponse(
        response,
        tempAssistantChatMessage,
        newAbortController,
        setFirstTokenReceived,
        setChatMessages
      )

      // Only save to database if we got some content
      if (generatedText) {
        if (!selectedChat) {
          const chat = await handleCreateChat(
            profile,
            messageContent,
            setSelectedChat,
            setChats
          )

          await handleCreateMessages(
            tempUserChatMessage,
            generatedText,
            modelName,
            isRegeneration,
            chat.id,
            profile,
            setChatMessages
          )
        } else {
          await handleCreateMessages(
            tempUserChatMessage,
            generatedText,
            modelName,
            isRegeneration,
            selectedChat.id,
            profile,
            setChatMessages
          )
        }
      }

      setUserInput("")
      setIsGenerating(false)
      setFirstTokenReceived(false)
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request aborted by user")
      } else {
        toast.error("Error sending message")
        setChatMessages(prev => prev.slice(0, -1))
      }
      setIsGenerating(false)
      setFirstTokenReceived(false)
    }
  }

  const handleSendEdit = async (
    editedContent: string,
    sequenceNumber: number
  ) => {
    if (!selectedChat || !profile) return

    try {
      await deleteMessagesIncludingAndAfter(
        profile.user_id,
        selectedChat.id,
        sequenceNumber
      )

      const updatedMessages = chatMessages.slice(0, sequenceNumber)
      setChatMessages(updatedMessages)

      await handleSendMessage(editedContent, updatedMessages, false)
    } catch (error) {
      toast.error("Error editing message")
    }
  }

  return {
    chatInputRef,
    handleFocusChatInput,
    handleNewChat,
    handleSendMessage,
    handleSendEdit,
    handleStopMessage
  }
}

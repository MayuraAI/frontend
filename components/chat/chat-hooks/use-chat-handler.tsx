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

      // filter only last 4 messages or all if less than 4
      let messagesToSend = messages.slice(-4)
      // slice content of the content of the messages if it exceeds 2000 characters
      // remove think block in ◁think▷ and ◁/think▷
      messagesToSend = messagesToSend.map(message => ({
        ...message,
        content: message.content.replace(/◁think▷.*?◁\/think▷/gs, "").slice(0, 2000)
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          messages: messagesToSend,
          profile_context: chatSettings.includeProfileContext
            ? profile.profile_context
            : undefined
        }),
        signal: newAbortController.signal
      })

      // Update rate limit status from response headers (for both success and error responses)
      const updatedStatus = updateFromHeaders(response.headers)
      // Always trigger UI refresh after sending a message
      refreshRateLimit()

      if (!response.ok) {
        // Parse error response
        let errorData: any = {}
        try {
          errorData = await response.json()
        } catch {
          // If response is not JSON, use default error message
          errorData = { message: `Request failed with status ${response.status}` }
        }

        const errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`

        if (response.status === 401) {
          toast.error("Authentication failed", {
            description: "Please log in again."
          })
          throw new Error("Authentication failed. Please log in again.")
        }
        
        if (response.status === 429) {
          // Show rate limit specific toast
          const summary = getStatusSummary()
          if (summary?.timeUntilReset) {
            toast.error("Too many requests", {
              description: `We know our platform is good, but please wait a little bit before sending another message.`
            })
          } else {
            toast.error("Rate limit exceeded", {
              description: "Please wait before sending another message."
            })
          }
          throw new Error("Rate limit exceeded. Please wait before sending another message.")
        }

        // Handle other errors
        toast.error("Failed to send message", {
          description: errorMessage
        })
        throw new Error(errorMessage)
      }

      if (updatedStatus) {
        const summary = getStatusSummary()

        // Show appropriate toasts based on rate limit status
        if (summary?.isRunningLow && !summary.isInFreeMode) {
          toast.warning(
            `Only ${summary.requestsRemaining} pro requests remaining today!`,
            {
              description: `${summary.timeUntilReset}`
            }
          )
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
        // Only show generic error toast if we haven't already shown a specific one
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        
        // Don't show duplicate toast for errors we've already handled above
        if (!errorMessage.includes("Authentication failed") && 
            !errorMessage.includes("Rate limit exceeded") && 
            !errorMessage.includes("Failed to send message")) {
          toast.error("Error sending message", {
            description: errorMessage
          })
        }
        
        console.error("Error sending message:", error)
      }
      
      // Remove the temporary assistant message on error
      setChatMessages(prev => prev.slice(0, -1))
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

import { MayuraContext } from "@/context/context"
import { deleteMessagesIncludingAndAfter } from "@/db/messages"
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

export const useChatHandler = () => {
  const {
    profile,
    selectedWorkspace,
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
    setFirstTokenReceived
  } = useContext(MayuraContext)

  const router = useRouter()
  const chatInputRef = useRef<HTMLTextAreaElement>(null)

  const handleFocusChatInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.focus()
    }
  }

  const handleNewChat = async () => {
    if (!profile || !selectedWorkspace) return

    setChatMessages([])
    setSelectedChat(null)
    setUserInput("")
    setIsGenerating(false)
    setFirstTokenReceived(false)
    router.push(`/${selectedWorkspace.id}/chat`)
  }

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort()
    }
  }

  const handleSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    isRegeneration: boolean
  ) => {
    if (!profile || !selectedWorkspace) return

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

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: messages,
          profile_context: selectedWorkspace.include_profile_context
            ? profile.profile_context
            : undefined,
          workspace_instructions:
            selectedWorkspace.include_workspace_instructions
              ? selectedWorkspace.instructions
              : undefined
        })
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const [generatedText, modelName] = await processResponse(
        response,
        tempAssistantChatMessage,
        newAbortController,
        setFirstTokenReceived,
        setChatMessages
      )

      if (!selectedChat) {
        const chat = await handleCreateChat(
          profile,
          selectedWorkspace,
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

      setUserInput("")
      setIsGenerating(false)
      setFirstTokenReceived(false)
    } catch (error) {
      toast.error("Error sending message")
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

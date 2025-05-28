import { ChatbotUIContext } from "@/context/context"
import { createChat } from "@/db/chats"
import { updateChat } from "@/db/chats"
import { deleteMessagesIncludingAndAfter } from "@/db/messages"
import { createMessage } from "@/db/messages"
import { buildFinalMessages } from "@/lib/build-prompt"
import { Tables } from "@/supabase/types"
import { ChatMessage } from "@/types"
import { useContext, useRef, useState } from "react"
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
  } = useContext(ChatbotUIContext)

  const [modelName, setModelName] = useState("")
  const chatInputRef = useRef<HTMLTextAreaElement>(null)

  const handleFocusChatInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.focus()
    }
  }

  const handleNewChat = async () => {
    if (!profile || !selectedWorkspace) return

    const newChat = {
      user_id: profile.user_id,
      workspace_id: selectedWorkspace.id,
      name: userInput.slice(0, 100),
      prompt: chatSettings.prompt,
      temperature: chatSettings.temperature,
      include_profile_context: chatSettings.includeProfileContext,
      include_workspace_instructions: chatSettings.includeWorkspaceInstructions,
      sharing: "private"
    }

    const createdChat = await createChat(newChat)

    setChats(prevState => [...prevState, createdChat])
    setSelectedChat(createdChat)

    const tempAssistantMessage = {
      id: uuidv4(),
      chat_id: createdChat.id,
      user_id: profile.user_id,
      content: "",
      role: "assistant",
      model_name: chatSettings.model,
      sequence_number: 1,
      created_at: new Date().toISOString(),
      updated_at: null
    }

    const tempAssistantChatMessage: ChatMessage = {
      message: tempAssistantMessage
    }

    setIsGenerating(true)
    setFirstTokenReceived(false)
    setChatMessages(prev => [...prev, tempAssistantChatMessage])

    const payload = {
      chatSettings,
      messages: [],
      prompt: chatSettings.prompt,
      workspace_instructions: selectedWorkspace.instructions,
      profile_context: selectedWorkspace.include_profile_context
        ? profile.profile_context
        : undefined,
      embeddings_provider: chatSettings.embeddingsProvider
    }

    const formattedMessages = await buildFinalMessages(
      payload,
      profile,
      tempAssistantChatMessage
    )

    const createdMessage = await createMessage(tempAssistantMessage)

    setChatMessages(prevState =>
      prevState.map(chatMessage =>
        chatMessage === tempAssistantChatMessage
          ? { ...chatMessage, message: createdMessage }
          : chatMessage
      )
    )

    setUserInput("")
    setIsGenerating(false)
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

      const tempUserChatMessage: ChatMessage = { message: tempUserMessage }
      const tempAssistantChatMessage: ChatMessage = {
        message: tempAssistantMessage
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
          messages: messages.map(m => m.message),
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

      const generatedText = await processResponse(
        response,
        tempAssistantChatMessage,
        newAbortController,
        setFirstTokenReceived,
        setChatMessages,
        setModelName
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
          messages,
          generatedText,
          modelName,
          isRegeneration,
          chat.id,
          profile,
          setChatMessages
        )
      } else {
        await handleCreateMessages(
          messages,
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

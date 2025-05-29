// Only used in use-chat-handler.tsx to keep it clean

import { createChat } from "@/db/chats"
import { createMessages } from "@/db/messages"
import {
  buildFinalMessages,
  adaptMessagesForGoogleGemini
} from "@/lib/build-prompt"
import { consumeReadableStream } from "@/lib/consume-stream"
import { Tables } from "@/supabase/types"
import { ChatMessage } from "@/types"
import { ChatPayload, ChatSettings, LLM, TablesInsert } from "@/types"
import React from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

export const validateChatSettings = (
  chatSettings: ChatSettings | null,
  modelData: LLM | undefined,
  profile: Tables<"profiles"> | null,
  selectedWorkspace: Tables<"workspaces"> | null,
  messageContent: string
) => {
  if (!chatSettings) {
    throw new Error("Chat settings not found")
  }

  if (!modelData) {
    throw new Error("Model not found")
  }

  if (!profile) {
    throw new Error("Profile not found")
  }

  if (!selectedWorkspace) {
    throw new Error("Workspace not found")
  }

  if (!messageContent) {
    throw new Error("Message content not found")
  }
}

export const fetchChatResponse = async (
  url: string,
  body: object,
  isHosted: boolean,
  controller: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    signal: controller.signal
  })

  if (!response.ok) {
    if (response.status === 404 && !isHosted) {
      toast.error(
        "Model not found. Make sure you have it downloaded via Ollama."
      )
    }

    const errorData = await response.json()

    toast.error(errorData.message)

    setIsGenerating(false)
    setChatMessages(prevMessages => prevMessages.slice(0, -2))
  }

  return response
}

export const handleCreateChat = async (
  profile: Tables<"profiles">,
  selectedWorkspace: Tables<"workspaces">,
  messageContent: string,
  setSelectedChat: React.Dispatch<React.SetStateAction<Tables<"chats"> | null>>,
  setChats: React.Dispatch<React.SetStateAction<Tables<"chats">[]>>
) => {
  const newChat: TablesInsert<"chats"> = {
    user_id: profile.user_id,
    workspace_id: selectedWorkspace.id,
    name: messageContent.slice(0, 100),
    sharing: "private"
  }

  const chat = await createChat(newChat)
  setSelectedChat(chat)
  setChats(prevChats => [...prevChats, chat])
  return chat
}

export const handleCreateMessages = async (
  messages: ChatMessage[],
  generatedText: string,
  modelName: string,
  isRegeneration: boolean,
  chatId: string,
  profile: Tables<"profiles">,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const now = new Date().toISOString()

  const messagesToCreate: TablesInsert<"messages">[] = messages.map(
    message => ({
      id: uuidv4(),
      chat_id: chatId,
      content: message.content,
      role: message.role,
      user_id: profile.user_id,
      model_name: modelName,
      sequence_number: message.sequence_number,
      created_at: now,
      updated_at: null
    })
  )

  if (!isRegeneration) {
    messagesToCreate.push({
      id: uuidv4(),
      chat_id: chatId,
      user_id: profile.user_id,
      content: generatedText,
      role: "assistant",
      model_name: modelName,
      sequence_number: messages.length + 1,
      created_at: now,
      updated_at: null
    })
  }

  const createdMessages = await createMessages(messagesToCreate)

  setChatMessages(prevMessages => {
    const newMessages = [...prevMessages]
    createdMessages.forEach((createdMessage, index) => {
      if (index < newMessages.length) {
        newMessages[index] = createdMessage
      } else {
        newMessages.push(createdMessage)
      }
    })
    return newMessages
  })
}

export const processResponse = async (
  response: Response,
  tempAssistantChatMessage: ChatMessage,
  controller: AbortController,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setModelName: React.Dispatch<React.SetStateAction<string>>
) => {
  let fullText = ""
  let modelName = ""

  try {
    const reader = response.body?.getReader()
    if (!reader) throw new Error("No reader available")

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = new TextDecoder().decode(value)
      const lines = text.split("\n").filter(line => line.trim() !== "")
      const data = JSON.parse(lines[0].slice(6))

      if (data.type == "end") {
        break
      }

      if (data.model) {
        modelName = data.model
        setModelName(modelName)
        continue
      }

      if (data.message) {
        fullText += data.message
        setFirstTokenReceived(true)
        setChatMessages(prev =>
          prev.map(chatMessage =>
            chatMessage.id === tempAssistantChatMessage.id
              ? {
                  ...chatMessage,
                  content: fullText
                }
              : chatMessage
          )
        )
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Stream aborted by user")
    } else {
      console.error("Error processing stream:", error)
      throw error
    }
  }

  return fullText
}

// Only used in use-chat-handler.tsx to keep it clean

import { createChat } from "@/db/chats"
import { createMessages } from "@/db/messages"
import { Tables } from "@/supabase/types"
import { ChatMessage } from "@/types"
import { ChatSettings, LLM, TablesInsert } from "@/types"
import React from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

export const validateChatSettings = (
  chatSettings: ChatSettings | null,
  modelData: LLM | undefined,
  profile: Tables<"profiles"> | null,
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
  messageContent: string,
  setSelectedChat: React.Dispatch<React.SetStateAction<Tables<"chats"> | null>>,
  setChats: React.Dispatch<React.SetStateAction<Tables<"chats">[]>>
) => {
  const newChat: TablesInsert<"chats"> = {
    user_id: profile.user_id,
    name: messageContent.slice(0, 100),
    sharing: "private"
  }

  const chat = await createChat(newChat)
  setSelectedChat(chat)
  setChats(prevChats => [...prevChats, chat])
  return chat
}

export const handleCreateMessages = async (
  message: ChatMessage,
  generatedText: string,
  modelName: string,
  isRegeneration: boolean,
  chatId: string,
  profile: Tables<"profiles">,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const now = new Date().toISOString()

  const user_message: TablesInsert<"messages"> = {
    id: uuidv4(),
    chat_id: chatId,
    content: message.content,
    role: message.role,
    user_id: profile.user_id,
    model_name: modelName,
    sequence_number: message.sequence_number,
    created_at: now,
    updated_at: null
  }

  const assistant_message: TablesInsert<"messages"> = {
    id: uuidv4(),
    chat_id: chatId,
    user_id: profile.user_id,
    content: generatedText,
    role: "assistant",
    model_name: modelName,
    sequence_number: message.sequence_number + 1,
    created_at: now,
    updated_at: null
  }

  await createMessages([user_message, assistant_message])
}

export const processResponse = async (
  response: Response,
  tempAssistantChatMessage: ChatMessage,
  controller: AbortController,
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  let fullText = ""
  let modelName = ""

  // Function to update display content immediately
  const updateDisplayContent = (content: string) => {
    setChatMessages(prev =>
      prev.map(chatMessage =>
        chatMessage.id === tempAssistantChatMessage.id
          ? {
              ...chatMessage,
              content: content,
              model_name: modelName
            }
          : chatMessage
      )
    )
  }

  try {
    const reader = response.body?.getReader()
    if (!reader) throw new Error("No reader available")

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = new TextDecoder().decode(value)
      const lines = text.split("\n").filter(line => line.trim() !== "")

      if (lines.length === 0) continue

      for (const line of lines) {
        let data
        try {
          // Handle both SSE format "data: {...}" and raw JSON
          const lineContent = line.startsWith("data: ") ? line.slice(6) : line
          data = JSON.parse(lineContent)
        } catch (parseError) {
          console.error(
            "Error parsing response data:",
            parseError,
            "Raw text:",
            text
          )
          continue
        }

        // Handle error responses
        if (data.error) {
          const errorMessage = `Error: ${data.error}`
          fullText = errorMessage
          setChatMessages(prev =>
            prev.map(chatMessage =>
              chatMessage.id === tempAssistantChatMessage.id
                ? {
                    ...chatMessage,
                    content: "There was an error generating your response. Please try again.",
                    model_name: "error"
                  }
                : chatMessage
            )
          )
          throw new Error(data.error)
        }

        if (data.type == "end") {
          break
        }

        if (data.model) {
          modelName = data.model
          continue
        }

        if (data.message) {
          // Add to fullText and display immediately
          fullText += data.message
          setFirstTokenReceived(true)
          updateDisplayContent(fullText)
        }
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

  return [fullText, modelName]
}




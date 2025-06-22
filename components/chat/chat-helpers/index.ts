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
  let displayedText = ""
  let buffer = ""
  let isStreamingComplete = false
  let displayInterval: NodeJS.Timeout | null = null

  // Configuration for smooth display
  const MIN_WORDS_PER_BATCH = 3 // Minimum words to display at once
  const MAX_WORDS_PER_BATCH = 7 // Maximum words to display at once
  const BASE_INTERVAL_MS = 150 // Base interval in milliseconds
  const MIN_INTERVAL_MS = 80 // Minimum interval for large buffers
  const MAX_INTERVAL_MS = 250 // Maximum interval for small buffers

  // Function to calculate adaptive interval based on buffer size
  const getAdaptiveInterval = (bufferLength: number) => {
    if (bufferLength > 500) {
      // Large buffer: faster display
      return MIN_INTERVAL_MS
    } else if (bufferLength > 200) {
      // Medium buffer: normal speed
      return BASE_INTERVAL_MS
    } else if (bufferLength > 50) {
      // Small buffer: slower speed
      return BASE_INTERVAL_MS + 50
    } else {
      // Very small buffer: slowest speed
      return MAX_INTERVAL_MS
    }
  }

  // Function to get random number of words to display
  const getRandomWordsCount = (bufferLength: number) => {
    let minWords = MIN_WORDS_PER_BATCH
    let maxWords = MAX_WORDS_PER_BATCH

    // Adjust word count based on buffer size
    if (bufferLength > 500) {
      // Large buffer: display more words
      minWords = 5
      maxWords = 9
    } else if (bufferLength > 200) {
      // Medium buffer: normal range
      minWords = 3
      maxWords = 7
    } else if (bufferLength < 50) {
      // Small buffer: fewer words
      minWords = 1
      maxWords = 3
    }

    return Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords
  }

  // Function to process and display content with thinking block handling
  const updateDisplayContent = (content: string, isStreaming: boolean = true) => {
    let displayContent = content

    // During streaming, always show the raw content to allow live thinking updates
    // When streaming is complete, keep the full content including thinking blocks
    // so they can be properly parsed and displayed as clickable dropdowns
    displayContent = content

    setChatMessages(prev =>
      prev.map(chatMessage =>
        chatMessage.id === tempAssistantChatMessage.id
          ? {
              ...chatMessage,
              content: displayContent,
              model_name: modelName
            }
          : chatMessage
      )
    )
  }

  // Function to smoothly display buffered text
  const displayBufferedText = () => {
    if (displayedText.length >= fullText.length && isStreamingComplete) {
      // All text has been displayed and streaming is complete
      if (displayInterval) {
        clearInterval(displayInterval)
        displayInterval = null
      }
      updateDisplayContent(fullText, false)
      return
    }

    // Get remaining text to display
    const remainingText = fullText.slice(displayedText.length)
    
    if (remainingText.length > 0) {
      // Split remaining text into words
      const words = remainingText.split(/(\s+)/)
      
      // Calculate buffer length and get adaptive word count
      const bufferLength = remainingText.length
      const wordsToDisplay = getRandomWordsCount(bufferLength)
      
      // Take the calculated number of words (accounting for spaces)
      const wordsAndSpaces = words.slice(0, wordsToDisplay * 2 - 1)
      const textToAdd = wordsAndSpaces.join('')
      
      displayedText += textToAdd
      setFirstTokenReceived(true)
      updateDisplayContent(displayedText, true)
      
      // Schedule next update with adaptive interval
      if (displayInterval) {
        clearInterval(displayInterval)
      }
      const nextInterval = getAdaptiveInterval(bufferLength)
      displayInterval = setTimeout(displayBufferedText, nextInterval)
    }
  }

  // Start the display interval
  displayInterval = setInterval(displayBufferedText, getAdaptiveInterval(0))

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
          displayedText = errorMessage
          if (displayInterval) {
            clearInterval(displayInterval)
            displayInterval = null
          }
          setChatMessages(prev =>
            prev.map(chatMessage =>
              chatMessage.id === tempAssistantChatMessage.id
                ? {
                    ...chatMessage,
                    content: errorMessage,
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
          // Add to buffer instead of displaying immediately
          fullText += data.message
        }
      }
    }

    // Mark streaming as complete
    isStreamingComplete = true

    // Ensure all remaining text gets displayed
    const finalDisplayLoop = () => {
      if (displayedText.length < fullText.length) {
        displayBufferedText()
        setTimeout(finalDisplayLoop, getAdaptiveInterval(0))
      } else {
        // Final update to ensure all content is displayed
        updateDisplayContent(fullText, false)
        if (displayInterval) {
          clearInterval(displayInterval)
          displayInterval = null
        }
      }
    }
    
    // Start the final display loop if needed
    if (displayedText.length < fullText.length) {
      setTimeout(finalDisplayLoop, getAdaptiveInterval(0))
    }

  } catch (error) {
    // Clean up interval on error
    if (displayInterval) {
      clearInterval(displayInterval)
      displayInterval = null
    }
    
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Stream aborted by user")
    } else {
      console.error("Error processing stream:", error)
      throw error
    }
  }

  return [fullText, modelName]
}




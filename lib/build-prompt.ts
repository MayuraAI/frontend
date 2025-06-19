import { Tables } from "@/supabase/types"
import { ChatMessage, ChatSettings } from "@/types"

interface BuildPromptPayload {
  chatSettings: ChatSettings
  messages: ChatMessage[]
  prompt: string
  profile_context: string | undefined
  embeddings_provider: string
}

export const buildPrompt = (
  prompt: string,
  profileContext: string,
  embeddingsProvider: string
) => {
  let fullPrompt = ""

  if (profileContext) {
    fullPrompt += `User Info:\n${profileContext}\n\n`
  }

  fullPrompt += `Instructions:\n${prompt}`

  return fullPrompt
}

export const buildFinalMessages = async (
  payload: BuildPromptPayload,
  profile: Tables<"profiles">,
  assistantMessage: ChatMessage
) => {
  const systemMessage = {
    role: "system",
    content: buildPrompt(
      payload.prompt,
      payload.profile_context || "",
      payload.embeddings_provider
    )
  }

  const messages = [systemMessage, ...payload.messages, assistantMessage]

  return messages
}

function adaptSingleMessageForGoogleGemini(message: any) {
  let adaptedParts = []

  let rawParts = []
  if (!Array.isArray(message.content)) {
    rawParts.push({ type: "text", text: message.content })
  } else {
    rawParts = message.content
  }

  for (let i = 0; i < rawParts.length; i++) {
    let rawPart = rawParts[i]

    if (rawPart.type == "text") {
      adaptedParts.push({ text: rawPart.text })
    }
  }

  let role = "user"
  if (["user", "system"].includes(message.role)) {
    role = "user"
  } else if (message.role === "assistant") {
    role = "model"
  }

  return {
    role: role,
    parts: adaptedParts
  }
}

export async function adaptMessagesForGoogleGemini(
  payload: BuildPromptPayload,
  messages: any[]
) {
  let geminiMessages = []
  for (let i = 0; i < messages.length; i++) {
    let adaptedMessage = adaptSingleMessageForGoogleGemini(messages[i])
    geminiMessages.push(adaptedMessage)
  }

  return geminiMessages
}

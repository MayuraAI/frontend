import { Message } from "@/types/database"
import { ChatMessage, ChatSettings } from "."

export interface ChatPayload {
  chatSettings: ChatSettings
  messages: ChatMessage[]
  prompt: string
  profile_context: string | undefined
  embeddings_provider: string
}

export interface ChatAPIPayload {
  chatSettings: ChatSettings
  messages: Message[]
}

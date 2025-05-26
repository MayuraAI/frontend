import { Tables } from "@/supabase/types"
import { ChatMessage, ChatSettings } from "."

export interface ChatPayload {
  chatSettings: ChatSettings
  messages: ChatMessage[]
  prompt: string
  workspace_instructions: string | null
  profile_context: string | undefined
  embeddings_provider: string
}

export interface ChatAPIPayload {
  chatSettings: ChatSettings
  messages: Tables<"messages">[]
}

import { Database, Tables } from "@/supabase/types"

export interface ChatMessage {
  id: string
  chat_id: string
  user_id: string
  content: string
  role: string
  model_name: string | null
  sequence_number: number
  created_at: string
  updated_at: string | null
}

export interface ChatSettings {
  model: string
  prompt: string
  temperature: number
  contextLength: number
  includeProfileContext: boolean
  includeWorkspaceInstructions: boolean
  embeddingsProvider: "openai" | "local"
}

export interface ChatRequest {
  messages: ChatMessage[]
  profile_context?: string
  workspace_instructions?: string
}

export interface LLM {
  id: string
  name: string
  provider: string
  hostedId: string
  displayName: string
  contextWindow: number
  maxOutputTokens: number
  price: number
  defaultPrompt: string
  defaultTemperature: number
  hidden: boolean
}

// Available content types in the sidebar
export type ContentType = "chats"

// Database table types
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type TablesRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

// Data types for sidebar items
export type DataItemType = Tables<"chats">
export type DataListType = Tables<"chats">[]

export * from "./chat"
export * from "./chat-message"
export * from "./llms"
export * from "./sharing"

import { Profile } from "@/db/profile"
import { Chat } from "@/db/chats"
import { Message } from "@/db/messages"

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
  embeddingsProvider: string
}

export interface ChatPayload {
  chatSettings: ChatSettings
  messages: ChatMessage[]
}

export interface ChatAPIPayload {
  chatSettings: ChatSettings
  messages: ChatMessage[]
}

export interface LLMProvider {
  id: string
  name: string
}

export interface ModelProvider {
  id: string
  name: string
}

// Type aliases for database entities
export type Tables<T extends string> = T extends "profiles" ? Profile : 
                                        T extends "chats" ? Chat : 
                                        T extends "messages" ? Message : 
                                        never

export type TablesInsert<T extends string> = T extends "profiles" ? Omit<Profile, "created_at" | "updated_at"> : 
                                              T extends "chats" ? Omit<Chat, "id" | "created_at" | "updated_at"> : 
                                              T extends "messages" ? Omit<Message, "id" | "created_at" | "updated_at"> : 
                                              never

export type TablesUpdate<T extends string> = T extends "profiles" ? Partial<Omit<Profile, "user_id" | "created_at">> : 
                                              T extends "chats" ? Partial<Omit<Chat, "id" | "user_id" | "created_at">> : 
                                              T extends "messages" ? Partial<Omit<Message, "id" | "created_at">> : 
                                              never

export type TablesRow<T extends string> = Tables<T>

// Available content types in the sidebar
export type ContentType = "chats"

// Data types for sidebar items
export type DataItemType = Tables<"chats">
export type DataListType = Tables<"chats">[]

export * from "./chat"
export * from "./chat-message"
export * from "./llms"
export * from "./sharing"
export * from "./rate-limit"

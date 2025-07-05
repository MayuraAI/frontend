// Database types for Firebase/DynamoDB integration
export interface Chat {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string | null
  workspace_id?: string
  assistant_id?: string
  folder_id?: string
  sharing?: string
}

export interface Message {
  id: string
  chat_id: string
  user_id: string
  content: string
  role: 'system' | 'user' | 'assistant'
  created_at: string
  updated_at: string | null
  image_paths?: string[]
  model?: string
  model_name?: string
  sequence_number: number
}

export interface Profile {
  id: string
  user_id: string
  username: string
  display_name: string
  profile_context: string
  has_onboarded: boolean
  created_at: string
  updated_at: string | null
}

// Type mapping for database tables
export type Tables<T extends keyof DatabaseTables> = DatabaseTables[T]

export interface DatabaseTables {
  chats: Chat
  messages: Message
  profiles: Profile
} 
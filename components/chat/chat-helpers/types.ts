export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  model_name?: string
  model_info?: string
  timestamp?: string
}

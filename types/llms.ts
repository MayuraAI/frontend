// Anthropic Models
export type AnthropicLLMID =
  | "claude-3-opus-20240229" // Claude 3 Opus
  | "claude-3-sonnet-20240229" // Claude 3 Sonnet
  | "claude-3-haiku-20240307" // Claude 3 Haiku
  | "claude-2.1" // Claude 2.1
  | "claude-2" // Claude 2
  | "claude-instant-1.2" // Claude Instant

// OpenAI Models
export type OpenAILLMID =
  | "gpt-4-0125-preview" // GPT-4 Turbo
  | "gpt-4-1106-preview" // GPT-4 Turbo
  | "gpt-4" // GPT-4
  | "gpt-3.5-turbo-0125" // GPT-3.5 Turbo
  | "gpt-3.5-turbo" // GPT-3.5 Turbo

// Google Models
export type GoogleLLMID =
  | "gemini-pro" // Gemini Pro
  | "gemini-pro-vision" // Gemini Pro Vision
  | "gemini-1.5-pro-latest" // Gemini 1.5 Pro
  | "gemini-1.5-flash" // Gemini 1.5 Flash

// Mistral Models
export type MistralLLMID =
  | "mistral-large-latest" // Mistral Large
  | "mistral-medium-latest" // Mistral Medium
  | "mistral-small-latest" // Mistral Small
  | "mistral-tiny-latest" // Mistral Tiny

// Perplexity Models
export type PerplexityLLMID =
  | "pplx-70b-online" // PPLX 70B Online
  | "pplx-7b-online" // PPLX 7B Online
  | "pplx-7b-chat" // PPLX 7B Chat
  | "codellama-34b-instruct" // Code Llama 34B
  | "llama-2-70b-chat" // Llama 2 70B Chat
  | "mixtral-8x7b-instruct" // Mixtral 8x7B

export type GroqLLMID =
  | "llama3-8b-8192" // LLaMA3-8b
  | "llama3-70b-8192" // LLaMA3-70b
  | "mixtral-8x7b-32768" // Mixtral-8x7b
  | "gemma-7b-it" // Gemma-7b IT

export type LLMID =
  | AnthropicLLMID
  | OpenAILLMID
  | GoogleLLMID
  | MistralLLMID
  | PerplexityLLMID
  | GroqLLMID

export type ModelProvider =
  | "anthropic"
  | "openai"
  | "google"
  | "mistral"
  | "perplexity"
  | "groq"

export interface LLM {
  modelId: LLMID
  modelName: string
  provider: ModelProvider
  hostedId: string
  platformLink: string
  pricing?: {
    currency: string
    unit: string
    inputCost: number
    outputCost?: number
  }
}

export interface OpenRouterLLM extends LLM {
  maxContext: number
}

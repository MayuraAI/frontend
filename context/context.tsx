import { Tables } from "@/supabase/types"
import { ChatMessage, ChatSettings } from "@/types"
import { Dispatch, SetStateAction, createContext, useState } from "react"

export interface MayuraContextProps {
  profile: Tables<"profiles"> | null
  setProfile: React.Dispatch<React.SetStateAction<Tables<"profiles"> | null>>

  chats: Tables<"chats">[]
  setChats: React.Dispatch<React.SetStateAction<Tables<"chats">[]>>

  selectedChat: Tables<"chats"> | null
  setSelectedChat: React.Dispatch<React.SetStateAction<Tables<"chats"> | null>>

  chatMessages: ChatMessage[]
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>

  isGenerating: boolean
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>

  firstTokenReceived: boolean
  setFirstTokenReceived: React.Dispatch<React.SetStateAction<boolean>>

  abortController: AbortController | null
  setAbortController: React.Dispatch<
    React.SetStateAction<AbortController | null>
  >

  userInput: string
  setUserInput: React.Dispatch<React.SetStateAction<string>>

  isAtPickerOpen: boolean
  setIsAtPickerOpen: React.Dispatch<React.SetStateAction<boolean>>

  isToolPickerOpen: boolean
  setIsToolPickerOpen: React.Dispatch<React.SetStateAction<boolean>>

  isMessageModalOpen: boolean
  setIsMessageModalOpen: React.Dispatch<React.SetStateAction<boolean>>

  chatSettings: ChatSettings
  setChatSettings: React.Dispatch<React.SetStateAction<ChatSettings>>
}

export const MayuraContext = createContext<MayuraContextProps>({
  profile: null,
  setProfile: () => {},

  chats: [],
  setChats: () => {},

  selectedChat: null,
  setSelectedChat: () => {},

  chatMessages: [],
  setChatMessages: () => {},

  isGenerating: false,
  setIsGenerating: () => {},

  firstTokenReceived: false,
  setFirstTokenReceived: () => {},

  abortController: null,
  setAbortController: () => {},

  userInput: "",
  setUserInput: () => {},

  isAtPickerOpen: false,
  setIsAtPickerOpen: () => {},

  isToolPickerOpen: false,
  setIsToolPickerOpen: () => {},

  isMessageModalOpen: false,
  setIsMessageModalOpen: () => {},

  chatSettings: {
    model: "gpt-4",
    prompt: "You are a helpful AI assistant.",
    temperature: 0.5,
    contextLength: 4096,
    includeProfileContext: true,
    embeddingsProvider: "openai"
  },
  setChatSettings: () => {}
})

export function MayuraProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null)
  const [chats, setChats] = useState<Tables<"chats">[]>([])
  const [selectedChat, setSelectedChat] = useState<Tables<"chats"> | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [firstTokenReceived, setFirstTokenReceived] = useState(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)
  const [userInput, setUserInput] = useState("")
  const [isAtPickerOpen, setIsAtPickerOpen] = useState(false)
  const [isToolPickerOpen, setIsToolPickerOpen] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    model: "gpt-4",
    prompt: "You are a helpful AI assistant.",
    temperature: 0.5,
    contextLength: 4096,
    includeProfileContext: true,
    embeddingsProvider: "openai"
  })

  return (
    <MayuraContext.Provider
      value={{
        profile,
        setProfile,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        chatMessages,
        setChatMessages,
        isGenerating,
        setIsGenerating,
        firstTokenReceived,
        setFirstTokenReceived,
        abortController,
        setAbortController,
        userInput,
        setUserInput,
        isAtPickerOpen,
        setIsAtPickerOpen,
        isToolPickerOpen,
        setIsToolPickerOpen,
        isMessageModalOpen,
        setIsMessageModalOpen,
        chatSettings,
        setChatSettings
      }}
    >
      {children}
    </MayuraContext.Provider>
  )
}

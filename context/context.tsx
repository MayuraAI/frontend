import { Profile } from "@/db/profile"
import { Chat } from "@/db/chats"
import { ChatMessage, ChatSettings } from "@/types"
import { RateLimitStatus } from "@/types/rate-limit"
import { Dispatch, SetStateAction, createContext, useState } from "react"

export interface MayuraContextProps {
  profile: Profile | null
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>

  chats: Chat[]
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>

  selectedChat: Chat | null
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>

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

  rateLimitStatus: RateLimitStatus | null
  setRateLimitStatus: React.Dispatch<
    React.SetStateAction<RateLimitStatus | null>
  >

  rateLimitRefreshTrigger: number
  refreshRateLimit: () => void
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

  rateLimitStatus: null,
  setRateLimitStatus: () => {},

  rateLimitRefreshTrigger: 0,
  refreshRateLimit: () => {}
})

export function MayuraProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [firstTokenReceived, setFirstTokenReceived] = useState(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)
  const [userInput, setUserInput] = useState("")
  const [isAtPickerOpen, setIsAtPickerOpen] = useState(false)
  const [isToolPickerOpen, setIsToolPickerOpen] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [rateLimitStatus, setRateLimitStatus] =
    useState<RateLimitStatus | null>(null)
  const [rateLimitRefreshTrigger, setRateLimitRefreshTrigger] =
    useState<number>(0)

  const refreshRateLimit = () => {
    // Trigger a refresh in the RateLimitStatus component by updating a counter
    setRateLimitRefreshTrigger(prev => prev + 1)
  }

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
        rateLimitStatus,
        setRateLimitStatus,
        rateLimitRefreshTrigger,
        refreshRateLimit
      }}
    >
      {children}
    </MayuraContext.Provider>
  )
}

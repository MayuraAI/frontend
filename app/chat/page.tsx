"use client"

import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { MayuraChat } from "@/components/chat/mayura-chat"
import { MayuraContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useContext, useEffect, useState } from "react"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { profile, chats } = useContext(MayuraContext)
  const [isLoading, setIsLoading] = useState(true)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  useEffect(() => {
    const checkDataLoaded = () => {
      if (profile && chats !== undefined) {
        setIsLoading(false)
      }
    }

    checkDataLoaded()
  }, [profile, chats])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-semibold text-white">Loading chat...</div>
          <div className="size-8 animate-spin rounded-full border-y-2 border-violet-500"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    console.error("No profile found")
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="text-xl font-semibold text-red-400">Profile not found</div>
      </div>
    )
  }

  return <MayuraChat />
}

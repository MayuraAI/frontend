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

  const { chatMessages, selectedWorkspace, chats } =
    useContext(MayuraContext)
  const [isLoading, setIsLoading] = useState(true)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  useEffect(() => {
    const checkDataLoaded = () => {
      if (selectedWorkspace && chats !== undefined) {
        // console.log("Data loaded:", { selectedWorkspace, chats })
        setIsLoading(false)
      }
    }

    checkDataLoaded()
  }, [selectedWorkspace, chats])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-bold">Loading chat...</div>
          <div className="size-8 animate-spin rounded-full border-y-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!selectedWorkspace) {
    console.error("No workspace selected")
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-xl font-bold text-red-500">
          Workspace not found
        </div>
      </div>
    )
  }

  return (
        <MayuraChat />
  )
}

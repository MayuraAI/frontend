"use client"

import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatUI } from "@/components/chat/chat-ui"
import { Brand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useContext, useEffect, useState } from "react"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages, selectedWorkspace, chats } =
    useContext(ChatbotUIContext)
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
    <>
      {!chatMessages || chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Brand />
          </div>

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}

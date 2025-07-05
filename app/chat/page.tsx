"use client"

import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { MayuraChat } from "@/components/chat/mayura-chat"
import { MayuraContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useContext, useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { isAnonymousUser } from "@/lib/firebase/auth"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { profile, chats } = useContext(MayuraContext)
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  useEffect(() => {
    const checkDataLoaded = () => {
      // If user is anonymous, we don't need a profile
      if (user && isAnonymousUser()) {
        setIsLoading(false)
        return
      }
      
      // For authenticated users, we need both profile and chats
      if (user && !isAnonymousUser() && profile && chats !== undefined) {
        setIsLoading(false)
        return
      }
      
      // If no user at all, stop loading (will be handled below)
      if (!user) {
        setIsLoading(false)
      }
    }

    if (!loading) {
      checkDataLoaded()
    }
  }, [profile, chats, user, loading])

  if (loading || isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-semibold text-white">Loading chat...</div>
          <div className="size-8 animate-spin rounded-full border-y-2 border-violet-500"></div>
        </div>
      </div>
    )
  }

  // If no user at all, redirect to home
  if (!user) {
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-semibold text-white">Please sign in to continue</div>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  // Allow anonymous users to use chat without a profile
  if (!profile && user && !isAnonymousUser()) {
    console.error("No profile found for authenticated user")
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="text-xl font-semibold text-red-400">Profile not found</div>
      </div>
    )
  }

  return <MayuraChat />
}

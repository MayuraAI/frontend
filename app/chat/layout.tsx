"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { MayuraContext } from "@/context/context"
import { getChatsByUserId } from "@/db/chats"
import { supabase } from "@/lib/supabase/browser-client"
import { useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

interface ChatLayoutProps {
  children: ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatId = searchParams.get("id")

  const { profile, setChats, chats, setSelectedChat, setChatSettings } =
    useContext(MayuraContext)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) {
      setLoading(false)
      return
    }

    fetchChatData(profile.user_id)
  }, [profile])

  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find(c => c.id === chatId)
      if (chat) {
        setSelectedChat(chat)
      }
    }
  }, [chatId, chats, setSelectedChat])

  const fetchChatData = async (userId: string) => {
    if (!setChats || !setChatSettings) {
      throw new Error("Required context functions are not available")
    }

    setLoading(true)
    console.log("Fetching chat data for user:", userId)

    try {
      setChatSettings({
        model: "gpt-4",
        prompt: "You are a helpful AI assistant.",
        temperature: 0.5,
        contextLength: 4096,
        includeProfileContext: true,
        embeddingsProvider: "openai"
      })

      const chats = await getChatsByUserId(userId)
      setChats(chats)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching chat data:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="text-primary size-8 animate-spin" />
              <div className="text-center">
                <h3 className="text-foreground text-lg font-semibold">Loading your chats...</h3>
                <p className="text-muted-foreground text-sm">
                  Please wait while we set everything up
                </p>
              </div>
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-400">Error</h3>
              <p className="text-muted-foreground text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded px-4 py-2"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-foreground text-lg font-semibold">Profile Required</h3>
              <p className="text-muted-foreground text-sm">
                Please complete your profile setup first.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <Dashboard>{children}</Dashboard>
}

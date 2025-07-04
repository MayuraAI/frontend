"use client"

import { MayuraContext } from "@/context/context"
import { useAuth } from "@/context/auth-context"
import { getChatsByUserId } from "@/db/chats"
import { getProfileByUserId } from "@/db/profile"
import { Dashboard } from "@/components/ui/dashboard"
import { useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useContext, useEffect, useState, Suspense } from "react"

interface ChatLayoutProps {
  children: ReactNode
}

export default function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatLayoutContent>{children}</ChatLayoutContent>
    </Suspense>
  )
}

function ChatLayoutContent({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatId = searchParams.get("id")
  const { user, loading: authLoading } = useAuth()

  const { profile, setProfile, setChats, chats, setSelectedChat } =
    useContext(MayuraContext)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!profile && user) {
        setLoading(true)
        try {
          const profile = await getProfileByUserId(user.uid)
          setProfile(profile)
        } catch (error) {
          console.error("Error loading profile:", error)
        }
      }
    }
    
    if (authLoading) return
    
    if (!user) {
      return router.push("/login")
    }

    loadProfile()

    if (profile) {
      fetchChatData(profile.user_id)
    }
  }, [profile, user, authLoading, router, setProfile])

  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find(c => c.id === chatId)
      if (chat) {
        setSelectedChat(chat)
      }
    }
  }, [chatId, chats, setSelectedChat])

  const fetchChatData = async (userId: string) => {
    if (!setChats) {
      throw new Error("Required context functions are not available")
    }

    setLoading(true)
    try {
      const chats = await getChatsByUserId(userId)
      setChats(Array.isArray(chats) ? chats : [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching chat data:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      setChats([])
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-semibold text-white">Loading...</div>
          <div className="size-8 animate-spin rounded-full border-y-2 border-violet-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="text-xl font-semibold text-red-400">Error: {error}</div>
      </div>
    )
  }

  return (
    <Dashboard>
      {children}
    </Dashboard>
  )
}

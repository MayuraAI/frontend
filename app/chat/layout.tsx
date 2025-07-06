"use client"

import { MayuraContext } from "@/context/context"
import { useAuth } from "@/context/auth-context"
import { getCurrentUserChats } from "@/db/chats"
import { getCurrentUserProfile } from "@/db/profile"
import { Dashboard } from "@/components/ui/dashboard"
import { useRouter, usePathname } from "next/navigation"
import { ReactNode, useContext, useEffect, useState, Suspense, useCallback } from "react"
import { getCurrentUser, signInAnonymouslyUser } from "@/lib/firebase/auth"

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
  const pathname = usePathname()
  // Extract chat ID from pathname like /chat/[chatid]
  const chatId = pathname.startsWith('/chat/') ? pathname.split('/chat/')[1] : null
  const { user, loading: authLoading } = useAuth()

  const { profile, setProfile, setChats, chats, setSelectedChat } =
    useContext(MayuraContext)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSigningInAnonymously, setIsSigningInAnonymously] = useState(false)

  const fetchChatData = useCallback(async (userId: string) => {
    if (!setChats) {
      throw new Error("Required context functions are not available")
    }

    setLoading(true)
    try {
      const chats = await getCurrentUserChats()
      setChats(Array.isArray(chats) ? chats : [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching chat data:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      setChats([])
      setLoading(false)
    }
  }, [setChats])

  useEffect(() => {
    const loadProfile = async () => {
      // Skip profile loading for anonymous users
      if (user && user.isAnonymous) {
        setLoading(false)
        return
      }
      
      if (!profile && user && !user.isAnonymous) {
        setLoading(true)
        try {
          const userProfile = await getCurrentUserProfile()
          setProfile(userProfile)
        } catch (error) {
          console.error("Error loading profile:", error)
        }
      }
    }
    
    if (authLoading || isSigningInAnonymously) return
    
    // Sign in anonymously only after we are sure there's no user and auth has fully initialized
    if (!user && !authLoading && !isSigningInAnonymously) {
      // console.log("👤 No user found after auth loading. Signing in anonymously...")
      setIsSigningInAnonymously(true)
      signInAnonymouslyUser()
        .then(() => {
          // console.log("✅ Successfully signed in anonymously")
          setIsSigningInAnonymously(false)
        })
        .catch((error) => {
          console.error("❌ Error signing in anonymously:", error)
          setIsSigningInAnonymously(false)
          router.push("/login")
        })
    }


    loadProfile()

    // Fetch chat data for all users (authenticated and anonymous)
    if (user) {
      fetchChatData("")
    }
  }, [profile, user, authLoading, router, setProfile, setChats, fetchChatData, isSigningInAnonymously])

  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find(c => c.id === chatId)
      if (chat) {
        setSelectedChat(chat)
      } else {
        // Chat ID in URL doesn't match any of the user's chats
        // This means they're trying to access a chat that doesn't belong to them
        console.log("Chat ID in URL doesn't belong to user, redirecting to /chat")
        router.push("/chat")
        return
      }
    }
  }, [chatId, chats, setSelectedChat, router])

  // Function to refetch chats (useful when new chats are created)
  const refetchChats = useCallback(() => {
    if (user) {
      fetchChatData("")
    }
  }, [user, fetchChatData])

  // Add refetchChats to context (if needed)
  // This can be used by chat handler when new chats are created

  if (authLoading || loading || isSigningInAnonymously) {
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-semibold text-white">
            {isSigningInAnonymously ? "Setting up anonymous session..." : "Loading..."}
          </div>
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

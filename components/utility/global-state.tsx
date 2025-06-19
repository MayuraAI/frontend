"use client"

import { FC, ReactNode, useContext, useEffect } from "react"
import { MayuraContext } from "@/context/context"
import { getProfileByUserId } from "@/db/profile"
import { supabase } from "@/lib/supabase/browser-client"
import { useRouter } from "next/navigation"

interface GlobalStateProps {
  children: ReactNode
}

export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const router = useRouter()
  const {
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
    isMessageModalOpen,
    setIsMessageModalOpen,
    setChatSettings
  } = useContext(MayuraContext)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const session = (await supabase.auth.getSession()).data.session
        if (!session) {
          console.log("No session found, redirecting to login")
          return router.push("/login")
        }

        // Load profile
        const profile = await getProfileByUserId(session.user.id)
        if (profile) {
          setProfile(profile)
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadInitialData()
  }, [router, setProfile])

  // Clear state on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      setProfile(null)
      setChats([])
      setSelectedChat(null)
      setChatMessages([])
      setIsGenerating(false)
      setIsMessageModalOpen(false)
      setChatSettings({
        model: "gpt-4",
        prompt: "You are a helpful AI assistant.",
        temperature: 0.5,
        contextLength: 4096,
        includeProfileContext: true,
        embeddingsProvider: "openai"
      })
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [
    setProfile,
    setChats,
    setSelectedChat,
    setChatMessages,
    setIsGenerating,
    setIsMessageModalOpen,
    setChatSettings
  ])

  return <>{children}</>
}

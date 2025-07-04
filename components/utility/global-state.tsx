"use client"

import { FC, ReactNode, useContext, useEffect } from "react"
import { MayuraContext } from "@/context/context"
import { useAuth } from "@/context/auth-context"
import { getProfileByUserId } from "@/db/profile"
import { useRouter } from "next/navigation"

interface GlobalStateProps {
  children: ReactNode
}

export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
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
        if (authLoading) {
          console.log("🔄 Auth still loading...")
          return
        }

        if (!user) {
          console.log("❌ No user found in global state")
          setProfile(null)
          return
        }

        // Only load profile if we don't have one yet
        if (!profile) {
          console.log("📡 Loading profile for user:", user.uid)
          try {
            const userProfile = await getProfileByUserId(user.uid)
            if (userProfile) {
              console.log("✅ Profile loaded in global state:", userProfile)
              setProfile(userProfile)
              
              // If profile exists but user hasn't onboarded, they should be on setup page
              if (!userProfile.has_onboarded && window.location.pathname !== "/setup") {
                console.log("🚀 User hasn't onboarded, should be on setup page")
                router.push("/setup")
                return
              }
            }
          } catch (error) {
            console.error("❌ Error loading profile in global state:", error)
          }
        } else {
          console.log("✅ Profile already loaded:", profile.username)
        }
      } catch (error) {
        console.error("❌ Error in global state loadInitialData:", error)
      }
    }

    loadInitialData()
  }, [user, authLoading, router, setProfile, profile])

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

"use client"

import { FC, ReactNode, useContext, useEffect } from "react"
import { MayuraContext } from "@/context/context"
import { useAuth } from "@/context/auth-context"
import { getProfileByUserId } from "@/db/profile"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/firebase/auth"

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
  } = useContext(MayuraContext)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (authLoading) {
          // console.log("🔄 Auth still loading...")
          return
        }

        if (!user) {
          // console.log("❌ No user found in global state")
          setProfile(null)
          setChats([]) // Ensure chats are empty array when no user
          return
        }

        // Skip profile loading for anonymous users but load their chats
        if (user.isAnonymous) {
          // console.log("👤 Anonymous user, skipping profile loading")
          setProfile(null)
          // Load chats for anonymous users using their Firebase anonymous UID
          // This will be handled by the chat layout component
          return
        }

        // Only load profile if we don't have one yet
        if (!profile) {
          // console.log("📡 Loading profile for user:", user.uid)
          try {
            const userProfile = await getProfileByUserId(user.uid)
            if (userProfile) {
              // console.log("✅ Profile loaded in global state:", userProfile)
              setProfile(userProfile)
              
              // If profile exists but user hasn't onboarded, they should be on setup page
              if (!userProfile.has_onboarded && window.location.pathname !== "/setup" && getCurrentUser()?.emailVerified) {
                // console.log("🚀 User hasn't onboarded, should be on setup page")
                router.push("/setup")
                return
              }
            } else {
              // console.log("⚠️ No profile found for user, should create one or redirect to setup")
              setProfile(null)
              // Only redirect to setup if user is not anonymous and not already on setup page
              if (!user.isAnonymous && window.location.pathname !== "/setup" && getCurrentUser()?.emailVerified) {
                // console.log("🚀 Redirecting to setup user profile slgdjoahg")
                router.push("/setup")
                return
              }
            }
          } catch (error) {
            console.error("❌ Error loading profile in global state:", error)
            setProfile(null)
          }
        } else {
          // console.log("✅ Profile already loaded:", profile.username)
        }
      } catch (error) {
        console.error("❌ Error in global state loadInitialData:", error)
        // Ensure clean state on error
        setProfile(null)
        setChats([])
      }
    }

    loadInitialData()
  }, [user, authLoading, router, setProfile, setChats, profile])

  // Clear state on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      setProfile(null)
      setChats([])
      setSelectedChat(null)
      setChatMessages([])
      setIsGenerating(false)
      setIsMessageModalOpen(false)
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
  ])

  return <>{children}</>
}

"use client"

import { ChatbotUIContext } from "@/context/context"
import { getProfileByUserId } from "@/db/profile"
import { getWorkspacesByUserId } from "@/db/workspaces"
import { supabase } from "@/lib/supabase/browser-client"
import { useRouter } from "next/navigation"
import { FC, ReactNode, useContext, useEffect } from "react"

interface GlobalStateProps {
  children: ReactNode
}

export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const router = useRouter()
  const {
    setProfile,
    setWorkspaces,
    setSelectedWorkspace,
    setChats,
    setSelectedChat,
    setChatMessages,
    setIsGenerating,
    setFirstTokenReceived,
    setAbortController,
    setUserInput,
    setIsAtPickerOpen,
    setIsToolPickerOpen,
    setIsMessageModalOpen,
    setChatSettings
  } = useContext(ChatbotUIContext)

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

          // Load workspaces
          const workspaces = await getWorkspacesByUserId(session.user.id)
          if (workspaces) {
            setWorkspaces(workspaces)
            const homeWorkspace = workspaces.find(w => w.is_home)
            if (homeWorkspace) {
              setSelectedWorkspace(homeWorkspace)
            }
          }
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadInitialData()
  }, [router, setProfile, setWorkspaces, setSelectedWorkspace])

  // Clear state on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      setProfile(null)
      setSelectedWorkspace(null)
      setWorkspaces([])
      setChats([])
      setSelectedChat(null)
      setChatMessages([])
      setIsGenerating(false)
      setFirstTokenReceived(false)
      setAbortController(null)
      setUserInput("")
      setIsAtPickerOpen(false)
      setIsToolPickerOpen(false)
      setIsMessageModalOpen(false)
      setChatSettings({
        model: "gpt-4",
        prompt: "You are a helpful AI assistant.",
        temperature: 0.5,
        contextLength: 4096,
        includeProfileContext: true,
        includeWorkspaceInstructions: true,
        embeddingsProvider: "openai"
      })
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [
    setProfile,
    setSelectedWorkspace,
    setWorkspaces,
    setChats,
    setSelectedChat,
    setChatMessages,
    setIsGenerating,
    setFirstTokenReceived,
    setAbortController,
    setUserInput,
    setIsAtPickerOpen,
    setIsToolPickerOpen,
    setIsMessageModalOpen,
    setChatSettings
  ])

  return <>{children}</>
}

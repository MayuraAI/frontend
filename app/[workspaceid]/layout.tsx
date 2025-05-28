"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { ChatbotUIContext } from "@/context/context"
import { getChatsByWorkspaceId } from "@/db/chats"
import { getWorkspaceById } from "@/db/workspaces"
import { supabase } from "@/lib/supabase/browser-client"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const router = useRouter()

  const params = useParams()
  const searchParams = useSearchParams()
  const workspaceId = params.workspaceid as string

  const {
    setChatSettings,
    setChats,
    selectedWorkspace,
    setSelectedWorkspace,
    setSelectedChat,
    setChatMessages,
    setUserInput,
    setIsGenerating,
    setFirstTokenReceived
  } = useContext(ChatbotUIContext)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const session = (await supabase.auth.getSession()).data.session

        if (!session) {
          console.log("No session found, redirecting to login")
          return router.push("/login")
        }

        if (!setSelectedWorkspace || !setChats || !setChatSettings) {
          console.error("Required context functions are not available")
          return
        }

        // Reset state first
        setUserInput("")
        setChatMessages([])
        setSelectedChat(null)
        setIsGenerating(false)
        setFirstTokenReceived(false)

        // Then fetch new data
        await fetchWorkspaceData(workspaceId)
      } catch (error) {
        console.error("Error in workspace layout:", error)
        setLoading(false)
        if (error instanceof Error && error.message.includes("auth")) {
          return router.push("/login")
        }
      }
    })()
  }, [
    workspaceId,
    router,
    setSelectedWorkspace,
    setChats,
    setChatSettings,
    setUserInput,
    setChatMessages,
    setSelectedChat,
    setIsGenerating,
    setFirstTokenReceived
  ])

  const fetchWorkspaceData = async (workspaceId: string) => {
    if (!setSelectedWorkspace || !setChats || !setChatSettings) {
      throw new Error("Required context functions are not available")
    }

    setLoading(true)
    console.log("Fetching workspace data for:", workspaceId)

    try {
      const workspace = await getWorkspaceById(workspaceId)
      // console.log("Fetched workspace:", workspace)

      if (!workspace) {
        console.error("Workspace not found")
        throw new Error("Workspace not found")
      }

      setSelectedWorkspace(workspace)

      setChatSettings({
        model: "gpt-4",
        prompt: workspace.instructions || "You are a helpful AI assistant.",
        temperature: 0.5,
        contextLength: 4096,
        includeProfileContext: workspace.include_profile_context,
        includeWorkspaceInstructions: workspace.include_workspace_instructions,
        embeddingsProvider: "openai"
      })

      const chats = await getChatsByWorkspaceId(workspaceId)
      // console.log("Fetched chats:", chats)
      setChats(chats)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching workspace data:", error)
      setLoading(false)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-bold">Loading workspace...</div>
          <div className="size-8 animate-spin rounded-full border-y-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return <Dashboard>{children}</Dashboard>
}

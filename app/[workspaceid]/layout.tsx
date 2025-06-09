"use client"

import { Dashboard } from "@/components/ui/dashboard"
import { MayuraContext } from "@/context/context"
import { getChatsByWorkspaceId } from "@/db/chats"
import { getWorkspaceById } from "@/db/workspaces"
import { supabase } from "@/lib/supabase/browser-client"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

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
  } = useContext(MayuraContext)

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
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-6 p-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Loading workspace</h2>
            </div>
            <div className="w-full space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Setting up your workspace environment...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <Dashboard>{children}</Dashboard>
}

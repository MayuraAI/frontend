"use client"

import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { ChatbotUIContext } from "@/context/context"
import { createWorkspace } from "@/db/workspaces"
import useHotkey from "@/lib/hooks/use-hotkey"
import { IconBuilding, IconHome, IconPlus } from "@tabler/icons-react"
import { ChevronsUpDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface WorkspaceSwitcherProps {}

export const WorkspaceSwitcher: FC<WorkspaceSwitcherProps> = ({}) => {
  useHotkey(";", () => setOpen(prevState => !prevState))

  const {
    profile,
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    setWorkspaces
  } = useContext(ChatbotUIContext)

  const { handleNewChat } = useChatHandler()

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const value = selectedWorkspace?.id || ""

  const getWorkspaceName = (workspaceId: string) => {
    return (
      workspaces.find(workspace => workspace.id === workspaceId)?.name || ""
    )
  }

  const handleCreateWorkspace = async () => {
    if (!profile) return

    const createdWorkspace = await createWorkspace({
      user_id: profile.user_id,
      name: "New Workspace",
      default_prompt: "You are a helpful AI assistant.",
      instructions: "",
      include_profile_context: true,
      include_workspace_instructions: true,
      is_home: false
    })

    setSelectedWorkspace(createdWorkspace)
    setWorkspaces(prevState => [...prevState, createdWorkspace])
    setOpen(false)

    router.push(`/${createdWorkspace.id}/chat`)
  }

  const handleSelect = (workspaceId: string) => {
    const workspace = workspaces.find(workspace => workspace.id === workspaceId)

    if (!workspace) return

    setSelectedWorkspace(workspace)
    setOpen(false)

    return router.push(`/${workspace.id}/chat`)
  }

  const IconComponent = selectedWorkspace?.is_home ? IconHome : IconBuilding

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="border-input flex h-[36px]
        w-full cursor-pointer items-center justify-between rounded-md border px-2 py-1 hover:opacity-50"
      >
        <div className="flex items-center truncate">
          {selectedWorkspace && (
            <div className="flex items-center">
              <IconComponent className="mb-0.5 mr-2" size={22} />
            </div>
          )}

          {getWorkspaceName(value) || "Select workspace..."}
        </div>

        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent className="p-2">
        <div className="space-y-2">
          <Button
            className="flex w-full items-center space-x-2"
            size="sm"
            onClick={handleCreateWorkspace}
          >
            <IconPlus />
            <div className="ml-2">New Workspace</div>
          </Button>

          <Input
            placeholder="Search workspaces..."
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="flex flex-col space-y-1">
            {workspaces
              .filter(workspace => workspace.is_home)
              .map(workspace => (
                <Button
                  key={workspace.id}
                  className="flex items-center justify-start"
                  variant="ghost"
                  onClick={() => handleSelect(workspace.id)}
                >
                  <IconHome className="mr-3" size={28} />

                  <div className="text-lg font-semibold">{workspace.name}</div>
                </Button>
              ))}

            {workspaces
              .filter(
                workspace =>
                  !workspace.is_home &&
                  workspace.name.toLowerCase().includes(search.toLowerCase())
              )
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(workspace => (
                <Button
                  key={workspace.id}
                  className="flex items-center justify-start"
                  variant="ghost"
                  onClick={() => handleSelect(workspace.id)}
                >
                  <IconBuilding className="mr-3" size={28} />

                  <div className="text-lg font-semibold">{workspace.name}</div>
                </Button>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

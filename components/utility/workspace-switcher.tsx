"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { MayuraContext } from "@/context/context"
import { createWorkspace } from "@/db/workspaces"
import useHotkey from "@/lib/hooks/use-hotkey"
import { Building, Home, Plus, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { cn } from "@/lib/utils"

interface WorkspaceSwitcherProps {}

export const WorkspaceSwitcher: FC<WorkspaceSwitcherProps> = ({}) => {
  useHotkey(";", () => setOpen(prevState => !prevState))

  const {
    profile,
    workspaces,
    selectedWorkspace,
    setSelectedWorkspace,
    setWorkspaces
  } = useContext(MayuraContext)

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const value = selectedWorkspace?.id || ""

  const getWorkspaceName = (workspaceId: string) => {
    return (
      workspaces.find(workspace => workspace.id === workspaceId)?.name || ""
    )
  }

  const getWorkspaceIcon = (workspaceName: string) => {
    return workspaceName.charAt(0).toUpperCase()
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto w-full justify-between border p-3",
            open && "bg-accent"
          )}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Select workspace"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {selectedWorkspace
                  ? getWorkspaceIcon(selectedWorkspace.name)
                  : "W"}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground truncate text-left font-medium">
              {getWorkspaceName(value) || "Select workspace..."}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={cn(
              "text-muted-foreground shrink-0 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-2"
        align="start"
        role="menu"
        aria-orientation="vertical"
      >
        <div className="space-y-2">
          <Button
            className="w-full justify-start gap-2"
            size="sm"
            onClick={handleCreateWorkspace}
            role="menuitem"
          >
            <Plus size={16} />
            <span>New Workspace</span>
          </Button>

          <Input
            placeholder="Search workspaces..."
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9"
          />

          <div className="flex max-h-64 flex-col space-y-1 overflow-y-auto">
            {workspaces
              .filter(workspace => workspace.is_home)
              .map(workspace => (
                <Button
                  key={workspace.id}
                  className="h-auto justify-start gap-3 p-3"
                  variant="ghost"
                  onClick={() => handleSelect(workspace.id)}
                  role="menuitem"
                >
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Home size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-foreground truncate font-medium">
                    {workspace.name}
                  </span>
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
                  className="h-auto justify-start gap-3 p-3"
                  variant="ghost"
                  onClick={() => handleSelect(workspace.id)}
                  role="menuitem"
                >
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getWorkspaceIcon(workspace.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-foreground truncate font-medium">
                    {workspace.name}
                  </span>
                </Button>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

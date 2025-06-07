"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { MayuraContext } from "@/context/context"
import { createWorkspace } from "@/db/workspaces"
import useHotkey from "@/lib/hooks/use-hotkey"
import { IconBuilding, IconHome, IconPlus, IconChevronDown } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
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
            "focus-ring w-full flex items-center justify-between p-3 rounded-lg hover:bg-interactive-hover transition-smooth",
            open && "bg-interactive-hover"
          )}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Select workspace"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-interactive-active flex items-center justify-center flex-shrink-0 text-brand-primary font-semibold">
              <span aria-hidden="true">
                {selectedWorkspace ? getWorkspaceIcon(selectedWorkspace.name) : "W"}
              </span>
            </div>
            <span className="font-medium text-left truncate text-text-primary">
              {getWorkspaceName(value) || "Select workspace..."}
            </span>
          </div>
          <IconChevronDown 
            size={20} 
            className={cn(
              "text-text-muted transition-smooth flex-shrink-0",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-80 p-2 bg-bg-tertiary border border-border-color shadow-mayura-lg"
        align="start"
        role="menu"
        aria-orientation="vertical"
      >
        <div className="space-y-2">
          <Button
            className="flex w-full items-center justify-start gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white"
            size="sm"
            onClick={handleCreateWorkspace}
            role="menuitem"
          >
            <IconPlus size={16} />
            <span>New Workspace</span>
          </Button>

          <Input
            placeholder="Search workspaces..."
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-bg-secondary border-border-color focus:border-brand-primary"
          />

          <div className="flex flex-col space-y-1 max-h-64 overflow-y-auto">
            {workspaces
              .filter(workspace => workspace.is_home)
              .map(workspace => (
                <Button
                  key={workspace.id}
                  className="flex items-center justify-start gap-3 p-3 hover:bg-interactive-hover text-left h-auto"
                  variant="ghost"
                  onClick={() => handleSelect(workspace.id)}
                  role="menuitem"
                >
                  <div className="w-9 h-9 rounded-lg bg-interactive-active flex items-center justify-center flex-shrink-0 text-brand-primary font-semibold">
                    <IconHome size={20} />
                  </div>
                  <span className="font-medium truncate text-text-primary">
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
                  className="flex items-center justify-start gap-3 p-3 hover:bg-interactive-hover text-left h-auto"
                  variant="ghost"
                  onClick={() => handleSelect(workspace.id)}
                  role="menuitem"
                >
                  <div className="w-9 h-9 rounded-lg bg-interactive-active flex items-center justify-center flex-shrink-0 text-brand-primary font-semibold">
                    <span aria-hidden="true">
                      {getWorkspaceIcon(workspace.name)}
                    </span>
                  </div>
                  <span className="font-medium truncate text-text-primary">
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

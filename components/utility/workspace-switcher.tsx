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
            "focus-ring hover:bg-interactive-hover transition-smooth flex w-full items-center justify-between rounded-lg p-3",
            open && "bg-interactive-hover"
          )}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Select workspace"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="bg-interactive-active text-brand-primary flex size-9 shrink-0 items-center justify-center rounded-lg font-semibold">
              <span aria-hidden="true">
                {selectedWorkspace ? getWorkspaceIcon(selectedWorkspace.name) : "W"}
              </span>
            </div>
            <span className="text-text-primary truncate text-left font-medium">
              {getWorkspaceName(value) || "Select workspace..."}
            </span>
          </div>
          <IconChevronDown 
            size={20} 
            className={cn(
              "text-text-muted transition-smooth shrink-0",
              open && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="bg-bg-tertiary border-border-color shadow-mayura-lg w-80 border p-2"
        align="start"
        role="menu"
        aria-orientation="vertical"
      >
        <div className="space-y-2">
          <Button
            className="bg-brand-primary hover:bg-brand-primary/90 flex w-full items-center justify-start gap-2 text-white"
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

          <div className="flex max-h-64 flex-col space-y-1 overflow-y-auto">
            {workspaces
              .filter(workspace => workspace.is_home)
              .map(workspace => (
                <Button
                  key={workspace.id}
                  className="hover:bg-interactive-hover flex h-auto items-center justify-start gap-3 p-3 text-left"
                  variant="ghost"
                  onClick={() => handleSelect(workspace.id)}
                  role="menuitem"
                >
                  <div className="bg-interactive-active text-brand-primary flex size-9 shrink-0 items-center justify-center rounded-lg font-semibold">
                    <IconHome size={20} />
                  </div>
                  <span className="text-text-primary truncate font-medium">
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
                  className="hover:bg-interactive-hover flex h-auto items-center justify-start gap-3 p-3 text-left"
                  variant="ghost"
                  onClick={() => handleSelect(workspace.id)}
                  role="menuitem"
                >
                  <div className="bg-interactive-active text-brand-primary flex size-9 shrink-0 items-center justify-center rounded-lg font-semibold">
                    <span aria-hidden="true">
                      {getWorkspaceIcon(workspace.name)}
                    </span>
                  </div>
                  <span className="text-text-primary truncate font-medium">
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

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
            "h-auto w-full justify-between border-2 border-black bg-white p-4 font-bold shadow-[3px_3px_0px_0px_black] transition-all duration-150",
            open && "translate-x-[-1px] translate-y-[-1px] shadow-[4px_4px_0px_0px_black]",
            "hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_black]"
          )}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Select workspace"
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* <div className="border-2 border-black bg-black p-2 shadow-[2px_2px_0px_0px_black]">
              <span className="font-mono text-sm font-bold text-white">
                {selectedWorkspace
                  ? getWorkspaceIcon(selectedWorkspace.name)
                  : "W"}
              </span>
            </div> */}
            <span className="truncate text-left font-sans font-black tracking-wide text-black">
              {getWorkspaceName(value) || "SELECT WORKSPACE..."}
            </span>
          </div>
          <ChevronDown
            size={18}
            className={cn(
              "shrink-0 text-black transition-transform duration-200",
              open && "rotate-180"
            )}
            strokeWidth={3}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_black]"
        align="start"
        role="menu"
        aria-orientation="vertical"
      >
        <div className="space-y-3">
          <Button
            className="w-full justify-start gap-2"
            size="sm"
            onClick={handleCreateWorkspace}
            role="menuitem"
          >
            <Plus size={16} />
            <span>New Workspace</span>
          </Button>

          <div className="flex max-h-64 flex-col space-y-2 overflow-y-auto">
            {workspaces
              .filter(workspace => workspace.is_home)
              .map(workspace => (
                <Button
                  key={workspace.id}
                  className="h-auto w-full justify-start gap-3 border-2 border-black bg-white p-3 font-bold text-black shadow-[2px_2px_0px_0px_black] transition-all duration-150 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:bg-neobrutalist-yellow hover:shadow-[3px_3px_0px_0px_black]"
                  onClick={() => handleSelect(workspace.id)}
                  role="menuitem"
                >
                  {/* <div className="border-2 border-black bg-black p-2 shadow-[1px_1px_0px_0px_black]">
                    <Home size={14} strokeWidth={3} className="text-white" />
                  </div> */}
                  <span className="truncate font-sans font-black tracking-wide">
                    {workspace.name}
                  </span>
                </Button>
              ))}

            {workspaces
              .filter(workspace => !workspace.is_home)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(workspace => (
                <Button
                  key={workspace.id}
                  className="h-auto w-full justify-start gap-3 border-2 border-black bg-white p-3 font-bold text-black shadow-[2px_2px_0px_0px_black] transition-all duration-150 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:bg-neobrutalist-yellow hover:shadow-[3px_3px_0px_0px_black]"
                  onClick={() => handleSelect(workspace.id)}
                  role="menuitem"
                >
                  {/* <div className="border-2 border-black bg-black p-2 shadow-[1px_1px_0px_0px_black]">
                    <span className="font-mono text-sm font-bold text-white">
                      {getWorkspaceIcon(workspace.name)}
                    </span>
                  </div> */}
                  <span className="truncate font-sans font-black tracking-wide">
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

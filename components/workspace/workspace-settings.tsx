import { ChatbotUIContext } from "@/context/context"
import { WORKSPACE_INSTRUCTIONS_MAX } from "@/db/limits"
import { updateWorkspace } from "@/db/workspaces"
import { IconHome, IconSettings } from "@tabler/icons-react"
import { FC, useContext, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { LimitDisplay } from "../ui/limit-display"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { WithTooltip } from "../ui/with-tooltip"
import { DeleteWorkspace } from "./delete-workspace"
import { Checkbox } from "../ui/checkbox"
import { IconInfoCircle } from "@tabler/icons-react"

interface WorkspaceSettingsProps {}

export const WorkspaceSettings: FC<WorkspaceSettingsProps> = ({}) => {
  const { profile, selectedWorkspace, setSelectedWorkspace, setWorkspaces } =
    useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)

  const [name, setName] = useState(selectedWorkspace?.name || "")
  const [defaultPrompt, setDefaultPrompt] = useState(
    selectedWorkspace?.default_prompt || ""
  )
  const [instructions, setInstructions] = useState(
    selectedWorkspace?.instructions || ""
  )
  const [includeProfileContext, setIncludeProfileContext] = useState(
    selectedWorkspace?.include_profile_context || false
  )
  const [includeWorkspaceInstructions, setIncludeWorkspaceInstructions] =
    useState(selectedWorkspace?.include_workspace_instructions || false)

  const handleSave = async () => {
    if (!selectedWorkspace) return

    const updatedWorkspace = await updateWorkspace(selectedWorkspace.id, {
      name,
      default_prompt: defaultPrompt,
      instructions,
      include_profile_context: includeProfileContext,
      include_workspace_instructions: includeWorkspaceInstructions,
      updated_at: new Date().toISOString()
    })

    setIsOpen(false)
    setSelectedWorkspace(updatedWorkspace)
    setWorkspaces(workspaces => {
      return workspaces.map(workspace => {
        if (workspace.id === selectedWorkspace.id) {
          return updatedWorkspace
        }

        return workspace
      })
    })

    toast.success("Workspace updated!")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      buttonRef.current?.click()
    }
  }

  if (!selectedWorkspace || !profile) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <WithTooltip
          display={<div>Workspace Settings</div>}
          trigger={
            <IconSettings
              className="ml-3 cursor-pointer pr-[5px] hover:opacity-50"
              size={32}
              onClick={() => setIsOpen(true)}
            />
          }
        />
      </SheetTrigger>

      <SheetContent
        className="flex flex-col justify-between"
        side="left"
        onKeyDown={handleKeyDown}
      >
        <div className="grow overflow-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              Workspace Settings
              {selectedWorkspace?.is_home && <IconHome />}
            </SheetTitle>

            {selectedWorkspace?.is_home && (
              <div className="text-sm font-light">
                This is your home workspace for personal use.
              </div>
            )}
          </SheetHeader>

          <Tabs defaultValue="main">
            <TabsContent className="mt-4 space-y-4" value="main">
              <>
                <div className="space-y-1">
                  <Label>Workspace Name</Label>

                  <Input
                    placeholder="Name..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label>Default Prompt</Label>

                  <Input
                    placeholder="Default prompt... (optional)"
                    value={defaultPrompt}
                    onChange={e => setDefaultPrompt(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label>Instructions</Label>

                    <LimitDisplay
                      used={instructions.length}
                      limit={WORKSPACE_INSTRUCTIONS_MAX}
                    />
                  </div>

                  <TextareaAutosize
                    placeholder="Instructions... (optional)"
                    value={instructions}
                    onValueChange={setInstructions}
                    maxLength={WORKSPACE_INSTRUCTIONS_MAX}
                    minRows={3}
                    maxRows={8}
                  />
                </div>

                <div className="mt-7 flex items-center space-x-2">
                  <Checkbox
                    checked={includeProfileContext}
                    onCheckedChange={(value: boolean) =>
                      setIncludeProfileContext(value)
                    }
                  />

                  <Label>Include Profile Context</Label>

                  <WithTooltip
                    delayDuration={0}
                    display={
                      <div className="w-[400px] p-3">
                        {profile?.profile_context || "No profile context."}
                      </div>
                    }
                    trigger={
                      <IconInfoCircle
                        className="cursor-hover:opacity-50"
                        size={16}
                      />
                    }
                  />
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <Checkbox
                    checked={includeWorkspaceInstructions}
                    onCheckedChange={(value: boolean) =>
                      setIncludeWorkspaceInstructions(value)
                    }
                  />

                  <Label>Include Workspace Instructions</Label>
                </div>

                {!selectedWorkspace.is_home && (
                  <DeleteWorkspace
                    workspace={selectedWorkspace}
                    onDelete={() => setIsOpen(false)}
                  />
                )}
              </>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end">
          <Button ref={buttonRef} onClick={handleSave}>
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

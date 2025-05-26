import { ChatbotUIContext } from "@/context/context"
import { WORKSPACE_INSTRUCTIONS_MAX } from "@/db/limits"
import { updateWorkspace } from "@/db/workspaces"
import { ChatSettings } from "@/types"
import { IconHome, IconSettings } from "@tabler/icons-react"
import { FC, useContext, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { ChatSettingsForm } from "../ui/chat-settings-form"
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
  const {
    profile,
    selectedWorkspace,
    setSelectedWorkspace,
    setWorkspaces,
    chatSettings,
    setChatSettings
  } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)

  const [name, setName] = useState(selectedWorkspace?.name || "")
  const [description, setDescription] = useState(
    selectedWorkspace?.description || ""
  )
  const [instructions, setInstructions] = useState(
    selectedWorkspace?.instructions || ""
  )

  const [localChatSettings, setLocalChatSettings] = useState<ChatSettings>({
    ...chatSettings
  })

  useEffect(() => {
    if (selectedWorkspace) {
      setLocalChatSettings({
        ...chatSettings,
        includeProfileContext: selectedWorkspace.include_profile_context,
        includeWorkspaceInstructions:
          selectedWorkspace.include_workspace_instructions
      })
    }
  }, [selectedWorkspace, chatSettings])

  const handleSave = async () => {
    if (!selectedWorkspace) return

    const updatedWorkspace = await updateWorkspace(selectedWorkspace.id, {
      name,
      description,
      instructions,
      include_profile_context: localChatSettings.includeProfileContext,
      include_workspace_instructions:
        localChatSettings.includeWorkspaceInstructions,
      updated_at: new Date().toISOString()
    })

    setChatSettings(localChatSettings)

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
                  <Label>Description</Label>

                  <Input
                    placeholder="Default prompt... (optional)"
                    value={defaultPrompt}
                    onChange={e => setDefaultPrompt(e.target.value)}
                  />
                </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label>Instructions</Label>
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

                <ChatSettingsForm
                  chatSettings={localChatSettings}
                  onChangeChatSettings={setLocalChatSettings}
                />

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
        <div className="flex justify-end">
          <Button ref={buttonRef} onClick={handleSave}>
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

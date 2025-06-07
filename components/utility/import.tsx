import { MayuraContext } from "@/context/context"
import { createChats } from "@/db/chats"
import { Tables } from "@/supabase/types"
import { IconUpload, IconX } from "@tabler/icons-react"
import { FC, useContext, useRef, useState } from "react"
import { toast } from "sonner"
import { SIDEBAR_ICON_SIZE } from "../sidebar/sidebar-switcher"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from "../ui/dialog"
import { Input } from "../ui/input"

interface ImportProps {
  selectedWorkspace: Tables<"workspaces">
}

export const Import: FC<ImportProps> = ({ selectedWorkspace }) => {
  const { profile } = useContext(MayuraContext)

  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async () => {
    if (!file || !profile || !selectedWorkspace) return

    setIsLoading(true)

    const reader = new FileReader()

    reader.onload = async event => {
      try {
        const data = JSON.parse(event.target?.result as string)

        if (data.chats) {
          const chatsWithWorkspace = data.chats.map((chat: any) => ({
            ...chat,
            workspace_id: selectedWorkspace.id
          }))
          await createChats(chatsWithWorkspace)
        }

        toast.success("Import successful!")
      } catch (error) {
        toast.error("Error importing data.")
      }

      setIsLoading(false)
      setFile(null)
      setIsOpen(false)
    }

    reader.readAsText(file)
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="flex w-full justify-start gap-3"
      >
        <IconUpload size={SIDEBAR_ICON_SIZE} />
        Import
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>Import</DialogHeader>

          <DialogDescription>
            Import your data from a JSON file.
          </DialogDescription>

          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />

            {file && (
              <IconX
                className="cursor-pointer"
                size={20}
                onClick={() => setFile(null)}
              />
            )}
          </div>

          {file && <Badge variant="secondary">{file.name}</Badge>}

          <DialogFooter>
            <Button onClick={handleImport} disabled={!file || isLoading}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

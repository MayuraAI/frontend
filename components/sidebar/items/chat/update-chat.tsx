import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MayuraContext } from "@/context/context"
import { updateChat } from "@/db/chats"
import { Tables } from "@/supabase/types"
import { IconEdit, IconDeviceFloppy } from "@tabler/icons-react"
import { FC, useContext, useRef, useState } from "react"

interface UpdateChatProps {
  chat: Tables<"chats">
}

export const UpdateChat: FC<UpdateChatProps> = ({ chat }) => {
  const { setChats } = useContext(MayuraContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [showChatDialog, setShowChatDialog] = useState(false)
  const [name, setName] = useState(chat.name)

  const handleUpdateChat = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const updatedChat = await updateChat(chat.id, {
      name
    })
    setChats(prevState =>
      prevState.map(c => (c.id === chat.id ? updatedChat : c))
    )

    setShowChatDialog(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      buttonRef.current?.click()
    }
  }

  return (
    <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
      <DialogTrigger asChild>
        <button className="border-2 border-transparent p-1 transition-all duration-100 hover:border-slate-600">
          <IconEdit className="size-4 font-black" />
        </button>
      </DialogTrigger>

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          {/* <DialogTitle className="font-brutal text-foreground text-2xl font-black">
            Edit Chat Name
          </DialogTitle> */}
        </DialogHeader>

        <div className="neo-form-group">
          <Label className="text-foreground mb-3 block text-lg font-black">
            Edit Chat Name
          </Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            className="text-lg font-bold"
            placeholder="Enter chat name..."
          />
        </div>

        <DialogFooter className="gap-4">
          <Button
            variant="outline"
            onClick={() => setShowChatDialog(false)}
            className="font-black"
          >
            Cancel
          </Button>

          <Button
            ref={buttonRef}
            onClick={handleUpdateChat}
            variant="default"
            className="font-black"
            disabled={!name.trim()}
          >
            <IconDeviceFloppy className="mr-2 size-4" />
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

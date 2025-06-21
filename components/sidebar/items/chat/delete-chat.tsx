import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { MayuraContext } from "@/context/context"
import { deleteChat } from "@/db/chats"
import useHotkey from "@/lib/hooks/use-hotkey"
import { Tables } from "@/supabase/types"
import { IconTrash } from "@tabler/icons-react"
import { FC, useContext, useRef, useState } from "react"

interface DeleteChatProps {
  chat: Tables<"chats">
}

export const DeleteChat: FC<DeleteChatProps> = ({ chat }) => {
  useHotkey("Backspace", () => setShowChatDialog(true))

  const { setChats } = useContext(MayuraContext)
  const { handleNewChat } = useChatHandler()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [showChatDialog, setShowChatDialog] = useState(false)

  const handleDeleteChat = async () => {
    await deleteChat(chat.id)

    setChats(prevState => prevState.filter(c => c.id !== chat.id))

    setShowChatDialog(false)

    handleNewChat()
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
          <IconTrash className="size-4 font-black" />
        </button>
      </DialogTrigger>

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl font-black">
            Delete &quot;{chat.name}&quot;?
          </DialogTitle>

          <DialogDescription className="text-foreground text-lg">
            Are you sure you want to delete this chat? <br />
            This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

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
            variant="destructive"
            onClick={handleDeleteChat}
            className="font-black"
          >
            <IconTrash className="mr-2 size-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

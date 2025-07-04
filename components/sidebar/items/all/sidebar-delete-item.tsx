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
import { Tables } from "@/types/database"
import { FC, useContext, useState } from "react"

interface SidebarDeleteItemProps {
  contentType: "chats"
  item: Tables<"chats">
  children: React.ReactNode
}

export const SidebarDeleteItem: FC<SidebarDeleteItemProps> = ({
  contentType,
  item,
  children
}) => {
  const { setChats } = useContext(MayuraContext)

  const [isOpen, setIsOpen] = useState(false)

  const deleteFunctions = {
    chats: deleteChat
  }

  const stateUpdateFunctions = {
    chats: (prevItems: Tables<"chats">[]) =>
      prevItems.filter(prevItem => prevItem.id !== item.id)
  }

  const handleDelete = async () => {
    const deleteFunction = deleteFunctions[contentType]
    const updateFunction = stateUpdateFunctions[contentType]

    if (!deleteFunction || !updateFunction) return

    const success = await deleteFunction(item.id)

    if (success) {
      // setChats(prevItems => updateFunction(prevItems))
    }

    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {contentType.slice(0, -1)}</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this {contentType.slice(0, -1)}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant={"outline" as const}>
            Cancel
          </Button>

          <Button onClick={handleDelete} variant={"destructive" as const}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

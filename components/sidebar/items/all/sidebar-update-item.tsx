import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { MayuraContext } from "@/context/context"
import { updateChat } from "@/db/chats"
import { Chat } from "@/db/chats"
import { ContentType, DataItemType } from "@/types"
import { FC, useContext, useRef, useState } from "react"
import { toast } from "sonner"
import { SidebarDeleteItem } from "./sidebar-delete-item"

interface SidebarUpdateItemProps {
  isTyping: boolean
  item: DataItemType
  contentType: ContentType
  children: React.ReactNode
  renderInputs: (renderState: any) => JSX.Element
  updateState: any
}

export const SidebarUpdateItem: FC<SidebarUpdateItemProps> = ({
  item,
  contentType,
  children,
  renderInputs,
  updateState,
  isTyping
}) => {
  const { setChats } = useContext(MayuraContext)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const renderState = {
    chats: null
  }

  const updateFunctions = {
    chats: async (chatUpdate: { id: string; name?: string; sharing?: string }) => {
      if (!chatUpdate.id) return
      const { id, ...updateData } = chatUpdate
      const updatedChat = await updateChat(id, updateData)
      setChats(prevState =>
        prevState.map(prevChat =>
          prevChat.id === id ? { ...prevChat, ...updatedChat } : prevChat
        )
      )
    }
  }

  const handleUpdate = async () => {
    const updateFunction =
      updateFunctions[contentType as keyof typeof updateFunctions]
    if (!updateFunction) return

    try {
      await updateFunction(updateState)
      setIsOpen(false)
      toast.success("Updated successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Error updating item")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      buttonRef.current?.click()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="w-full">{children}</div>
      </SheetTrigger>

      <SheetContent className="flex flex-col space-y-4">
        <SheetHeader>
          <SheetTitle>Update {contentType.slice(0, -1)}</SheetTitle>
        </SheetHeader>

        {renderInputs(renderState)}

        <SheetFooter>
          <div className="flex w-full items-center justify-between">
            <SidebarDeleteItem item={item} contentType={contentType}>
              <Button variant="outline" size="sm">
                Delete
              </Button>
            </SidebarDeleteItem>

            <Button
              ref={buttonRef}
              className="w-20"
              disabled={isTyping}
              onClick={handleUpdate}
            >
              Update
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

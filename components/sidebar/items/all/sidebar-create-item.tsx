import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { ChatbotUIContext } from "@/context/context"
import { createChat } from "@/db/chats"
import { ContentType } from "@/types"
import { FC, useContext, useRef, useState } from "react"
import { toast } from "sonner"

interface SidebarCreateItemProps {
  isOpen: boolean
  isTyping: boolean
  onOpenChange: (isOpen: boolean) => void
  contentType: ContentType
  renderInputs: () => JSX.Element
  createState: any
}

export const SidebarCreateItem: FC<SidebarCreateItemProps> = ({
  isOpen,
  isTyping,
  onOpenChange,
  contentType,
  renderInputs,
  createState
}) => {
  const { profile, selectedWorkspace, setChats } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [loading, setLoading] = useState(false)

  if (!profile) return null
  if (!selectedWorkspace) return null

  const createFunctions = {
    chats: createChat
  }

  const setFunctions = {
    chats: setChats
  }

  const handleCreate = async () => {
    if (loading) return

    setLoading(true)

    try {
      const createFunction =
        createFunctions[contentType as keyof typeof createFunctions]
      const setFunction = setFunctions[contentType as keyof typeof setFunctions]

      if (!createFunction || !setFunction) {
        throw new Error("Invalid content type")
      }

      const createdItem = await createFunction(createState)

      setFunction((prevState: any) => [...prevState, createdItem])

      onOpenChange(false)
      toast.success("Created successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Error creating item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col space-y-4">
        <SheetHeader>
          <SheetTitle>Create {contentType.slice(0, -1)}</SheetTitle>
        </SheetHeader>

        {renderInputs()}

        <SheetFooter>
          <div className="flex w-full items-center space-x-2">
            <Button
              ref={buttonRef}
              className="w-32"
              disabled={isTyping}
              onClick={handleCreate}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

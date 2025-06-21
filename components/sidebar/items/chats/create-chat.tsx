import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { Plus } from "lucide-react"
import { FC } from "react"
import { Button } from "../../../ui/button"

export const CreateChat: FC = () => {
  const { handleNewChat } = useChatHandler()

  return (
    <div className="mb-4 w-full">
      <Button
        onClick={handleNewChat}
        className="h-auto w-full justify-start gap-3 bg-violet-600 p-4 text-white hover:bg-violet-700"
        aria-label="Start new chat"
      >
        <Plus size={20} />
        <span>New Chat</span>
      </Button>
    </div>
  )
}

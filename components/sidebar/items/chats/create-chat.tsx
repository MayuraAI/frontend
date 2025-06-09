import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { Plus } from "lucide-react"
import { FC } from "react"
import { Button } from "../../../ui/button"

export const CreateChat: FC = () => {
  const { handleNewChat } = useChatHandler()

  return (
    <div className="w-full">
      <Button 
        onClick={handleNewChat}
        className="w-full justify-start gap-2 font-medium"
        aria-label="Start new chat"
      >
        <Plus size={18} />
        <span>New Chat</span>
      </Button>
    </div>
  )
}

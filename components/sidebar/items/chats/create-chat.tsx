import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { IconPlus } from "@tabler/icons-react"
import { FC } from "react"
import { Button } from "../../../ui/button"

export const CreateChat: FC = () => {
  const { handleNewChat } = useChatHandler()

  return (
    <div className="w-full">
    <Button 
      onClick={handleNewChat}
      className="focus-ring bg-brand-primary hover:bg-brand-primary/90 transition-smooth shadow-mayura-sm flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white"
      aria-label="Start new chat"
    >
      <IconPlus size={20} />
      <span>New Chat</span>
    </Button>
  </div>
  )
}

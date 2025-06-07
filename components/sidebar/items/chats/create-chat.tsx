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
      className="focus-ring w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-smooth flex items-center justify-center gap-2 shadow-mayura-sm"
      aria-label="Start new chat"
    >
      <IconPlus size={20} />
      <span>New Chat</span>
    </Button>
  </div>
  )
}

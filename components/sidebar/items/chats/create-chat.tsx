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
        className="bg-neobrutalist-yellow border-3 hover:bg-neobrutalist-yellow focus:bg-neobrutalist-yellow h-auto w-full justify-start gap-3 
                   border-black p-4 
                   font-sans text-base 
                   font-bold 
                   uppercase 
                   tracking-wide text-black
                   shadow-[4px_4px_0px_0px_black] 
                   transition-all duration-150
                   hover:translate-x-[-2px] hover:translate-y-[-2px] 
                   hover:shadow-[6px_6px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px]
                   active:shadow-[2px_2px_0px_0px_black]"
        aria-label="Start new chat"
      >
        <Plus size={20} strokeWidth={3} />
        <span>New Chat</span>
      </Button>
    </div>
  )
}

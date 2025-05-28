import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { IconPlus } from "@tabler/icons-react"
import { FC } from "react"
import { Button } from "../../../ui/button"

export const CreateChat: FC = () => {
  const { handleNewChat } = useChatHandler()

  return (
    <Button
      variant="ghost"
      onClick={handleNewChat}
      className="flex w-full justify-start gap-3"
    >
      <IconPlus size={20} />
      Create
    </Button>
  )
}

import { MayuraContext } from "@/context/context"
import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { IconMessage } from "@tabler/icons-react"
import { useParams, useRouter } from "next/navigation"
import { FC, useContext, useRef } from "react"
import { DeleteChat } from "./delete-chat"
import { UpdateChat } from "./update-chat"

interface ChatItemProps {
  chat: Tables<"chats">
}

export const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const { selectedWorkspace, selectedChat } = useContext(MayuraContext)

  const router = useRouter()
  const params = useParams()
  const isActive = params.chatid === chat.id || selectedChat?.id === chat.id

  const itemRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (!selectedWorkspace) return
    return router.push(`/${selectedWorkspace.id}/chat/${chat.id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      itemRef.current?.click()
    }
  }

  return (
    <div
      ref={itemRef}
      className={cn(
        "focus-ring group flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left transition-all duration-200",
        isActive
          ? "bg-primary/10 border-primary/20 border font-medium shadow-sm"
          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
      )}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      role="button"
      aria-label={`Open chat: ${chat.name}`}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm">{chat.name}</div>
      </div>

      <div
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
        className={cn(
          "transition-smooth ml-2 flex items-center space-x-1",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <UpdateChat chat={chat} />
        <DeleteChat chat={chat} />
      </div>
    </div>
  )
}

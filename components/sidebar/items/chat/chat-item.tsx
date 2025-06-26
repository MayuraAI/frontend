import { MayuraContext } from "@/context/context"
import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { useParams, useRouter } from "next/navigation"
import { FC, useContext, useRef } from "react"
import { DeleteChat } from "./delete-chat"
import { UpdateChat } from "./update-chat"

interface ChatItemProps {
  chat: Tables<"chats">
}

export const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const { selectedChat } = useContext(MayuraContext)

  const router = useRouter()
  const params = useParams()
  const isActive = params.chatid === chat.id || selectedChat?.id === chat.id

  const itemRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    return router.push(`/chat/${chat.id}`)
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
        "group mb-0.5 flex w-full cursor-pointer items-center rounded-lg transition-all duration-200 sm:mb-1",
        isActive
          ? "bg-slate-800"
          : "hover:bg-slate-800/50"
        )}
        tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      role="button"
      aria-label={`Open chat: ${chat.name}`}
    >
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "truncate p-1.5 text-sm font-medium leading-relaxed sm:p-2 sm:text-base",
            isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
          )}
        >
          {chat.name}
        </div>
      </div>

      <div
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
        className={cn(
          "ml-1 flex items-center gap-0.5 pr-1 transition-all duration-200 sm:ml-2 sm:gap-1 sm:pr-2",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <UpdateChat chat={chat} />
        <DeleteChat chat={chat} />
      </div>
    </div>
  )
}

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
        "group mb-3 flex w-full cursor-pointer items-center rounded-lg border p-4 transition-all duration-200",
        isActive
          ? "border-violet-700 bg-violet-900/20 shadow-sm"
          : "border-slate-700 bg-black hover:bg-slate-900/50 hover:shadow-sm"
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
            "truncate text-sm font-medium leading-relaxed",
            isActive ? "text-violet-300" : "text-white"
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
          "ml-3 flex items-center space-x-2 transition-all duration-200",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <UpdateChat chat={chat} />
        <DeleteChat chat={chat} />
      </div>
    </div>
  )
}

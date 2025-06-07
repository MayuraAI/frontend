import { MayuraContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { cn } from "@/lib/utils"
import { ContentType, DataItemType, DataListType } from "@/types"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { ChatItem } from "./items/chat/chat-item"

interface SidebarDataListProps {
  contentType: ContentType
  data: DataListType
}

export const SidebarDataList: FC<SidebarDataListProps> = ({
  contentType,
  data
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const getDataListComponent = (
    contentType: ContentType,
    item: DataItemType
  ) => {
    switch (contentType) {
      case "chats":
        return <ChatItem key={item.id} chat={item as Tables<"chats">} />
      default:
        return null
    }
  }

  const getSortedData = (
    data: DataListType,
    dateCategory: "Today" | "Yesterday" | "Previous Week" | "Older"
  ) => {
    const now = new Date()
    const todayStart = new Date(now.setHours(0, 0, 0, 0))
    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(todayStart.getDate() - 1)
    const oneWeekAgoStart = new Date(todayStart)
    oneWeekAgoStart.setDate(todayStart.getDate() - 7)

    return data
      .filter(item => {
        const itemDate = new Date(item.updated_at || item.created_at)
        switch (dateCategory) {
          case "Today":
            return itemDate >= todayStart
          case "Yesterday":
            return itemDate >= yesterdayStart && itemDate < todayStart
          case "Previous Week":
            return itemDate >= oneWeekAgoStart && itemDate < yesterdayStart
          case "Older":
            return itemDate < oneWeekAgoStart
          default:
            return false
        }
      })
      .sort(
        (a, b) =>
          new Date(b.updated_at || b.created_at).getTime() -
          new Date(a.updated_at || a.created_at).getTime()
      )
  }

  useEffect(() => {
    if (divRef.current) {
      setIsOverflowing(
        divRef.current.scrollHeight > divRef.current.clientHeight
      )
    }
  }, [data])

  const todayData = getSortedData(data, "Today")
  const yesterdayData = getSortedData(data, "Yesterday")
  const previousWeekData = getSortedData(data, "Previous Week")
  const olderData = getSortedData(data, "Older")

  return (
    <div
      ref={divRef}
      className={cn("flex-1 overflow-auto space-y-1", isOverflowing && "pr-2")}
      role="list"
      aria-label="Chat history"
    >
      {todayData.length > 0 && (
        <div className="mb-4">
          <div className="px-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Today
          </div>
          <div className="space-y-1">
            {todayData.map(item => (
              <div key={item.id} role="listitem">
                {getDataListComponent(contentType, item)}
              </div>
            ))}
          </div>
        </div>
      )}

      {yesterdayData.length > 0 && (
        <div className="mb-4">
          <div className="px-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Yesterday
          </div>
          <div className="space-y-1">
            {yesterdayData.map(item => (
              <div key={item.id} role="listitem">
                {getDataListComponent(contentType, item)}
              </div>
            ))}
          </div>
        </div>
      )}

      {previousWeekData.length > 0 && (
        <div className="mb-4">
          <div className="px-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Previous Week
          </div>
          <div className="space-y-1">
            {previousWeekData.map(item => (
              <div key={item.id} role="listitem">
                {getDataListComponent(contentType, item)}
              </div>
            ))}
          </div>
        </div>
      )}

      {olderData.length > 0 && (
        <div className="mb-4">
          <div className="px-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Older
          </div>
          <div className="space-y-1">
            {olderData.map(item => (
              <div key={item.id} role="listitem">
                {getDataListComponent(contentType, item)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

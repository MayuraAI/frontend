import { ChatbotUIContext } from "@/context/context"
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
      className={cn("flex-1 overflow-auto", isOverflowing && "pr-2")}
    >
      {todayData.length > 0 && (
        <>
          <div className="mb-2 ml-3 text-xs font-bold">Today</div>
          {todayData.map(item => (
            <div key={item.id}>{getDataListComponent(contentType, item)}</div>
          ))}
        </>
      )}

      {yesterdayData.length > 0 && (
        <>
          <div className="mb-2 ml-3 text-xs font-bold">Yesterday</div>
          {yesterdayData.map(item => (
            <div key={item.id}>{getDataListComponent(contentType, item)}</div>
          ))}
        </>
      )}

      {previousWeekData.length > 0 && (
        <>
          <div className="mb-2 ml-3 text-xs font-bold">Previous Week</div>
          {previousWeekData.map(item => (
            <div key={item.id}>{getDataListComponent(contentType, item)}</div>
          ))}
        </>
      )}

      {olderData.length > 0 && (
        <>
          <div className="mb-2 ml-3 text-xs font-bold">Older</div>
          {olderData.map(item => (
            <div key={item.id}>{getDataListComponent(contentType, item)}</div>
          ))}
        </>
      )}
    </div>
  )
}

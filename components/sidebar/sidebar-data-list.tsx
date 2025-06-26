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
    return <ChatItem key={item.id} chat={item as Tables<"chats">} />
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

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="p-1 sm:p-2">
      <h3 className="font-sans text-sm font-bold tracking-wide text-slate-400 opacity-80 sm:text-base sm:tracking-widest md:text-lg">
        {title}
      </h3>
    </div>
  )

  return (
    <div
      ref={divRef}
      className={cn(
        "scrollbar-hide flex flex-1 flex-col gap-0.5 overflow-auto sm:gap-1 md:gap-1.5 lg:gap-2",
        isOverflowing && "pr-1 sm:pr-2"
      )}
      role="list"
      aria-label="Chat history"
    >
      {todayData.length > 0 && (
        <div className="mb-1 sm:mb-2">
          <SectionHeader title="TODAY" />
          <div className="flex flex-col">
            {todayData.map(item => (
              <div key={item.id} role="listitem" className="group">
                {getDataListComponent(contentType, item)}
              </div>
            ))}
          </div>
        </div>
      )}

      {yesterdayData.length > 0 && (
        <div className="mb-1 sm:mb-2">
          <SectionHeader title="YESTERDAY" />
          <div className="flex flex-col">
            {yesterdayData.map(item => (
              <div key={item.id} role="listitem" className="group">
                {getDataListComponent(contentType, item)}
              </div>
            ))}
          </div>
        </div>
      )}

      {previousWeekData.length > 0 && (
        <div className="mb-1 sm:mb-2">
          <SectionHeader title="PREVIOUS WEEK" />
          <div className="flex flex-col">
            {previousWeekData.map(item => (
              <div key={item.id} role="listitem" className="group">
                {getDataListComponent(contentType, item)}
              </div>
            ))}
          </div>
        </div>
      )}

      {olderData.length > 0 && (
        <div className="mb-1 sm:mb-2">
          <SectionHeader title="OLDER" />
          <div className="flex flex-col">
            {olderData.map(item => (
              <div key={item.id} role="listitem" className="group">
                {getDataListComponent(contentType, item)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

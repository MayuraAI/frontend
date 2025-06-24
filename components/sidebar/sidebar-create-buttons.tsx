import { MayuraContext } from "@/context/context"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { CreateChat } from "./items/chats/create-chat"

interface SidebarCreateButtonsProps {
  contentType: ContentType
  hasData: boolean
}

export const SidebarCreateButtons: FC<SidebarCreateButtonsProps> = ({
  contentType,
  hasData
}) => {
  const renderCreateButton = (contentType: ContentType) => {
    return <CreateChat />
  }

  return (
    <div className="flex w-full items-center justify-between">
      {renderCreateButton(contentType)}
    </div>
  )
}

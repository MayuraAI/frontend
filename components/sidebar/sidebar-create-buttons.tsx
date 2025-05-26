import { ChatbotUIContext } from "@/context/context"
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
  const { selectedWorkspace } = useContext(ChatbotUIContext)

  if (!selectedWorkspace) return null

  const renderCreateButton = (contentType: ContentType) => {
    switch (contentType) {
      case "chats":
        return <CreateChat />
      default:
        return null
    }
  }

  return (
    <div className="flex w-full items-center justify-between">
      {renderCreateButton(contentType)}
    </div>
  )
}

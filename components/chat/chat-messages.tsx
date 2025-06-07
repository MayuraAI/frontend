import { MayuraContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { useChatHandler } from "./chat-hooks/use-chat-handler"
import { Message } from "@/components/chat/message"
import { Tables } from "@/supabase/types"

interface ChatMessagesProps {}

export const ChatMessages: FC<ChatMessagesProps> = ({}) => {
  const { chatMessages } = useContext(MayuraContext)
  const { handleSendEdit } = useChatHandler()
  const [editingMessage, setEditingMessage] = useState<Tables<"messages">>()

  return chatMessages
    .sort((a, b) => a.sequence_number - b.sequence_number)
    .map((chatMessage, index, array) => {
      return (
        <Message
          key={chatMessage.id}
          message={chatMessage}
          isEditing={editingMessage?.id === chatMessage.id}
          isLast={index === array.length - 1}
          onStartEdit={setEditingMessage}
          onCancelEdit={() => setEditingMessage(undefined)}
          onSubmitEdit={handleSendEdit}
        />
      )
    })
}

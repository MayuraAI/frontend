import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { useChatHandler } from "./chat-hooks/use-chat-handler"
import { Message } from "@/components/chat/message"
import { Tables } from "@/supabase/types"

interface ChatMessagesProps {}

export const ChatMessages: FC<ChatMessagesProps> = ({}) => {
  const { chatMessages } = useContext(ChatbotUIContext)
  const { handleSendEdit } = useChatHandler()
  const [editingMessage, setEditingMessage] = useState<Tables<"messages">>()

  return chatMessages
    .sort((a, b) => a.message.sequence_number - b.message.sequence_number)
    .map((chatMessage, index, array) => {
      return (
        <Message
          key={chatMessage.message.sequence_number}
          message={chatMessage.message}
          isEditing={editingMessage?.id === chatMessage.message.id}
          isLast={index === array.length - 1}
          onStartEdit={setEditingMessage}
          onCancelEdit={() => setEditingMessage(undefined)}
          onSubmitEdit={handleSendEdit}
        />
      )
    })
}

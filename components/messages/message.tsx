import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { IconPencil } from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { MessageActions } from "./message-actions"
import { MessageMarkdown } from "./message-markdown"

interface MessageProps {
  message: Tables<"messages">
  isEditing: boolean
  isLast: boolean
  onStartEdit: (message: Tables<"messages">) => void
  onCancelEdit: () => void
  onSubmitEdit: (value: string, sequenceNumber: number) => void
}

export const Message: FC<MessageProps> = ({
  message,
  isEditing,
  isLast,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit
}) => {
  const { profile, isGenerating, setIsGenerating, chatMessages } =
    useContext(ChatbotUIContext)

  const { handleSendMessage } = useChatHandler()

  const editInputRef = useRef<HTMLTextAreaElement>(null)

  const [isHovering, setIsHovering] = useState(false)
  const [editedMessage, setEditedMessage] = useState(message.content)

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.content)
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = message.content
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
  }

  const handleSendEdit = () => {
    onSubmitEdit(editedMessage, message.sequence_number)
    onCancelEdit()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEditing && event.key === "Enter" && event.metaKey) {
      handleSendEdit()
    }
  }

  const handleRegenerate = async () => {
    setIsGenerating(true)
    await handleSendMessage(
      editedMessage || chatMessages[chatMessages.length - 2].message.content,
      chatMessages,
      true
    )
  }

  const handleStartEdit = () => {
    onStartEdit(message)
  }

  useEffect(() => {
    setEditedMessage(message.content)

    if (isEditing && editInputRef.current) {
      const input = editInputRef.current
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }, [isEditing])

  return (
    <div
      className={cn(
        "flex w-full justify-center",
        message.role === "user" ? "" : "bg-secondary"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={handleKeyDown}
    >
      <div className="relative flex w-full flex-col p-6 sm:w-[550px] sm:px-0 md:w-[650px] lg:w-[650px] xl:w-[700px]">
        <div className="absolute right-5 top-7 sm:right-0">
          <MessageActions
            onCopy={handleCopy}
            onEdit={handleStartEdit}
            isAssistant={message.role === "assistant"}
            isLast={isLast}
            isEditing={isEditing}
            isHovering={isHovering}
            onRegenerate={handleRegenerate}
          />
        </div>

        <div className="flex items-start space-x-4 sm:space-x-8">
          <div className="flex flex-col items-center">
            {message.role === "user" ? (
              <div className="bg-primary text-primary-foreground flex size-[32px] items-center justify-center rounded-full border">
                {profile?.display_name?.charAt(0).toUpperCase() ||
                  profile?.username?.charAt(0).toUpperCase() ||
                  "U"}
              </div>
            ) : (
              <div className="bg-primary text-primary-foreground flex size-[32px] items-center justify-center rounded-full border">
                A
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div className="font-semibold">
                {message.role === "user"
                  ? profile?.display_name || profile?.username || "User"
                  : "Assistant"}
              </div>
            </div>

            <div className="mt-1.5">
              {isEditing ? (
                <div className="flex flex-col space-y-3">
                  <TextareaAutosize
                    textareaRef={editInputRef}
                    value={editedMessage}
                    onValueChange={setEditedMessage}
                    maxRows={20}
                    className="bg-background w-full resize-none rounded-lg border px-3 py-2 focus:outline-none"
                  />

                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSendEdit}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Save & Submit
                    </Button>

                    <Button onClick={onCancelEdit} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <MessageMarkdown content={message.content} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

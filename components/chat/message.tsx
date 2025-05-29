import { Tables } from "@/supabase/types"
import { FC, useState } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { ChatbotUIContext } from "@/context/context"
import { useContext } from "react"
import { cn } from "@/lib/utils"
import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconTrash,
  IconX
} from "@tabler/icons-react"
import { toast } from "sonner"

interface MessageProps {
  message: Tables<"messages">
  isEditing: boolean
  isLast: boolean
  onStartEdit: (message: Tables<"messages">) => void
  onCancelEdit: () => void
  onSubmitEdit: (content: string, sequenceNumber: number) => void
}

export const Message: FC<MessageProps> = ({
  message,
  isEditing,
  isLast,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit
}) => {
  const { profile, isGenerating } = useContext(ChatbotUIContext)

  const [editedContent, setEditedContent] = useState(message.content)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    if (!message.content) return

    navigator.clipboard.writeText(message.content)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const handleStartEdit = () => {
    onStartEdit(message)
    setEditedContent(message.content)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!editedContent || editedContent === message.content) {
      onCancelEdit()
      return
    }

    onSubmitEdit(editedContent, message.sequence_number)
    onCancelEdit()
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 px-4 py-8",
        message.role === "assistant" ? "bg-secondary/30" : ""
      )}
    >
      <div className="flex items-center gap-2">
        <div className="font-semibold">
          {message.role === "assistant"
            ? "Assistant"
            : profile?.display_name || "User"}
        </div>

        {message.role === "assistant" && message.model_name && (
          <div className="text-muted-foreground text-xs">
            {message.model_name}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          <Textarea
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-40"
          />

          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit}>Save</Button>

            <Button variant="ghost" onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
            {message.content}
          </div>

          {!isGenerating && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="size-8"
              >
                {isCopied ? <IconCheck size={18} /> : <IconCopy size={18} />}
              </Button>

              {message.role === "user" && isLast && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleStartEdit}
                    className="size-8"
                  >
                    <IconEdit size={18} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSubmitEdit("", message.sequence_number)}
                    className="size-8"
                  >
                    <IconTrash size={18} />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

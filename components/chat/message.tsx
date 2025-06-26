import { Tables } from "@/supabase/types"
import { FC, useState, useContext, useRef, useEffect } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { MayuraContext } from "@/context/context"
import {
  IconCheck,
  IconCopy,
  IconX,
  IconChevronDown,
  IconChevronUp
} from "@tabler/icons-react"
import { toast } from "sonner"
import MarkdownContent from "../ui/markdown-content"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"

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
  const { profile, isGenerating } = useContext(MayuraContext)

  const [editedContent, setEditedContent] = useState(message.content)
  const [isCopied, setIsCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const userTextareaRef = useRef<HTMLTextAreaElement>(null)
  const { copyToClipboard } = useCopyToClipboard({ timeout: 2000, setIsCopied })

  // Define threshold for collapsing user messages (in characters)
  const COLLAPSE_THRESHOLD = 200

  useEffect(() => {
    if (isEditing && message.role === "user" && userTextareaRef.current) {
      userTextareaRef.current.focus()
      userTextareaRef.current.setSelectionRange(
        userTextareaRef.current.value.length,
        userTextareaRef.current.value.length
      )
    }
  }, [isEditing, message.role])

  const handleCopy = () => {
    if (!message.content) return

    copyToClipboard(message.content)
  }

  const handleStartEdit = () => {
    onStartEdit(message)
    setEditedContent(message.content)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const isUser = message.role === "user"
  const shouldCollapse = isUser && message.content.length > COLLAPSE_THRESHOLD
  const displayContent =
    shouldCollapse && !isExpanded
      ? message.content.substring(0, COLLAPSE_THRESHOLD) + "..."
      : message.content

  const getModelName = () => {
    return message.model_name || "mayura"
  }

  return (
    <div className="group mb-6 sm:mb-8">
      {isUser ? (
        // User Message Block
        <div className="flex justify-end">
          <div className="w-full max-w-xl sm:max-w-2xl">
            {isEditing ? (
              <div className="modern-container w-full p-4 sm:p-6">
                <Textarea
                  ref={userTextareaRef}
                  value={editedContent}
                  onChange={e => setEditedContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[100px] sm:min-h-[120px] w-full resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                  placeholder="Edit your message..."
                />
                <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <Button
                    onClick={handleSubmit}
                    size="sm"
                    className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <IconCheck size={14} className="sm:size-4" />
                    <span className="text-xs sm:text-sm">Save</span>
                  </Button>
                  <Button
                    onClick={onCancelEdit}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <IconX size={14} className="sm:size-4" />
                    <span className="text-xs sm:text-sm">Cancel</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="message-block message-block--user relative">
                <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                  {displayContent}
                </p>
                {shouldCollapse && (
                  <div className="mt-2 sm:mt-3 flex justify-end gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                    >
                      {isCopied ? (
                        <IconCheck size={12} className="sm:size-3.5" />
                      ) : (
                        <IconCopy size={12} className="sm:size-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleExpanded}
                      className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                    >
                      {isExpanded ? (
                        <>
                          <IconChevronUp size={12} className="mr-1 sm:size-3.5" />
                          <span className="hidden sm:inline">Collapse</span>
                        </>
                      ) : (
                        <>
                          <IconChevronDown size={12} className="mr-1 sm:size-3.5" />
                          <span className="hidden sm:inline">Expand</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
                {/* Add copy button for short messages that don't collapse */}
                {!shouldCollapse && (
                  <div className="absolute right-1 sm:right-2 top-1 sm:top-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-6 sm:h-8 px-2 sm:px-3 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      {isCopied ? (
                        <IconCheck size={12} className="sm:size-3.5" />
                      ) : (
                        <IconCopy size={12} className="sm:size-3.5" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // AI Message Block
        <div className="mx-auto w-full max-w-4xl py-1 sm:py-2">
          <div className="space-y-3 sm:space-y-4">
            <div className="message-block message-block--ai relative w-full pt-5 sm:pt-6">
              <div className="bg-muted text-muted-foreground absolute left-2 sm:left-3 top-0 z-10 w-fit -translate-y-1/2 rounded-full px-2 sm:px-3 py-1 text-xs font-medium cursor-default">
                {getModelName()}
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm sm:text-base">
                <MarkdownContent aiResponse={message.content} />
              </div>
            </div>

            {/* Message Actions */}
            {!isGenerating && (
              <div className="ml-1 sm:ml-2 flex items-center gap-1 sm:gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 sm:h-10 px-2 sm:px-3"
                >
                  {isCopied ? (
                    <IconCheck size={14} className="sm:size-4" />
                  ) : (
                    <IconCopy size={14} className="sm:size-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

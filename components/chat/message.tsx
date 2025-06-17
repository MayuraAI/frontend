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

    navigator.clipboard.writeText(message.content)
    setIsCopied(true)
    toast.success("Copied to clipboard")

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
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
  const displayContent = shouldCollapse && !isExpanded 
    ? message.content.substring(0, COLLAPSE_THRESHOLD) + "..."
    : message.content

  const getModelName = () => {
    return message.model_name || "mayura"
  }

  return (
    <div className="group mb-8">
      {isUser ? (
        // User Message Block
        <div className="flex justify-end">
          <div className="w-full max-w-2xl">
            {isEditing ? (
              <div className="container-neobrutalist w-full p-6">
                <Textarea
                  ref={userTextareaRef}
                  value={editedContent}
                  onChange={e => setEditedContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[120px] w-full resize-none border-0 bg-transparent p-0 font-mono focus-visible:ring-0"
                  placeholder="Edit your message..."
                />
                <div className="mt-6 flex items-center gap-3 border-t-2 border-black pt-4">
                  <Button 
                    onClick={handleSubmit} 
                    size="sm"
                    className="btn-neobrutalist bg-neobrutalist-green px-4 py-2 text-black"
                  >
                    <IconCheck size={16} className="mr-2" strokeWidth={3} />
                    SAVE
                  </Button>
                  <Button
                    onClick={onCancelEdit}
                    size="sm"
                    className="btn-neobrutalist bg-white px-4 py-2 text-black"
                  >
                    <IconX size={16} className="mr-2" strokeWidth={3} />
                    CANCEL
                  </Button>
                </div>
              </div>
            ) : (
              <div className="message-block message-block--user relative">
                <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{displayContent}</p>
                {shouldCollapse && (
                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="btn-neobrutalist hover:bg-neobrutalist-blue h-8 bg-white px-3 text-xs text-black hover:text-white"
                    >
                      {isCopied ? (
                        <IconCheck size={14} strokeWidth={3} />
                      ) : (
                        <IconCopy size={14} strokeWidth={3} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleExpanded}
                      className="btn-neobrutalist hover:bg-neobrutalist-blue h-8 bg-white px-3 text-xs text-black hover:text-white"
                    >
                      {isExpanded ? (
                        <>
                          <IconChevronUp size={14} strokeWidth={3} className="mr-1" />
                          COLLAPSE
                        </>
                      ) : (
                        <>
                          <IconChevronDown size={14} strokeWidth={3} className="mr-1" />
                          EXPAND
                        </>
                      )}
                    </Button>
                  </div>
                )}
                {/* Add copy button for short messages that don't collapse */}
                {!shouldCollapse && (
                  <div className="absolute right-2 top-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="btn-neobrutalist hover:bg-neobrutalist-blue h-8 bg-white px-3 text-xs text-black hover:text-white"
                    >
                      {isCopied ? (
                        <IconCheck size={14} strokeWidth={3} />
                      ) : (
                        <IconCopy size={14} strokeWidth={3} />
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
        <div className="w-full max-w-[80%]">
          <div className="space-y-4">
            <div className="message-block message-block--ai relative w-full pt-6">
              <div className="absolute right-4 top-0 z-10 w-fit -translate-y-1/2 border border-black bg-[#E9ECEF] px-2 py-1 font-mono text-xs font-bold tracking-wide text-black">
                {getModelName()}
              </div>
              
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <MarkdownContent aiResponse={message.content} />
              </div>
            </div>

            {/* Message Actions */}
            {!isGenerating && (
              <div className="ml-2 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="btn-neobrutalist hover:bg-neobrutalist-blue h-10 bg-white px-3 text-black hover:text-white"
                >
                  {isCopied ? (
                    <IconCheck size={16} strokeWidth={3} />
                  ) : (
                    <IconCopy size={16} strokeWidth={3} />
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
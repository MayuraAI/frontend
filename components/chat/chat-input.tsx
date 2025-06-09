import {
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"
import { MayuraContext } from "@/context/context"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { IconPlayerStop, IconSend } from "@tabler/icons-react"
import { useChatHandler } from "./chat-hooks/use-chat-handler"
import { cn } from "@/lib/utils"

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = () => {
  const { chatMessages, isGenerating, selectedWorkspace } =
    useContext(MayuraContext)
  const { handleSendMessage, handleStopMessage } = useChatHandler()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  // Auto-resize textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto" // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Set to scroll height
    }
  }, [inputValue])

  // Focus textarea on component mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback(() => {
    const content = inputValue.trim()
    if (!selectedWorkspace || !content || isGenerating) return

    setInputValue("")
    handleSendMessage(content, chatMessages, false)
    // Imperatively adjust height after sending to reset to single line if content is gone
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    textareaRef.current?.focus()
  }, [
    selectedWorkspace,
    inputValue,
    isGenerating,
    handleSendMessage,
    chatMessages,
  ])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault() // Prevent newline
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      handleSubmit()
    },
    [handleSubmit]
  )

  const hasContent = inputValue.trim().length > 0

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn(
        "relative flex items-end gap-3 rounded-2xl border border-border bg-background px-3 py-1 shadow-sm transition-all duration-200", // Adjusted padding and shadow
        isFocused
          ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
          : "hover:shadow-md"
      )}
    >
      <Textarea
        id="chat-input"
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Ask Mayura anything..."
        className={cn(
          "flex-1 resize-none overflow-y-auto border-none bg-transparent text-sm leading-relaxed outline-none", // Added overflow-y-auto, removed px-0 py-[10px] as it's handled by form padding
          "placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0",
          "min-h-[24px] max-h-32" // Set minimum and maximum height for scroll
        )}
        rows={1} // Start with 1 row, let JS handle expansion
        maxLength={4000}
        disabled={isGenerating}
      />

      {/* Send / Stop Button */}
      <div className="flex items-center justify-center">
        {isGenerating ? (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-md" // Adjusted size for better visual
            onClick={handleStopMessage}
            aria-label="Stop generating"
          >
            <IconPlayerStop size={18} /> {/* Slightly larger icon */}
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            className={cn(
              "h-9 w-9 shrink-0 rounded-md transition-all duration-150", // Adjusted size and shrink-0
              hasContent
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-60" // Added opacity for disabled
            )}
            disabled={!hasContent || isGenerating}
            aria-label="Send message"
          >
            <IconSend size={18} /> {/* Slightly larger icon */}
          </Button>
        )}
      </div>
    </form>
  )
}
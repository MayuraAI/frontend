import { FC, useContext, useEffect, useRef, useState, useCallback } from "react"
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
    chatMessages
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
        "border-3 relative flex items-end gap-4 border-black bg-white px-6 py-4 shadow-[4px_4px_0px_0px_black] transition-all duration-200",
        isFocused
          ? "translate-x-[-2px] translate-y-[-2px] shadow-[6px_6px_0px_0px_black]"
          : "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black]"
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
        placeholder="ASK MAYURA ANYTHING..."
        className={cn(
          "flex-1 resize-none overflow-y-auto border-none bg-transparent font-mono text-base leading-relaxed outline-none",
          "placeholder:text-muted-foreground placeholder:font-bold focus-visible:ring-0 focus-visible:ring-offset-0",
          "max-h-32 min-h-[32px]" // Set minimum and maximum height for scroll
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
            className="btn-neobrutalist bg-destructive text-destructive-foreground hover:bg-destructive size-12 shrink-0"
            onClick={handleStopMessage}
            aria-label="Stop generating"
          >
            <IconPlayerStop size={20} strokeWidth={3} />
          </Button>
        ) : (
          <Button
            type="submit"
            className={cn(
              "btn-neobrutalist size-12 shrink-0 transition-all duration-150",
              hasContent
                ? "bg-neobrutalist-blue hover:bg-neobrutalist-blue text-white"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
            )}
            disabled={!hasContent || isGenerating}
            aria-label="Send message"
          >
            <IconSend size={20} strokeWidth={3} />
          </Button>
        )}
      </div>
    </form>
  )
}

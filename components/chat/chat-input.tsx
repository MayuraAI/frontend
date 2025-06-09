import { FC, useContext, useEffect, useRef, useState, useCallback } from "react"
import { MayuraContext } from "@/context/context"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { IconPlayerStop, IconSend } from "@tabler/icons-react"
import { useChatHandler } from "./chat-hooks/use-chat-handler"
import { cn } from "@/lib/utils"

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = () => {
  const { chatMessages, isGenerating, selectedWorkspace } = useContext(MayuraContext)
  const { handleSendMessage, handleStopMessage } = useChatHandler()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`
    }
  }, [inputValue])

  // Focus the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!selectedWorkspace || !inputValue.trim() || isGenerating) return

    const content = inputValue.trim()
    setInputValue("")
    handleSendMessage(content, chatMessages, false)
    
    // Refocus the textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [selectedWorkspace, inputValue, isGenerating, handleSendMessage, chatMessages])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const handleFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit()
  }, [handleSubmit])

  const hasContent = inputValue.trim().length > 0

  return (
    <form
      ref={formRef}
      onSubmit={handleFormSubmit}
      className={cn(
        "bg-bg-secondary relative flex items-center rounded-xl border transition-all",
        isFocused ? "border-brand-primary" : "border-border-primary"
      )}
    >
      <label htmlFor="chat-input" className="sr-only">
        Type your message
      </label>

      <Textarea
        id="chat-input"
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Ask Mayura anything..."
        className="text-text-primary placeholder:text-text-muted max-h-32 min-h-[2.75rem] flex-1 resize-none border-none bg-transparent pr-10 outline-none focus-visible:ring-0"
        rows={1}
        disabled={isGenerating}
        maxLength={4000} // Add reasonable character limit
      />

      {/* Send / Stop Button */}
      <div className="absolute bottom-[9px] right-3">
        {isGenerating ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="bg-destructive hover:bg-destructive/90 size-8 rounded-lg text-white"
            onClick={handleStopMessage}
            aria-label="Stop generating"
          >
            <IconPlayerStop size={16} />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            className={cn(
              "bg-brand-primary hover:bg-brand-primary/90 size-8 rounded-lg text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            )}
            disabled={!hasContent || isGenerating}
            aria-label="Send message"
          >
            <IconSend size={16} />
          </Button>
        )}
      </div>
    </form>
  )
}

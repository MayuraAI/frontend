import { FC, useContext, useEffect, useRef, useState } from "react"
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
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`
    }
  }, [inputValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = () => {
    if (!selectedWorkspace || !inputValue.trim() || isGenerating) return

    const content = inputValue.trim()
    setInputValue("")
    handleSendMessage(content, chatMessages, false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const hasContent = inputValue.trim().length > 0

  return (
    <form
  onSubmit={(e) => {
    e.preventDefault()
    handleSubmit()
  }}
  className={cn(
    "relative flex items-center rounded-xl border bg-bg-secondary transition-all",
    // isFocused ? "border-brand-primary" : "border-border-primary",
    // "focus-within:border-brand-primary px-3 py-2"
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
    className="text-text-primary placeholder:text-text-muted flex-1 resize-none border-brand-primary bg-transparent pr-10 outline-none max-h-32 min-h-[2.75rem]"
    rows={1}
    disabled={isGenerating}
  />

  {/* Send / Stop Button */}
  <div className="absolute right-3 bottom-[9px]">
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
          "bg-brand-primary hover:bg-brand-primary/90 size-8 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
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

import { MayuraContext } from "@/context/context"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { IconPlayerStop, IconSend } from "@tabler/icons-react"
import { useChatHandler } from "./chat-hooks/use-chat-handler"
import { cn } from "@/lib/utils"

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = ({}) => {
  const { chatMessages, isGenerating, selectedWorkspace } =
    useContext(MayuraContext)

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = () => {
    if (!selectedWorkspace) return
    if (!inputValue.trim()) return
    if (isGenerating) return

    const content = inputValue.trim()
    setInputValue("")

    handleSendMessage(content, chatMessages, false)
  }

  const hasContent = inputValue.trim().length > 0

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className={cn(
        "relative flex items-end bg-bg-secondary rounded-xl border transition-smooth",
        isFocused ? "border-brand-primary" : "border-border-color",
        "focus-within:border-brand-primary"
      )}
    >
      <label htmlFor="chat-input" className="sr-only">Type your message</label>
      <Textarea
        id="chat-input"
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Ask Mayura anything..."
        className="flex-1 py-3 pl-4 pr-12 bg-transparent resize-none border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-text-primary placeholder-text-muted min-h-[2.75rem] max-h-32"
        rows={1}
        disabled={isGenerating}
        aria-describedby="send-button"
      />
      
      <div className="absolute right-2 bottom-2">
        {isGenerating ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="focus-ring size-8 bg-destructive hover:bg-destructive/90 text-white rounded-lg"
            onClick={handleStopMessage}
            aria-label="Stop generating"
          >
            <IconPlayerStop size={16} />
          </Button>
        ) : (
          <Button
            type="submit"
            className={cn(
              "send-button focus-ring size-8 bg-brand-primary rounded-lg hover:bg-brand-primary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed",
              hasContent ? "visible" : ""
            )}
            disabled={!hasContent || isGenerating}
            aria-label="Send message"
          >
            <IconSend size={16} className="text-white" />
          </Button>
        )}
      </div>

      {/* Typing Indicator (when AI is generating) */}
      {isGenerating && (
        <div className="absolute -top-12 left-4 flex items-center gap-2 bg-bg-tertiary px-3 py-2 rounded-lg shadow-mayura-sm border border-border-color">
          <span className="text-sm font-medium text-text-muted">Mayura is thinking</span>
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      )}
    </form>
  )
}

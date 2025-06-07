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
        "bg-bg-secondary transition-smooth relative flex items-end rounded-xl border",
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
        className="text-text-primary placeholder:text-text-muted max-h-32 min-h-[2.75rem] flex-1 resize-none border-none bg-transparent py-3 pl-4 pr-12 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        rows={1}
        disabled={isGenerating}
        aria-describedby="send-button"
      />
      
      <div className="absolute bottom-2 right-2">
        {isGenerating ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="focus-ring bg-destructive hover:bg-destructive/90 size-8 rounded-lg text-white"
            onClick={handleStopMessage}
            aria-label="Stop generating"
          >
            <IconPlayerStop size={16} />
          </Button>
        ) : (
          <Button
            type="submit"
            className={cn(
              "send-button focus-ring bg-brand-primary hover:bg-brand-primary/90 transition-smooth size-8 rounded-lg disabled:cursor-not-allowed disabled:opacity-50",
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
        <div className="bg-bg-tertiary shadow-mayura-sm border-border-color absolute -top-12 left-4 flex items-center gap-2 rounded-lg border px-3 py-2">
          <span className="text-text-muted text-sm font-medium">Mayura is thinking</span>
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

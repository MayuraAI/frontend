import { FC, useContext, useEffect, useRef, useState, useCallback } from "react"
import { MayuraContext } from "@/context/context"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { IconPlayerStop, IconSend } from "@tabler/icons-react"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { cn } from "@/lib/utils"
import { Send, Square } from "lucide-react"

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = () => {
  const { chatMessages, isGenerating, profile } = useContext(MayuraContext)
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
    if (!profile || !content || isGenerating) return

    setInputValue("")
    handleSendMessage(content, chatMessages, false)
    // Imperatively adjust height after sending to reset to single line if content is gone
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    textareaRef.current?.focus()
  }, [profile, inputValue, isGenerating, handleSendMessage, chatMessages])

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
  const canSend = hasContent && !isGenerating && profile

  return (
    <div>
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleFormSubmit} className="relative">
          <div
            className={cn(
              "flex items-start rounded-lg border border-slate-600 bg-black transition-all duration-200",
              isFocused && "border-violet-500"
            )}
          >
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                isGenerating ? "AI is thinking..." : "Type your message here..."
              }
              disabled={isGenerating}
              className="w-full resize-none p-6 text-base leading-relaxed text-white"
              rows={1}
              style={{
                maxHeight: "200px",
                overflowY:
                  inputValue.split("\n").length > 6 ? "scroll" : "hidden"
              }}
            />

            <div className="flex shrink-0 items-start px-2 py-4">
              {isGenerating ? (
                <Button
                  type="button"
                  onClick={handleStopMessage}
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Square size={16} />
                  <span className="py-4 font-bold">Stop</span>
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!canSend}
                  size="sm"
                  className="flex items-center gap-3 bg-violet-600 text-white hover:bg-violet-700"
                >
                  <Send size={16} />
                  <span className="py-4 font-bold">Send</span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

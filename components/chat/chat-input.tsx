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
  const { chatMessages, isGenerating, profile } =
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
    if (!profile || !content || isGenerating) return

    setInputValue("")
    handleSendMessage(content, chatMessages, false)
    // Imperatively adjust height after sending to reset to single line if content is gone
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    textareaRef.current?.focus()
  }, [
    profile,
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
  const canSend = hasContent && !isGenerating && profile

  return (
    <div>
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleFormSubmit} className="relative">
          <div
            className={cn(
              "border-3 flex min-h-[60px] items-start border-black bg-white shadow-[4px_4px_0px_0px_black] transition-all duration-200",
              isFocused && "shadow-[6px_6px_0px_0px_black]"
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
                isGenerating
                  ? "AI is thinking..."
                  : "TYPE YOUR MESSAGE HERE..."
              }
              disabled={isGenerating}
              className="w-full resize-none border-0 bg-transparent p-4 font-mono text-base font-bold leading-relaxed text-black placeholder-gray-500 focus:outline-none"
              rows={1}
              style={{
                maxHeight: "200px",
                overflowY: inputValue.split("\n").length > 6 ? "scroll" : "hidden"
              }}
            />

            <div className="flex shrink-0 items-start p-4">
              {isGenerating ? (
                <button
                  type="button"
                  onClick={handleStopMessage}
                  className="btn-neobrutalist flex items-center gap-2 bg-red-400 px-4 py-2 text-black transition-all duration-150 hover:bg-red-500"
                  aria-label="Stop generation"
                >
                  <Square size={16} strokeWidth={3} />
                  <span className="font-sans font-bold">STOP</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canSend}
                  className={cn(
                    "btn-neobrutalist flex items-center gap-2 px-4 py-2 font-sans font-bold text-black transition-all duration-150",
                    canSend
                      ? "bg-neobrutalist-green hover:bg-green-400"
                      : "cursor-not-allowed bg-gray-300 text-gray-500"
                  )}
                  aria-label="Send message"
                >
                  <Send size={16} strokeWidth={3} />
                  <span>SEND</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

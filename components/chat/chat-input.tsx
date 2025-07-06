import { FC, useContext, useEffect, useRef, useState, useCallback } from "react"
import { MayuraContext } from "@/context/context"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { IconPlayerStop, IconSend } from "@tabler/icons-react"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { cn } from "@/lib/utils"
import { Send, Square } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { isAnonymousUser } from "@/lib/firebase/auth"
import { SignupPromptModal } from "@/components/ui/signup-prompt-modal"

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = () => {
  const { chatMessages, isGenerating, profile } = useContext(MayuraContext)
  const { handleSendMessage, handleStopMessage, showSignupPrompt, setShowSignupPrompt } = useChatHandler()
  const { user } = useAuth()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [hasProcessedHeroPrompt, setHasProcessedHeroPrompt] = useState(false)

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

  // Check for hero prompt from localStorage and auto-submit it
  useEffect(() => {
    const canSendMessage = user && (isAnonymousUser() || profile)
    
    if (canSendMessage && !hasProcessedHeroPrompt && !isGenerating && chatMessages.length === 0) {
      const heroPrompt = localStorage.getItem('heroPrompt')
      if (heroPrompt) {
        // Clear the hero prompt from localStorage
        localStorage.removeItem('heroPrompt')
        setHasProcessedHeroPrompt(true)
        
        // Set the input value and submit the message
        setInputValue(heroPrompt)
        
        // Submit the message after a small delay to ensure state is updated
        setTimeout(() => {
          handleSendMessage(heroPrompt, chatMessages, false)
          setInputValue("")
        }, 100)
      } else {
        setHasProcessedHeroPrompt(true)
      }
    }
  }, [user, profile, hasProcessedHeroPrompt, isGenerating, chatMessages, handleSendMessage])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback(() => {
    const content = inputValue.trim()
    // Allow sending if user is anonymous OR has a profile
    const canSendMessage = user && (isAnonymousUser() || profile)
    if (!canSendMessage || !content || isGenerating) return

    setInputValue("")
    handleSendMessage(content, chatMessages, false)
    // Imperatively adjust height after sending to reset to single line if content is gone
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    textareaRef.current?.focus()
  }, [user, profile, inputValue, isGenerating, handleSendMessage, chatMessages])

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

  const canSendMessage = user && (isAnonymousUser() || profile)
  const isDisabled = !canSendMessage || !inputValue.trim() || isGenerating

  return (
    <>
      <form onSubmit={handleFormSubmit} className="w-full">
        <div className="group relative">
          {/* Gradient Border Effect */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 opacity-30 blur transition duration-300 group-hover:opacity-50"></div>
          
          {/* Input Container */}
          <div className="relative rounded-2xl border border-slate-600/50 bg-slate-900/80 shadow-xl backdrop-blur-sm">
            <Textarea
              ref={textareaRef}
              placeholder={
                !user
                  ? "Please sign in to start chatting..."
                  : !canSendMessage
                  ? "Please complete your profile setup..."
                  : "Type your message here..."
              }
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={!canSendMessage}
              className={cn(
                "max-h-[200px] min-h-[60px] resize-none rounded-2xl border-0 bg-transparent px-6 py-5 pr-20 text-base leading-relaxed text-white placeholder:text-slate-400 focus:ring-0 sm:px-8 sm:py-6 sm:pr-24 sm:text-lg",
                "focus-visible:outline-none focus-visible:ring-0",
                !canSendMessage && "cursor-not-allowed opacity-50"
              )}
              rows={1}
            />

            <div className="absolute bottom-3 right-3 flex items-center gap-2 sm:bottom-4 sm:right-4">
              {isGenerating ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleStopMessage}
                  className="size-12 rounded-xl bg-red-500 p-0 text-white hover:bg-red-600"
                  title="Stop generating"
                >
                  <Square className="size-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  disabled={isDisabled}
                  className={cn(
                    "size-12 rounded-xl p-0 transition-all duration-200",
                    isDisabled
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 hover:scale-105"
                  )}
                  title="Send message"
                >
                  <Send className="size-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Helper text for anonymous users */}
        {user && isAnonymousUser() && (
          <div className="mt-2 text-center text-xs text-slate-400">
            You&apos;re using Mayura anonymously. Sign up to save your chat history and get more requests!
          </div>
        )}
      </form>

      {/* Signup Prompt Modal */}
      <SignupPromptModal
        isOpen={showSignupPrompt}
        onClose={() => setShowSignupPrompt(false)}
      />
    </>
  )
}

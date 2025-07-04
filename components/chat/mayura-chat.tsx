"use client"

import Loading from "@/app/loading"
import { MayuraContext } from "@/context/context"
import { getChatById } from "@/db/chats"
import { getMessagesByChatId } from "@/db/messages"
import { useParams } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { useScroll } from "./chat-hooks/use-scroll"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { Button } from "../ui/button"
import { ChevronDown, Sparkles, Zap } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { isAnonymousUser } from "@/lib/firebase/auth"
import { AnonymousBanner } from "./anonymous-banner"

interface MayuraChatProps {}

export const MayuraChat: FC<MayuraChatProps> = ({}) => {
  const { setSelectedChat, chatMessages, setChatMessages, isGenerating, profile, rateLimitStatus } =
    useContext(MayuraContext)
  const { user } = useAuth()

  const params = useParams()
  const { scrollToBottom, messagesStartRef, messagesEndRef, isUserScrolledUp, shouldAutoScroll } = useScroll()
  const [loading, setLoading] = useState(false)
  const [isReady, setIsReady] = useState(true)

  useEffect(() => {
    if (params.chatid) {
      const fetchMessages = async () => {
        setLoading(true)
        try {
          const dbMessages = await getMessagesByChatId(params.chatid as string)
          // Ensure messages is always an array, even if backend returns null
          const safeMessages = Array.isArray(dbMessages) ? dbMessages : []
          setChatMessages(safeMessages)
          setLoading(false)
          setIsReady(true)
        } catch (error) {
          console.error("Error fetching messages:", error)
          // Set empty array on error to prevent null reference issues
          setChatMessages([])
          setLoading(false)
          setIsReady(true)
        }
      }

      const fetchChat = async () => {
        try {
          const chat = await getChatById(params.chatid as string)
          if (chat) {
            setSelectedChat(chat)
          }
        } catch (error) {
          console.error("Error fetching chat:", error)
        }
      }

      fetchChat()
      fetchMessages()
    }
  }, [params.chatid, setChatMessages, setSelectedChat])

  // Auto-scroll to bottom when messages are first loaded
  useEffect(() => {
    if (chatMessages && chatMessages.length > 0 && isReady && !loading) {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isReady, chatMessages.length > 0, scrollToBottom, loading])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="relative flex h-full flex-col bg-background">
      {/* Chat Messages Area */}
      {/* Anonymous User Banner - Absolute positioned within messages container */}
      {user && isAnonymousUser() && rateLimitStatus && (
        <div className="absolute top-4 left-0 right-0 z-50 max-w-4xl mx-auto">
          <div className="shadow-lg">
            <AnonymousBanner
              requestsRemaining={rateLimitStatus.requests_remaining}
              totalRequests={rateLimitStatus.daily_limit}
            />
          </div>
        </div>
      )}
      <section
        className="flex-1 overflow-y-auto bg-background px-3 pb-4 sm:px-4 md:px-6 md:pt-6 md:pb-6"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {/* Add top spacing for mobile header on mobile only */}
        <div className="h-16 md:hidden" />
        
        <div className="mx-auto max-w-4xl space-y-4 relative">

          <div ref={messagesStartRef} 
          style={{ 
          paddingTop: user && isAnonymousUser() 
            ? "calc(1rem + env(safe-area-inset-top) + 5rem)" // Add space for anonymous banner
            : "calc(1rem + env(safe-area-inset-top))"
          }}
          />
          <ChatMessages />
          <div ref={messagesEndRef} />

          {/* Responsive Welcome Message for New Chats */}
          {(!chatMessages || chatMessages.length === 0) && !isGenerating && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-4 text-center sm:min-h-[500px]">
              {/* Welcome Header */}
              <div className="flex flex-col items-center justify-center">
                <div className="max-w-2xl">
                  <p className="text-muted-foreground text-3xl font-medium sm:text-4xl md:text-5xl">
                    Hey <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text font-bold text-transparent">
                      {user && isAnonymousUser() ? "there" : (profile?.display_name.split(" ")[0] || "there")}
                    </span>,
                  </p>
                  <p className="text-muted-foreground/80 pt-4 text-base sm:text-lg md:pt-6 md:text-xl">
                    {user && isAnonymousUser() ? 
                      "Try Mayura for free! I'll pick the best AI model for each of your prompts." :
                      "Let's see which AI model I pick for you today!"
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Scroll to Bottom Button */}
        {isUserScrolledUp && chatMessages.length > 0 && (
          <div className="fixed bottom-32 right-4 z-50 md:bottom-20 md:right-6">
            <Button
              onClick={scrollToBottom}
              size="sm"
              className="flex items-center gap-2 rounded-full bg-violet-600 px-3 py-2 text-xs text-white shadow-lg hover:bg-violet-700 sm:px-4 sm:text-sm"
            >
              <ChevronDown size={14} className="sm:size-4" />
              <span className="hidden sm:inline">
                {isGenerating && "New message"}
                {!isGenerating && "Scroll to bottom"}
              </span>
              <span className="sm:hidden">
                {isGenerating && "New"}
                {!isGenerating && "Bottom"}
              </span>
            </Button>
          </div>
        )}
      </section>

      {/* Chat Input Area */}
      <footer className="shrink-0 border-t border-border bg-background p-3 sm:p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <ChatInput />
        </div>
      </footer>
    </div>
  )
}

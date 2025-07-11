"use client"

import Loading from "@/app/loading"
import { MayuraContext } from "@/context/context"
import { getChatById } from "@/db/chats"
import { getMessagesByChatId } from "@/db/messages"
import { useParams, useRouter } from "next/navigation"
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
  const router = useRouter()
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
          // If we can't fetch messages, it likely means the chat doesn't belong to the user
          // Redirect to /chat
          router.push("/chat")
          return
        }
      }

      const fetchChat = async () => {
        try {
          const chat = await getChatById(params.chatid as string)
          if (chat) {
            setSelectedChat(chat)
          } else {
            // Chat not found or doesn't belong to user - redirect to /chat
            console.log("Chat not found or access denied, redirecting to /chat")
            router.push("/chat")
            return
          }
        } catch (error) {
          console.error("Error fetching chat:", error)
          // If we can't fetch the chat, it likely means it doesn't belong to the user
          // Redirect to /chat
          router.push("/chat")
          return
        }
      }

      fetchChat()
      fetchMessages()
    }
  }, [params.chatid, setChatMessages, setSelectedChat, router])

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
    <div className="bg-background relative flex h-full flex-col">
      {/* Chat Messages Area */}
      {/* Anonymous User Banner - Absolute positioned within messages container */}
      {user && isAnonymousUser() && rateLimitStatus && (
        <div className="absolute inset-x-0 top-4 z-50 mx-auto max-w-4xl">
          <div className="shadow-lg">
            <AnonymousBanner
              requestsRemaining={rateLimitStatus.requests_remaining}
              totalRequests={rateLimitStatus.daily_limit}
            />
          </div>
        </div>
      )}
      <section
        className="bg-background flex-1 overflow-y-auto px-3 pb-4 sm:px-4 md:p-6"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {/* Add top spacing for mobile header on mobile only */}
        <div className="h-16 md:hidden" />
        
        <div className="relative mx-auto max-w-4xl space-y-4">

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
      <footer className="border-border bg-background shrink-0 border-t p-3 sm:p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <ChatInput />
        </div>
      </footer>
    </div>
  )
}

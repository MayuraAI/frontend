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

interface MayuraChatProps {}

export const MayuraChat: FC<MayuraChatProps> = ({}) => {
  const { setSelectedChat, chatMessages, setChatMessages, isGenerating, profile } =
    useContext(MayuraContext)

  const params = useParams()
  const { scrollToBottom, messagesStartRef, messagesEndRef, isUserScrolledUp, shouldAutoScroll } = useScroll()
  const [loading, setLoading] = useState(false)
  const [isReady, setIsReady] = useState(true)

  useEffect(() => {
    if (params.chatid) {
      const fetchMessages = async () => {
        setLoading(true)
        const dbMessages = await getMessagesByChatId(params.chatid as string)
        if (!dbMessages) return

        setChatMessages(dbMessages)
        setLoading(false)
        setIsReady(true)
      }

      const fetchChat = async () => {
        const chat = await getChatById(params.chatid as string)
        if (!chat) return

        setSelectedChat(chat)
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
    <div className="bg-background relative flex h-full flex-col">
      {/* Chat Messages Area */}
      <section
        className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8 bg-background"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="mx-auto max-w-4xl space-y-4 bg-background">
          <div ref={messagesStartRef} />
          <ChatMessages />
          <div ref={messagesEndRef} />

          {/* Responsive Welcome Message for New Chats */}
          {(!chatMessages || chatMessages.length === 0) && !isGenerating && (
            <div className="flex h-full min-h-[400px] sm:min-h-[500px] flex-col items-center justify-center text-center bg-background px-4">
              {/* Welcome Header */}
              <div className="flex flex-col items-center justify-center">
                <div className="max-w-2xl">
                  <p className="text-muted-foreground text-3xl sm:text-4xl md:text-5xl font-medium">
                    Hey <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent font-bold">{profile?.display_name.split(" ")[0] || "there"}</span>,
                  </p>
                  <p className="text-muted-foreground/80 text-base sm:text-lg md:text-xl pt-4 md:pt-6">
                    Let&apos;s see which AI model I pick for you today!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Scroll to Bottom Button */}
        {isUserScrolledUp && chatMessages.length > 0 && (
          <div className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 z-50">
            <Button
              onClick={scrollToBottom}
              size="sm"
              className="flex items-center gap-2 rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 text-xs sm:text-sm px-3 sm:px-4 py-2"
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
      <footer className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t p-3 sm:p-4 md:p-6 backdrop-blur">
        <div className="mx-auto max-w-4xl">
          <ChatInput />
        </div>
      </footer>
    </div>
  )
}

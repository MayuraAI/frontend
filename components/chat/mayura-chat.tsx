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
    <div className="relative flex h-full flex-col bg-background">
      {/* Chat Messages Area */}
      <section
        className="flex-1 overflow-y-auto bg-background px-3 pt-20 pb-32 sm:px-4 md:pt-6 md:pb-6 lg:px-8"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="bg-background mx-auto max-w-4xl space-y-4">
          <div ref={messagesStartRef} />
          <ChatMessages />
          <div ref={messagesEndRef} />

          {/* Responsive Welcome Message for New Chats */}
          {(!chatMessages || chatMessages.length === 0) && !isGenerating && (
            <div className="bg-background flex h-full min-h-[400px] flex-col items-center justify-center px-4 text-center sm:min-h-[500px]">
              {/* Welcome Header */}
              <div className="flex flex-col items-center justify-center">
                <div className="max-w-2xl">
                  <p className="text-muted-foreground text-3xl font-medium sm:text-4xl md:text-5xl">
                    Hey <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text font-bold text-transparent">{profile?.display_name.split(" ")[0] || "there"}</span>,
                  </p>
                  <p className="text-muted-foreground/80 pt-4 text-base sm:text-lg md:pt-6 md:text-xl">
                    Let&apos;s see which AI model I pick for you today!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Scroll to Bottom Button */}
        {isUserScrolledUp && chatMessages.length > 0 && (
          <div className="fixed bottom-16 right-4 z-50 sm:bottom-20 sm:right-6">
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
      <footer className="fixed bottom-0 left-0 z-10 w-full border-t border-border bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:p-4 md:relative md:p-6">
        <div className="mx-auto max-w-4xl">
          <ChatInput />
        </div>
      </footer>
    </div>
  )
}

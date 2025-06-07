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

interface MayuraChatProps {}

export const MayuraChat: FC<MayuraChatProps> = ({}) => {
  const { setSelectedChat, chatMessages, setChatMessages, isGenerating } =
    useContext(MayuraContext)

  const params = useParams()
  const { scrollToBottom } = useScroll()
  const [loading, setLoading] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
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

  useEffect(() => {
    if (autoScroll && chatMessages && chatMessages.length > 0) {
      scrollToBottom()
    }
  }, [chatMessages, autoScroll, scrollToBottom])

  useEffect(() => {
    if (isGenerating) {
      setAutoScroll(true)
    }
  }, [isGenerating])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="bg-bg-primary relative flex h-full flex-col">
      {/* Chat Messages Area */}
      <section 
        className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="mx-auto max-w-4xl">
          <ChatMessages />
          
          {/* Welcome Message for New Chats */}
          {(!chatMessages || chatMessages.length === 0) && !isGenerating && (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-8">
                <div className="bg-interactive-active mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl">
                  <svg className="text-brand-primary size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h2 className="text-text-primary mb-2 text-2xl font-semibold">
                  Welcome to Mayura AI
                </h2>
                <p className="text-text-secondary max-w-md">
                  Your intelligent routing assistant. Ask me anything and I'll connect you with the best AI model for your task.
                </p>
              </div>
              
              {/* Example Prompts */}
              <div className="grid w-full max-w-2xl gap-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <button className="bg-bg-tertiary border-border-color hover:bg-interactive-hover transition-smooth rounded-lg border p-4 text-left">
                    <div className="text-text-primary mb-1 font-medium">Creative Writing</div>
                    <div className="text-text-secondary text-sm">Help me write a story about the future</div>
                  </button>
                  <button className="bg-bg-tertiary border-border-color hover:bg-interactive-hover transition-smooth rounded-lg border p-4 text-left">
                    <div className="text-text-primary mb-1 font-medium">Code Analysis</div>
                    <div className="text-text-secondary text-sm">Review my Python code for improvements</div>
                  </button>
                  <button className="bg-bg-tertiary border-border-color hover:bg-interactive-hover transition-smooth rounded-lg border p-4 text-left">
                    <div className="text-text-primary mb-1 font-medium">Research Help</div>
                    <div className="text-text-secondary text-sm">Explain quantum computing concepts</div>
                  </button>
                  <button className="bg-bg-tertiary border-border-color hover:bg-interactive-hover transition-smooth rounded-lg border p-4 text-left">
                    <div className="text-text-primary mb-1 font-medium">Data Analysis</div>
                    <div className="text-text-secondary text-sm">Help me analyze my business metrics</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Chat Input Area */}
      <footer className="border-border-light bg-bg-primary border-t p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <ChatInput />
        </div>
      </footer>
    </div>
  )
}

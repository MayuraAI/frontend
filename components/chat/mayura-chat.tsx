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
    <div className="relative flex h-full flex-col bg-bg-primary">
      {/* Chat Messages Area */}
      <section 
        className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="max-w-4xl mx-auto">
          <ChatMessages />
          
          {/* Welcome Message for New Chats */}
          {(!chatMessages || chatMessages.length === 0) && !isGenerating && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-interactive-active rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-text-primary mb-2">
                  Welcome to Mayura AI
                </h2>
                <p className="text-text-secondary max-w-md">
                  Your intelligent routing assistant. Ask me anything and I'll connect you with the best AI model for your task.
                </p>
              </div>
              
              {/* Example Prompts */}
              <div className="grid gap-3 w-full max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button className="p-4 bg-bg-tertiary border border-border-color rounded-lg hover:bg-interactive-hover transition-smooth text-left">
                    <div className="font-medium text-text-primary mb-1">Creative Writing</div>
                    <div className="text-sm text-text-secondary">Help me write a story about the future</div>
                  </button>
                  <button className="p-4 bg-bg-tertiary border border-border-color rounded-lg hover:bg-interactive-hover transition-smooth text-left">
                    <div className="font-medium text-text-primary mb-1">Code Analysis</div>
                    <div className="text-sm text-text-secondary">Review my Python code for improvements</div>
                  </button>
                  <button className="p-4 bg-bg-tertiary border border-border-color rounded-lg hover:bg-interactive-hover transition-smooth text-left">
                    <div className="font-medium text-text-primary mb-1">Research Help</div>
                    <div className="text-sm text-text-secondary">Explain quantum computing concepts</div>
                  </button>
                  <button className="p-4 bg-bg-tertiary border border-border-color rounded-lg hover:bg-interactive-hover transition-smooth text-left">
                    <div className="font-medium text-text-primary mb-1">Data Analysis</div>
                    <div className="text-sm text-text-secondary">Help me analyze my business metrics</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Chat Input Area */}
      <footer className="p-4 md:p-6 border-t border-border-light bg-bg-primary">
        <div className="max-w-4xl mx-auto">
          <ChatInput />
        </div>
      </footer>
    </div>
  )
}

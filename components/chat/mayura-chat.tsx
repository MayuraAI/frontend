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

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Code2, Brain, BarChart3 } from "lucide-react"

interface MayuraChatProps {}

export const MayuraChat: FC<MayuraChatProps> = ({}) => {
  const { setSelectedChat, chatMessages, setChatMessages, isGenerating } =
    useContext(MayuraContext)

  const params = useParams()
  const { scrollToBottom, messagesStartRef, messagesEndRef } = useScroll()
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

  const examplePrompts = [
    {
      icon: Sparkles,
      title: "Creative Writing",
      description: "Help me write a story about the future",
      category: "creative"
    },
    {
      icon: Code2,
      title: "Code Analysis",
      description: "Review my Python code for improvements",
      category: "code"
    },
    {
      icon: Brain,
      title: "Research Help",
      description: "Explain quantum computing concepts",
      category: "research"
    },
    {
      icon: BarChart3,
      title: "Data Analysis",
      description: "Help me analyze my business metrics",
      category: "analysis"
    }
  ]

  return (
    <div className="bg-background relative flex h-full flex-col">
      {/* Chat Messages Area */}
      <section
        className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 bg-background"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="mx-auto max-w-4xl space-y-4 bg-background">
          <div ref={messagesStartRef} />
          <ChatMessages />
          <div ref={messagesEndRef} />

          {/* Welcome Message for New Chats */}
          {(!chatMessages || chatMessages.length === 0) && !isGenerating && (
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-center bg-background">
              {/* Welcome Header */}
              <div className="mb-16">
                <h1 className="text-foreground mb-4 text-4xl font-bold bg-background">
                  Welcome to Mayura
                </h1>
                <p className="text-muted-foreground max-w-md text-lg">
                  How can I help you today?
                </p>
              </div>

              {/* Example Prompts */}
              <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {examplePrompts.map((prompt, index) => {
                    const IconComponent = prompt.icon
                    return (
                      <Card
                        key={index}
                        className="cursor-no-effect rounded-lg"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="rounded-lg bg-violet-900/20 p-3">
                              <IconComponent className="size-6 text-violet-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-foreground mb-2 font-semibold">
                                {prompt.title}
                              </h3>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {prompt.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Chat Input Area */}
      <footer className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t p-4 backdrop-blur md:p-6">
        <div className="mx-auto max-w-4xl">
          <ChatInput />
        </div>
      </footer>
    </div>
  )
}

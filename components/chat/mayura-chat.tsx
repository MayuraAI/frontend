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
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Sparkles, Code2, Brain, BarChart3 } from "lucide-react"

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
    <div className="relative flex h-full flex-col bg-background">
      {/* Chat Messages Area */}
      <section 
        className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="mx-auto max-w-4xl">
          <ChatMessages />
          
          {/* Welcome Message for New Chats */}
          {(!chatMessages || chatMessages.length === 0) && !isGenerating && (
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-center">
              {/* Welcome Header */}
              <div className="mb-12">
                <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
                  Welcome to Mayura AI
                </h1>
                <p className="text-muted-foreground">
                  How can I help you today?
                </p>
              </div>
              
              {/* Example Prompts */}
              <div className="w-full max-w-2xl">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {examplePrompts.map((prompt, index) => {
                    const IconComponent = prompt.icon
                    return (
                      <Card 
                        key={index}
                        className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-border/50 hover:border-border"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {prompt.title}
                              </h3>
                              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
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
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <ChatInput />
        </div>
      </footer>
    </div>
  )
}

"use client"

import Loading from "@/app/loading"
import { ChatbotUIContext } from "@/context/context"
import { getChatById } from "@/db/chats"
import { getMessagesByChatId } from "@/db/messages"
import { useParams } from "next/navigation"
import { FC, useContext, useEffect, useState } from "react"
import { useScroll } from "./chat-hooks/use-scroll"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"

interface ChatUIProps {}

export const ChatUI: FC<ChatUIProps> = ({}) => {
  const { setSelectedChat, chatMessages, setChatMessages, isGenerating } =
    useContext(ChatbotUIContext)

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
    <div className="relative flex h-full flex-col items-center">
      <div className="no-scrollbar bg-secondary flex size-full flex-col items-center overflow-y-auto">
        <ChatMessages />
      </div>

      <div className="bg-background absolute bottom-0 w-full">
        <ChatInput />
      </div>

      {/* <ChatSecondaryButtons />
      <ChatHelp /> */}
    </div>
  )
}

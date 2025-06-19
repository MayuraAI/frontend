import { MayuraContext } from "@/context/context"
import { useCallback, useContext, useEffect, useRef } from "react"

export const useScroll = () => {
  const { isGenerating, chatMessages } = useContext(MayuraContext)

  const messagesStartRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end"
      })
    }
  }, [])

  const scrollToBottomInstant = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "instant",
        block: "end"
      })
    }
  }, [])

  // Auto-scroll to bottom when chat is first loaded with messages
  useEffect(() => {
    if (chatMessages.length > 0) {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [chatMessages.length > 0 ? chatMessages[0]?.id : null, scrollToBottom])

  // Auto-scroll during message generation (streaming)
  useEffect(() => {
    if (isGenerating) {
      // Continuously scroll to bottom during generation
      const scrollInterval = setInterval(() => {
        scrollToBottomInstant()
      }, 100) // Scroll every 100ms during generation

      return () => clearInterval(scrollInterval)
    }
  }, [isGenerating, scrollToBottomInstant])

  // Auto-scroll when streaming ends to show UI elements (copy button, etc.)
  useEffect(() => {
    // When isGenerating changes from true to false (streaming ends)
    if (!isGenerating && chatMessages.length > 0) {
      // Small delay to let UI elements render, then scroll to bottom
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isGenerating, scrollToBottom, chatMessages.length])

  return {
    messagesStartRef,
    messagesEndRef,
    scrollToBottom
  }
}

import { MayuraContext } from "@/context/context"
import { useCallback, useContext, useEffect, useRef, useState } from "react"

export const useScroll = () => {
  const { isGenerating, chatMessages } = useContext(MayuraContext)

  const messagesStartRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  // Check if user is near the bottom of the scroll container
  const isNearBottom = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return true
    
    const threshold = 100 // pixels from bottom
    const { scrollTop, scrollHeight, clientHeight } = container
    return scrollHeight - scrollTop - clientHeight < threshold
  }, [])

  // Handle user scroll events
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const nearBottom = isNearBottom()
    setIsUserScrolledUp(!nearBottom)
    setShouldAutoScroll(nearBottom)
  }, [isNearBottom])

  // Set up scroll container reference and event listener
  useEffect(() => {
    // Find the scroll container (the messages section)
    const container = messagesEndRef.current?.closest('[role="log"]') as HTMLElement
    if (container) {
      scrollContainerRef.current = container
      container.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

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
        setShouldAutoScroll(true)
        setIsUserScrolledUp(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [chatMessages.length > 0 ? chatMessages[0]?.id : null, scrollToBottom])

  // Auto-scroll during message generation (streaming) - but only if user hasn't scrolled up
  useEffect(() => {
    if (isGenerating && shouldAutoScroll && !isUserScrolledUp) {
      // Less aggressive scrolling - only scroll if user is near bottom
      const scrollInterval = setInterval(() => {
        if (shouldAutoScroll && !isUserScrolledUp) {
          scrollToBottomInstant()
        }
      }, 500) // Reduced frequency from 100ms to 500ms

      return () => clearInterval(scrollInterval)
    }
  }, [isGenerating, shouldAutoScroll, isUserScrolledUp, scrollToBottomInstant])

  // Auto-scroll when streaming ends to show UI elements (copy button, etc.)
  useEffect(() => {
    // When isGenerating changes from true to false (streaming ends)
    if (!isGenerating && chatMessages.length > 0 && shouldAutoScroll) {
      // Small delay to let UI elements render, then scroll to bottom
      const timer = setTimeout(() => {
        scrollToBottom()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isGenerating, scrollToBottom, chatMessages.length, shouldAutoScroll])

  // Function to manually scroll to bottom (for user interaction)
  const forceScrollToBottom = useCallback(() => {
    scrollToBottom()
    setShouldAutoScroll(true)
    setIsUserScrolledUp(false)
  }, [scrollToBottom])

  return {
    messagesStartRef,
    messagesEndRef,
    scrollToBottom: forceScrollToBottom,
    isUserScrolledUp,
    shouldAutoScroll
  }
}

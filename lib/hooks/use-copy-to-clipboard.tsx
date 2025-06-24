import { useState } from "react"

export interface useCopyToClipboardProps {
  timeout?: number,
  setIsCopied: (isCopied: boolean) => void
}

export function useCopyToClipboard({
  timeout = 2000,
  setIsCopied
}: useCopyToClipboardProps) {

  const filterThinkTags = (text: string): string => {
    // Remove content between ◁think▷ and ◁/think▷ tags (including the tags themselves)
    return text.replace(/◁think▷[\s\S]*?◁\/think▷/g, '').trim()
  }

  const copyToClipboard = async (value: string) => {
    if (!value) {
      return
    }

    // Filter out think tags from the value
    const filteredValue = filterThinkTags(value)
    
    if (!filteredValue) {
      return
    }

    navigator.clipboard.writeText(filteredValue).then(() => {
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    })
  }

  return { copyToClipboard }
}

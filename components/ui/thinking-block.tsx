import React, { useState } from "react"
import { Button } from "./button"
import { IconChevronDown, IconChevronUp, IconBrain } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface ThinkingBlockProps {
  thinking: string
  isPlaceholder?: boolean
  thinkingFlow?: string
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({ 
  thinking, 
  isPlaceholder = false,
  thinkingFlow
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!thinking && !isPlaceholder) return null

  // Show minimal placeholder while thinking
  if (isPlaceholder) {
    return (
      <div className="mb-4 rounded-lg border border-slate-600 bg-slate-900/30">
        <div className="flex items-center gap-2 p-3 text-sm text-slate-400">
          <IconBrain size={16} className="animate-pulse text-slate-500" />
          <span className="animate-pulse text-slate-500">AI is thinking...</span>
          <div className="ml-auto flex space-x-1">
            <div className="h-1 w-1 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]"></div>
            <div className="h-1 w-1 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]"></div>
            <div className="h-1 w-1 animate-bounce rounded-full bg-slate-500"></div>
          </div>
        </div>
      </div>
    )
  }

  // Check if this is live thinking content (no thinkingFlow means it's still streaming)
  // But if thinkingFlow exists, it means thinking is complete and should show as dropdown
  // Also, if thinking content looks complete (contains full sentences or is very long), treat as completed
  const looksLikeCompletedThinking = thinking && (
    thinking.includes('.') || 
    thinking.includes('!') || 
    thinking.includes('?') || 
    thinking.length > 200
  )
  
  const isLiveThinking = !thinkingFlow && thinking && thinking.trim().length > 0 && isPlaceholder === false && !looksLikeCompletedThinking

  // Show live thinking preview (2 rows) while streaming
  if (isLiveThinking) {
    // For live thinking, show the most recent content (last 2 lines or last ~300 characters)
    const lines = thinking.split('\n').filter(line => line.trim().length > 0)
    let previewText = ""
    
    if (lines.length <= 2) {
      // If 2 or fewer lines, show all
      previewText = thinking.substring(Math.max(0, thinking.length - 300))
    } else {
      // Show last 2 lines for scrolling effect
      previewText = lines.slice(-2).join('\n')
    }
    
    // Ensure we don't exceed 300 characters for display
    if (previewText.length > 300) {
      previewText = "..." + previewText.substring(previewText.length - 297)
    }

    const hasMore = thinking.length > previewText.length

    return (
      <div className="mb-4 rounded-lg border border-slate-600 bg-slate-900/20">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2 text-sm text-slate-400">
            <IconBrain size={16} className="animate-pulse text-slate-500" />
            <span className="text-slate-400">AI is thinking...</span>
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <div className="whitespace-pre-wrap">
              {previewText}
              {hasMore && (
                <span className="animate-pulse"> ...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If thinkingFlow is missing but thinking is present and not a placeholder, still show the dropdown using the full thinking as content
  const displayThinkingFlow = thinkingFlow || (thinking && !isPlaceholder ? thinking.substring(0, 100) + (thinking.length > 100 ? '...' : '') : undefined)

  return (
    <div className="mb-4 rounded-lg border border-slate-600 bg-slate-900/20">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-auto w-full justify-between p-3 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
      >
        <div className="flex items-center gap-2 text-sm">
          <IconBrain size={16} className="text-slate-500" />
          <div className="flex-1 text-left">
            <div className="font-medium text-slate-400">AI Reasoning</div>
            {displayThinkingFlow && (
              <div className="mt-1 truncate text-xs text-slate-500">
                {displayThinkingFlow}...
              </div>
            )}
          </div>
        </div>
        {isExpanded ? (
          <IconChevronUp size={16} className="text-slate-500" />
        ) : (
          <IconChevronDown size={16} className="text-slate-500" />
        )}
      </Button>

      {isExpanded && (
        <div className="px-3 pb-3">
          <div className="border-t border-slate-600 pt-3">
            <div className="whitespace-pre-wrap rounded border border-slate-600 bg-slate-900 p-3 font-mono text-sm text-slate-300">
              {thinking}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

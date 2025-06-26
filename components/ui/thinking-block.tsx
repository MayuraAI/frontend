import React, { useState } from "react"
import { Button } from "./button"
import { IconChevronDown, IconChevronUp, IconBrain } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface ThinkingBlockProps {
  thinking: string
  isPlaceholder?: boolean
  isComplete?: boolean // New prop to clearly indicate when thinking is done
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({ 
  thinking, 
  isPlaceholder = false,
  isComplete = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Don't render anything if no thinking content and not a placeholder
  if (!thinking && !isPlaceholder) return null

  // Show placeholder while waiting for thinking to start
  if (isPlaceholder && !thinking) {
    return (
      <div className="mb-4 rounded-lg border border-slate-600 bg-slate-900/30">
        <div className="flex items-center gap-2 p-3 text-sm text-slate-400">
          <IconBrain size={16} className="animate-pulse text-slate-500 shrink-0" />
          <span className="animate-pulse text-slate-500">AI is thinking...</span>
          <div className="ml-auto flex space-x-1 shrink-0">
            <div className="size-1 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]"></div>
            <div className="size-1 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]"></div>
            <div className="size-1 animate-bounce rounded-full bg-slate-500"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show live thinking with scrolling preview (when thinking is in progress)
  if (!isComplete && thinking) {
    // Get the last two lines or last ~200 characters for scrolling effect
    const lines = thinking.split('\n').filter(line => line.trim().length > 0)
    let previewText = ""
    
    if (lines.length <= 2) {
      // Show all if 2 or fewer lines
      previewText = thinking
    } else {
      // Show last 2 lines
      previewText = lines.slice(-2).join('\n')
    }
    
    // Limit preview to reasonable length for mobile
    if (previewText.length > 150) {
      previewText = "..." + previewText.substring(previewText.length - 147)
    }

    return (
      <div className="mb-4 rounded-lg border border-slate-600 bg-slate-900/20">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <IconBrain size={16} className="animate-pulse text-slate-500 shrink-0" />
            <span className="animate-pulse text-slate-400">AI is thinking...</span>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed font-mono">
            <div className="whitespace-pre-wrap max-h-12 overflow-hidden break-words">
              {previewText}
              <span className="animate-pulse">...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show completed thinking as expandable dropdown
  if (isComplete && thinking) {
    // Create a brief preview for the dropdown header - shorter for mobile
    const previewText = thinking.length > 80 
      ? thinking.substring(0, 80) + "..." 
      : thinking

    return (
      <div className="mb-4 rounded-lg border border-slate-600 bg-slate-900/20">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-auto w-full justify-between p-3 text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
        >
          <div className="flex items-center gap-2 text-sm min-w-0 flex-1">
            <IconBrain size={14} className="text-slate-500 shrink-0 sm:size-4" />
            <div className="flex-1 min-w-0 text-left">
              <div className="font-medium text-slate-400 text-xs sm:text-sm">AI Reasoning</div>
              <div className="mt-1 text-xs text-slate-500 break-words overflow-hidden line-clamp-2 sm:line-clamp-1">
                {previewText}
              </div>
            </div>
          </div>
          <div className="shrink-0 ml-2">
            {isExpanded ? (
              <IconChevronUp size={14} className="text-slate-500 sm:size-4" />
            ) : (
              <IconChevronDown size={14} className="text-slate-500 sm:size-4" />
            )}
          </div>
        </Button>

        {isExpanded && (
          <div className="px-3 pb-3">
            <div className="border-t border-slate-600 pt-3">
              <div className="whitespace-pre-wrap rounded border border-slate-600 bg-slate-900 p-3 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto">
                {thinking}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}

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
          <IconBrain size={16} className="shrink-0 animate-pulse text-slate-500" />
          <span className="animate-pulse text-slate-500">AI is thinking...</span>
          <div className="ml-auto flex shrink-0 space-x-1">
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
          <div className="mb-2 flex items-center gap-2 text-sm">
            <IconBrain size={16} className="shrink-0 animate-pulse text-slate-500" />
            <span className="animate-pulse text-slate-400">AI is thinking...</span>
          </div>
          <div className="font-mono text-xs leading-relaxed text-slate-400">
            <div className="max-h-12 overflow-hidden whitespace-pre-wrap break-words">
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
          <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
            <IconBrain size={14} className="shrink-0 text-slate-500 sm:size-4" />
            <div className="min-w-0 flex-1 text-left">
              <div className="text-xs font-medium text-slate-400 sm:text-sm">AI Reasoning</div>
              <div className="mt-1 line-clamp-2 overflow-hidden break-words text-xs text-slate-500 sm:line-clamp-1">
                {previewText}
              </div>
            </div>
          </div>
          <div className="ml-2 shrink-0">
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
              <div className="overflow-x-auto whitespace-pre-wrap rounded border border-slate-600 bg-slate-900 p-3 font-mono text-xs text-slate-300 sm:text-sm">
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

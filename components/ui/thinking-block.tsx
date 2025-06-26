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
    
    // Limit preview to reasonable length
    if (previewText.length > 200) {
      previewText = "..." + previewText.substring(previewText.length - 197)
    }

    return (
      <div className="mb-4 rounded-lg border border-slate-600 bg-slate-900/20">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <IconBrain size={16} className="animate-pulse text-slate-500" />
            <span className="animate-pulse text-slate-400">AI is thinking...</span>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed font-mono">
            <div className="whitespace-pre-wrap max-h-12 overflow-hidden">
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
    // Create a brief preview for the dropdown header
    const previewText = thinking.length > 100 
      ? thinking.substring(0, 100) + "..." 
      : thinking

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
              <div className="mt-1 truncate text-xs text-slate-500">
                {previewText}
              </div>
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

  return null
}

import React, { useState } from "react"
import { Button } from "./button"
import { IconChevronDown, IconChevronUp, IconBrain } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface ThinkingBlockProps {
  thinking: string
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({ thinking }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!thinking) return null

  return (
    <div className="mb-4 rounded-lg border-2 border-dashed border-slate-600 bg-black">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-auto w-full justify-between p-4 text-white hover:bg-slate-800"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <IconBrain size={16} />
          <span>AI Reasoning Process</span>
        </div>
        {isExpanded ? (
          <IconChevronUp size={16} className="text-slate-400" />
        ) : (
          <IconChevronDown size={16} className="text-slate-400" />
        )}
      </Button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-slate-600 pt-3">
            <div className="whitespace-pre-wrap rounded border border-slate-600 bg-slate-900 p-3 font-mono text-sm text-white">
              {thinking}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

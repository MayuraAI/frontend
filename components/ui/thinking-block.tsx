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
    <div className="mb-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-auto w-full justify-between p-4 hover:bg-gray-100/50"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <IconBrain size={16} />
          <span>AI Reasoning Process</span>
        </div>
        {isExpanded ? (
          <IconChevronUp size={16} className="text-gray-500" />
        ) : (
          <IconChevronDown size={16} className="text-gray-500" />
        )}
      </Button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-gray-200 pt-3">
            <div className="whitespace-pre-wrap rounded border bg-white p-3 font-mono text-sm text-gray-700">
              {thinking}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

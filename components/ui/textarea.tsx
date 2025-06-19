import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "bg-input text-foreground placeholder:text-muted-foreground shadow-neo focus-visible:ring-ring focus-visible:shadow-neo-md disabled:bg-interactive-disabled neo-click-press flex min-h-[80px] w-full resize-none border-4 border-black px-4 py-3 text-base font-black transition-all duration-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-4 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "border-3 focus:ring-ring shadow-neo-sm font-neo inline-flex items-center border-black px-3 py-2 text-sm font-black transition-all duration-100 focus:outline-none focus:ring-4 focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Theme-responsive variants using CSS variables
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "bg-background text-foreground hover:bg-muted",

        // Fixed color neobrutalism variants
        electric: "bg-neo-electric hover:bg-neo-electric/90 text-black",
        neon: "bg-neo-neon hover:bg-neo-neon/90 text-white",
        cyber: "bg-neo-cyber hover:bg-neo-cyber/90 text-black",
        toxic: "bg-neo-toxic hover:bg-neo-toxic/90 text-black",
        warning: "bg-neo-warning hover:bg-neo-warning/90 text-black",
        danger: "bg-neo-danger hover:bg-neo-danger/90 text-white",
        info: "bg-neo-info hover:bg-neo-info/90 text-white",
        success: "bg-neo-success hover:bg-neo-success/90 text-white",

        // Special variants
        brutal:
          "bg-neo-black text-neo-white border-neo-white dark:bg-neo-white dark:text-neo-black dark:border-neo-black",
        muted: "bg-muted text-muted-foreground hover:bg-muted/80"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

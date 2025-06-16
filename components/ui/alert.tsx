import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "shadow-neo [&>svg]:text-foreground relative w-full border-4 border-black p-6 text-lg font-bold [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-6 [&>svg]:top-6 [&>svg]:size-5 [&>svg~*]:pl-8",
  {
    variants: {
      variant: {
        // Theme-responsive variants
        default: "bg-background text-foreground",
        
        // Status-specific variants with proper contrast
        success: "bg-success text-success-foreground [&>svg]:text-success-foreground",
        destructive: "bg-destructive text-destructive-foreground [&>svg]:text-destructive-foreground",
        warning: "bg-warning text-warning-foreground [&>svg]:text-warning-foreground",
        info: "bg-info text-info-foreground [&>svg]:text-info-foreground",
        
        // Fixed neobrutalism color variants
        electric: "bg-neo-electric text-black [&>svg]:text-black",
        neon: "bg-neo-neon text-white [&>svg]:text-white",
        cyber: "bg-neo-cyber text-black [&>svg]:text-black",
        toxic: "bg-neo-toxic text-black [&>svg]:text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-brutal mb-2 text-xl font-black leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-neo text-base font-bold [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

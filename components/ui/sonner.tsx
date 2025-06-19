"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow",
          description: "group-[.toast]:text-zinc-600",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-zinc-200 group-[.toast]:text-zinc-600"
        }
      }}
      {...props}
    />
  )
}

export { Toaster }

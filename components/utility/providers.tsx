"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ChatbotUIProvider } from "@/context/context"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"
import { FC } from "react"

export const Providers: FC<ThemeProviderProps> = ({ children, ...props }) => {
  return (
    <NextThemesProvider {...props}>
      <ChatbotUIProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ChatbotUIProvider>
    </NextThemesProvider>
  )
}

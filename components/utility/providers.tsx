"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { MayuraProvider } from "@/context/context"
import { FC, ReactNode } from "react"
import PostHogProvider from "./PostHogProvider"

interface ProvidersProps {
  children: ReactNode
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <MayuraProvider>
      <PostHogProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </PostHogProvider>
    </MayuraProvider>
  )
}

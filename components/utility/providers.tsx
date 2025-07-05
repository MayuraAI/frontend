"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { MayuraProvider } from "@/context/context"
import { FC, ReactNode } from "react"
import { CSPostHogProvider } from "./PostHogProvider"

interface ProvidersProps {
  children: ReactNode
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <MayuraProvider>
      <CSPostHogProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </CSPostHogProvider>
    </MayuraProvider>
  )
}

"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { MayuraProvider } from "@/context/context"
import { FC, ReactNode } from "react"

interface ProvidersProps {
  children: ReactNode
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <MayuraProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </MayuraProvider>
  )
}

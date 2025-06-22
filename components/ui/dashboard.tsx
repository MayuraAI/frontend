"use client"

import { Tabs } from "@/components/ui/tabs"
import { MayuraContext } from "@/context/context"
import { cn } from "@/lib/utils"
import { ContentType } from "@/types"
import { IconChevronCompactRight, IconMenu2 } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, ReactNode, useContext, useEffect, useState } from "react"
import { Button } from "./button"
import { Sidebar } from "../sidebar/sidebar"
import useHotkey from "@/lib/hooks/use-hotkey"
import RateLimitStatus from "./rate-limit-status"

export const SIDEBAR_WIDTH = 288 // 18rem in pixels

interface DashboardProps {
  children: React.ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  useHotkey("s", () => setShowSidebar(prevState => !prevState))

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"

  const [contentType, setContentType] = useState<ContentType>(
    tabValue as ContentType
  )
  const [showSidebar, setShowSidebar] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("showSidebar")
    setShowSidebar(saved !== null ? saved === "true" : true)
    setIsLoaded(true)
  }, [])

  const handleToggleSidebar = () => {
    setShowSidebar(prevState => !prevState)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }

  if (!isLoaded) {
    return <div className="bg-background flex h-screen w-full" />
  }

  return (
    <div className="bg-background flex h-screen w-full overflow-hidden">
      {/* Dark Sidebar */}
      <aside
        className={cn(
          "bg-sidebar absolute z-20 h-full border-r shadow-lg transition-all duration-300 ease-in-out md:relative",
          showSidebar
            ? "translate-x-0"
            : "-translate-x-full md:-translate-x-full"
        )}
        style={{ width: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px" }}
        aria-label="Navigation sidebar"
      >
        {showSidebar && (
          <Tabs
            className="flex h-full flex-col"
            value={contentType}
            onValueChange={tabValue => {
              setContentType(tabValue as ContentType)
              router.replace(`${pathname}?tab=${tabValue}`)
            }}
          >
            <Sidebar contentType={contentType} showSidebar={showSidebar} />
          </Tabs>
        )}
      </aside>

      {/* Dark Main Content Area */}
      <main className="bg-background flex min-w-0 flex-1 flex-col">
        {/* Dark Mobile Header */}
        <header className="bg-sidebar border-sidebar-border flex items-center justify-between border-b p-4 shadow-sm md:hidden">
          <Button
            variant="outline"
            size="icon"
            className="rounded-lg border shadow-sm"
            onClick={handleToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <IconMenu2 size={24} />
          </Button>
          <h1 className="text-sidebar-foreground text-lg font-semibold">MAYURA</h1>
          <RateLimitStatus compact className="ml-2" />
        </header>

        {/* Desktop Rate Limit Status - Top Right Corner */}
        <div className="absolute right-4 top-4 z-50 hidden md:block">
          <RateLimitStatus compact />
        </div>

        {/* Chat Content Area */}
        <section className="bg-background relative m-2 flex-1 overflow-hidden rounded-lg shadow-sm">
          {children}
        </section>

        {/* Dark Sidebar Toggle Button for Desktop */}
        <Button
          className={cn(
            "bg-sidebar hover:bg-sidebar-muted border-sidebar-border absolute left-1 top-1/2 z-50 size-8 rounded-lg border shadow-md transition-all duration-300",
            "hidden md:flex"
          )}
          style={{
            transform: `translateY(-50%) ${showSidebar ? "rotate(180deg)" : "rotate(0deg)"}`,
            left: showSidebar ? `${SIDEBAR_WIDTH + 10}px` : "8px"
          }}
          variant="outline"
          size="icon"
          onClick={handleToggleSidebar}
          aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
        >
          <IconChevronCompactRight size={24} className="text-sidebar-foreground" />
        </Button>
      </main>

      {/* Dark Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={handleToggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

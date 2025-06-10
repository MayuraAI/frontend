"use client"

import { Sidebar } from "@/components/sidebar/sidebar"
import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import { ContentType } from "@/types"
import { IconChevronCompactRight, IconMenu2 } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState, useEffect } from "react"
import { CommandK } from "../utility/command-k"

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
      <CommandK />

      {/* Sidebar Navigation */}
      <nav
        className={cn(
          "bg-card absolute z-20 flex h-full flex-col border-r transition-all duration-300 ease-in-out md:relative",
          showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          showSidebar ? "w-72" : "w-0 md:w-72"
        )}
        style={{
          width: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          minWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          maxWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px"
        }}
        aria-label="Main navigation"
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
      </nav>

      {/* Main Content Area */}
      <main className="bg-background flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <header className="bg-card flex items-center justify-between border-b p-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="focus-ring -ml-2"
            onClick={handleToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <IconMenu2 size={24} />
          </Button>
          <h1 className="text-foreground text-xl font-semibold">Mayura AI</h1>
          <div className="w-10" aria-hidden="true" />
        </header>

        {/* Chat Content */}
        <section className="relative flex-1 overflow-hidden">
          {children}
        </section>

        {/* Sidebar Toggle Button for Desktop */}
        <Button
          className={cn(
            "bg-card hover:bg-accent absolute left-1 top-1/2 z-10 size-8 border shadow-md transition-all duration-300",
            "focus-ring hidden md:flex"
          )}
          style={{
            transform: `translateY(-50%) ${showSidebar ? "rotate(180deg)" : "rotate(0deg)"}`,
            left: showSidebar ? `${SIDEBAR_WIDTH - 16}px` : "4px"
          }}
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
          aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
        >
          <IconChevronCompactRight
            size={20}
            className="text-muted-foreground"
          />
        </Button>
      </main>

      {/* Mobile Sidebar Overlay */}
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

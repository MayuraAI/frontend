"use client"

import { Tabs } from "@/components/ui/tabs"
import { MayuraContext } from "@/context/context"
import { cn } from "@/lib/utils"
import { ContentType } from "@/types"
import { IconChevronCompactRight, IconMenu2 } from "@tabler/icons-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, ReactNode, useContext, useEffect, useState, Suspense } from "react"
import { Button } from "./button"
import { Sidebar } from "../sidebar/sidebar"
import useHotkey from "@/lib/hooks/use-hotkey"
import RateLimitStatus from "./rate-limit-status"
import { useAuth } from "@/context/auth-context"
import { isAnonymousUser } from "@/lib/firebase/auth"

// Responsive sidebar widths
export const SIDEBAR_WIDTH_MOBILE = 280 // Slightly smaller for mobile
export const SIDEBAR_WIDTH_DESKTOP = 320 // Optimal for desktop

interface DashboardProps {
  children: ReactNode
}

export const Dashboard: FC<DashboardProps> = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  useHotkey("s", () => setShowSidebar(prevState => !prevState))

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabValue = searchParams.get("tab") || "chats"
  const { user } = useAuth()

  const [contentType, setContentType] = useState<ContentType>(
    tabValue as ContentType
  )
  const [showSidebar, setShowSidebar] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if user is anonymous - if so, don't show sidebar
  const isAnonymous = user && isAnonymousUser()
  const shouldShowSidebar = !isAnonymous && showSidebar

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("showSidebar")
    // On mobile, default to closed sidebar
    // For anonymous users, always keep sidebar closed
    const defaultOpen = isAnonymous ? false : (isMobile ? false : true)
    setShowSidebar(saved !== null ? saved === "true" : defaultOpen)
    setIsLoaded(true)
  }, [isMobile, isAnonymous])

  const handleToggleSidebar = () => {
    // Don't allow toggling sidebar for anonymous users
    if (isAnonymous) return
    
    setShowSidebar(prevState => !prevState)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && showSidebar) {
      setShowSidebar(false)
    }
  }, [pathname, isMobile])

  if (!isLoaded) {
    return <div className="bg-background flex h-screen w-full" />
  }

  const sidebarWidth = isMobile ? SIDEBAR_WIDTH_MOBILE : SIDEBAR_WIDTH_DESKTOP

  return (
    <div className="bg-background flex h-screen w-full overflow-hidden">
      {/* Responsive Sidebar - Hidden for anonymous users */}
      {!isAnonymous && (
        <aside
          className={cn(
            "bg-sidebar fixed z-20 h-full border-r shadow-lg transition-all duration-300 ease-in-out",
            "md:relative md:shadow-none",
            shouldShowSidebar
              ? "translate-x-0"
              : "-translate-x-full"
          )}
          style={{ width: shouldShowSidebar ? `${sidebarWidth}px` : "0px" }}
          aria-label="Navigation sidebar"
        >
          {shouldShowSidebar && (
            <Tabs
              className="flex h-full flex-col"
              value={contentType}
              onValueChange={tabValue => {
                setContentType(tabValue as ContentType)
                router.push(`${pathname}?tab=${tabValue}`)
              }}
            >
              <Sidebar contentType={contentType} showSidebar={shouldShowSidebar} />
            </Tabs>
          )}
        </aside>
      )}

      {/* Main Content Area */}
      <main className="bg-background flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <header className="bg-sidebar border-sidebar-border fixed top-0 left-0 z-20 flex h-16 w-full items-center justify-between border-b p-3 shadow-sm md:hidden">
          {/* Only show menu button for non-anonymous users */}
          {!isAnonymous && (
            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-lg border shadow-sm"
              onClick={handleToggleSidebar}
              aria-label="Toggle navigation menu"
            >
              <IconMenu2 size={20} />
            </Button>
          )}
          {/* For anonymous users, show empty div to maintain layout */}
          {isAnonymous && <div className="size-9" />}
          
          <h1 className="text-sidebar-foreground text-lg font-semibold">MAYURA</h1>
          <RateLimitStatus compact className="ml-2" />
        </header>

        {/* Desktop Rate Limit Status - Top Right Corner */}
        <div className="absolute right-4 top-4 z-50 hidden md:block">
          <RateLimitStatus compact />
        </div>

        {/* Chat Content Area */}
        <section className="bg-background relative flex-1 overflow-hidden">
          {children}
        </section>

        {/* Desktop Sidebar Toggle Button - Hidden for anonymous users */}
        {!isAnonymous && (
          <Button
            className={cn(
              "bg-sidebar hover:bg-sidebar-muted border-sidebar-border absolute left-1 top-1/2 z-50 size-8 rounded-lg border shadow-md transition-all duration-300",
              "hidden md:flex"
            )}
            style={{
              transform: `translateY(-50%) ${shouldShowSidebar ? "rotate(180deg)" : "rotate(0deg)"}`,
              left: shouldShowSidebar ? `${sidebarWidth + 8}px` : "8px"
            }}
            variant="outline"
            size="icon"
            onClick={handleToggleSidebar}
            aria-label={shouldShowSidebar ? "Hide sidebar" : "Show sidebar"}
          >
            <IconChevronCompactRight size={20} className="text-sidebar-foreground" />
          </Button>
        )}
      </main>

      {/* Mobile Sidebar Overlay - Hidden for anonymous users */}
      {!isAnonymous && shouldShowSidebar && (
        <div
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={handleToggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

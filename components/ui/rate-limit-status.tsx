"use client"

import { useContext, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RateLimitStatus as RateLimitStatusType, RateLimitState } from "@/types/rate-limit"
import { RateLimitService } from "@/lib/services/rate-limit"
import { MayuraContext } from "@/context/context"
import { IconRefresh, IconAlertTriangle, IconBolt, IconCheck, IconClock } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useRateLimit } from "@/lib/hooks/use-rate-limit"

interface RateLimitStatusProps {
  className?: string
  compact?: boolean
  onStatusUpdate?: (status: RateLimitStatusType) => void
}

export default function RateLimitStatus({ 
  className, 
  compact = false,
  onStatusUpdate 
}: RateLimitStatusProps) {
  const { profile, rateLimitRefreshTrigger } = useContext(MayuraContext)
  const { rateLimitStatus, fetchLatestStatus } = useRateLimit()

  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    status: null,
    loading: true,
    error: null,
    lastUpdated: null
  })

  const fetchStatus = useCallback(async () => {
    if (!profile) return
    setRateLimitState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const status = await fetchLatestStatus()
      if (status) {
        setRateLimitState({
          status,
          loading: false,
          error: null,
          lastUpdated: new Date()
        })
        onStatusUpdate?.(status)
      }
    } catch (err) {
      setRateLimitState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch status"
      }))
    }
  }, [profile, fetchLatestStatus, onStatusUpdate])

  useEffect(() => {
    if (rateLimitStatus) {
      setRateLimitState({
        status: rateLimitStatus,
        loading: false,
        error: null,
        lastUpdated: new Date()
      })
    }
  }, [rateLimitStatus])

  useEffect(() => {
    if (profile && !rateLimitStatus) fetchStatus()
  }, [profile, rateLimitStatus, fetchStatus])

  useEffect(() => {
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  // Listen for manual refresh triggers (like after sending messages)
  useEffect(() => {
    if (rateLimitRefreshTrigger > 0) {
      console.log("Rate limit refresh triggered, count:", rateLimitRefreshTrigger)
      // Add a small delay to allow the backend to process the request
      const timeoutId = setTimeout(() => {
        console.log("Executing delayed rate limit fetch...")
        fetchStatus()
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [rateLimitRefreshTrigger, fetchStatus])

  if (!profile) return null

  const { status, loading, error, lastUpdated } = rateLimitState
  if (loading && !status) {
    return (
      <div className={cn("border-4 border-black bg-card shadow-[4px_4px_0px_0px_black] p-4 w-64", className)}>
        <div className="flex items-center space-x-3">
          <div className="h-4 w-4 bg-muted border-2 border-black animate-pulse" />
          <div className="h-4 flex-1 bg-muted border-2 border-black animate-pulse" />
          <div className="h-4 w-12 bg-muted border-2 border-black animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("border-4 border-black bg-destructive text-destructive-foreground shadow-[4px_4px_0px_0px_black] p-4 w-64", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconAlertTriangle size={20} strokeWidth={3} />
            <span className="text-sm font-semibold">Rate limit error</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStatus}
            className="h-8 w-8 p-0 border-2 border-black bg-white hover:bg-zinc-100 shadow-[2px_2px_0px_0px_black] hover:shadow-[3px_3px_0px_0px_black] transition-all"
          >
            <IconRefresh size={16} strokeWidth={3} />
          </Button>
        </div>
      </div>
    )
  }

  if (!status) return null

  const {
    daily_limit,
    requests_remaining,
    requests_used,
    current_mode,
    message,
    reset_time_unix
  } = status

  const isPro = current_mode === "pro"
  const isFree = current_mode === "free"
  const proExhausted = isFree && requests_used >= daily_limit
  const progress = isPro ? (requests_used / daily_limit) * 100 : 100
  const timeUntilReset = RateLimitService.getTimeUntilReset(reset_time_unix)

  const getTag = () => {
    if (isPro) {
      return (
        <div className="flex items-center space-x-2">
          <IconCheck size={18} strokeWidth={3} className="text-green-600" />
          <span className="ml-1">{requests_used} / {daily_limit} Pro</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center space-x-2">
          <IconBolt size={18} strokeWidth={3} className="text-yellow-600" />
          <span className="ml-1">Free mode active</span>
        </div>
      )
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center space-x-2 border-3 border-black px-3 py-2 text-sm font-semibold shadow-[2px_2px_0px_0px_black] transition-all duration-100",
              isFree ? "bg-yellow-300 text-black" : "bg-primary text-primary-foreground",
              "cursor-default"
            )}
          >
            <span>{getTag()}</span>
            {loading && <span className="ml-2 animate-pulse text-xs">(refreshing...)</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border-4 border-black shadow-[4px_4px_0px_0px_black] bg-card p-4 w-72"
        >
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base tracking-wide">
                {isPro ? "Pro usage" : "Free mode active"}
              </span>
              <span className="text-xs text-muted-foreground">{timeUntilReset}</span>
            </div>
            {isPro && (
              <div className="relative h-3 w-full border-2 border-black bg-muted">
                <div
                  className="h-full bg-black border-r-2 border-black transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <p className="text-xs font-medium text-foreground">{message}</p>
            {proExhausted && (
              <div className="mt-2 flex items-center space-x-2 bg-yellow-400 text-black text-sm border-2 border-black p-2 shadow-[2px_2px_0px_0px_black]">
                <IconBolt size={16} />
                <span><strong>Pro quota exhausted.</strong> You're now using Free tier.</span>
              </div>
            )}
            {lastUpdated && (
              <div className="text-[11px] text-right text-muted-foreground">
                Updated at {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

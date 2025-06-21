"use client"

import { useContext, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import {
  RateLimitStatus as RateLimitStatusType,
  RateLimitState
} from "@/types/rate-limit"
import { RateLimitService } from "@/lib/services/rate-limit"
import { MayuraContext } from "@/context/context"
import {
  IconRefresh,
  IconAlertTriangle,
  IconBolt,
  IconCheck,
  IconClock
} from "@tabler/icons-react"
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
      console.log(
        "Rate limit refresh triggered, count:",
        rateLimitRefreshTrigger
      )
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
      <div
        className={cn(
          "w-64 rounded-lg border border-slate-700 bg-black p-4 shadow-sm",
          className
        )}
      >
        <div className="flex items-center space-x-3">
          <div className="size-4 animate-pulse rounded bg-slate-700" />
          <div className="h-4 flex-1 animate-pulse rounded bg-slate-700" />
          <div className="h-4 w-12 animate-pulse rounded bg-slate-700" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          "w-64 rounded-lg border border-red-700 bg-red-900/20 p-4 text-red-400",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconAlertTriangle size={20} />
            <span className="text-sm font-medium">Rate limit error</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStatus}
            className="size-8 p-0"
          >
            <IconRefresh size={16} />
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
          <IconCheck size={18} className="text-violet-400" />
          <span className="ml-1">
            {requests_used} / {daily_limit} Pro
          </span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center space-x-2">
          <IconBolt size={18} className="text-yellow-400" />
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
              "inline-flex items-center space-x-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200",
              isFree
                ? "border-yellow-700 bg-yellow-900/20 text-yellow-400"
                : "border-violet-700 bg-violet-900/20 text-violet-400",
              "cursor-default",
              className
            )}
          >
            {compact ? (
              <div className="flex items-center space-x-2">
                {isFree ? (
                  <IconBolt size={16} className="text-yellow-400" />
                ) : (
                  <IconCheck size={16} className="text-violet-400" />
                )}
                <span className="text-xs font-medium">
                  {requests_remaining} left
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  {getTag()}
                </div>
                <div className="text-xs text-slate-400">
                  {requests_remaining} remaining
                </div>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="border border-slate-700 bg-black text-white shadow-lg">
          <div className="space-y-3 p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Daily Usage</span>
              <span className="text-xs text-slate-400">
                {requests_used} / {daily_limit}
              </span>
            </div>
            
            <div className="h-2 w-full rounded-full bg-slate-700">
              <div
                className="h-2 rounded-full bg-white transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                {isPro ? "Pro Plan" : "Free Plan"}
              </span>
              <div className="flex items-center space-x-1 text-slate-400">
                <IconClock size={12} />
                <span>Resets {timeUntilReset}</span>
              </div>
            </div>

            {message && (
              <div className="border-t border-slate-700 pt-2 text-xs text-slate-400">
                {message}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

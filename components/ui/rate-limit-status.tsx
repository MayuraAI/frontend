"use client"

import { useContext, useEffect, useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  RateLimitStatus as RateLimitStatusType,
  RateLimitState
} from "@/types/rate-limit"
import { getRateLimitStatus, RateLimitService } from "@/lib/services/rate-limit"
import { MayuraContext } from "@/context/context"
import {
  IconRefresh,
  IconAlertTriangle,
  IconBolt,
  IconCheck,
  IconClock,
  IconChevronDown,
  IconChevronUp
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useRateLimit } from "@/lib/hooks/use-rate-limit"
import { useAuth } from "@/context/auth-context"
import { isAnonymousUser } from "@/lib/firebase/auth"

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
  const { user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    status: null,
    loading: true,
    error: null,
    lastUpdated: null
  })

  const fetchStatus = useCallback(async () => {
    // Allow fetching for both authenticated and anonymous users
    if (!user) return
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
  }, [user, fetchLatestStatus, onStatusUpdate])

  // Handle click outside to close expanded view
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

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
    if (user && !rateLimitStatus) fetchStatus()
  }, [user, rateLimitStatus, fetchStatus])

  useEffect(() => {
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  // Listen for manual refresh triggers (like after sending messages)
  useEffect(() => {
    if (rateLimitRefreshTrigger > 0) {
      // Add a small delay to allow the backend to process the request
      const timeoutId = setTimeout(() => {
        fetchStatus()
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [rateLimitRefreshTrigger, fetchStatus])

  if (!user) return null

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

  const isMax = current_mode === "max"
  const isFree = current_mode === "free"
  const maxExhausted = isFree && requests_used >= daily_limit
  const progress = isMax ? (requests_used / daily_limit) * 100 : 100
  const timeUntilReset = RateLimitService.getTimeUntilReset(reset_time_unix)

  const getTag = () => {
    const isAnonymous = user && isAnonymousUser()
    
    if (isMax) {
      return (
        <div className="flex items-center space-x-2">
          <IconCheck size={18} className="text-violet-400" />
          <span className="ml-1">
            {requests_used} / {daily_limit} {isAnonymous ? 'Free' : 'Max'}
          </span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center space-x-2">
          <IconBolt size={18} className="text-yellow-400" />
          <span className="ml-1">{isAnonymous ? 'Free trial' : 'Free mode'} active</span>
        </div>
      )
    }
  }

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleToggleExpanded}
        className={cn(
          "inline-flex items-center space-x-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:opacity-80",
          isFree
            ? "border-yellow-700 bg-yellow-900/20 text-yellow-400"
            : "border-violet-700 bg-violet-900/20 text-violet-400",
          "cursor-pointer",
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
              {isFree ? (user && isAnonymousUser() ? "Free trial" : "Free tier") : "Max" + " " + requests_remaining + " left"}
            </span>
            {isExpanded ? (
              <IconChevronUp size={14} className="ml-1" />
            ) : (
              <IconChevronDown size={14} className="ml-1" />
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              {getTag()}
            </div>
            <div className="text-xs text-slate-400">
              {requests_remaining} remaining
            </div>
            {isExpanded ? (
              <IconChevronUp size={14} className="ml-1" />
            ) : (
              <IconChevronDown size={14} className="ml-1" />
            )}
          </>
        )}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-slate-700 bg-black text-white shadow-lg">
          <div className="space-y-3 p-4">
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
                {isMax ? (user && isAnonymousUser() ? "Free Trial" : "Max Plan") : (user && isAnonymousUser() ? "Free Trial" : "Free Plan")}
              </span>
              <div className="flex items-center space-x-1 text-slate-400">
                <IconClock size={12} />
                <span>{timeUntilReset}</span>
              </div>
            </div>

            {message && (
              <div className="border-t border-slate-700 pt-2 text-xs text-slate-400">
                {message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

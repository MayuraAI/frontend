import { useContext, useCallback } from "react"
import { MayuraContext } from "@/context/context"
import { RateLimitService } from "@/lib/services/rate-limit"
import { getIdToken } from "@/lib/firebase/auth"
import { RateLimitStatus } from "@/types/rate-limit"

export function useRateLimit() {
  const { rateLimitStatus, setRateLimitStatus, refreshRateLimit } =
    useContext(MayuraContext)

  const updateFromHeaders = useCallback(
    (headers: Headers) => {
      try {
        const headerData = RateLimitService.parseRateLimitHeaders(headers)

        if (headerData.daily_limit && headerData.daily_limit > 0) {
          // Create updated status from headers
          const updatedStatus: RateLimitStatus = {
            daily_limit: headerData.daily_limit,
            requests_used: headerData.requests_used || 0,
            requests_remaining: headerData.requests_remaining || 0,
            current_mode: headerData.current_mode || "pro",
            reset_time: new Date(
              headerData.reset_time_unix! * 1000
            ).toISOString(),
            reset_time_unix: headerData.reset_time_unix || 0,
            message: headerData.message || ""
          }

          setRateLimitStatus(updatedStatus)
          return updatedStatus
        }
      } catch (error) {
        console.error("Error updating rate limit from headers:", error)
      }
      return null
    },
    [setRateLimitStatus]
  )

  const fetchLatestStatus = useCallback(async () => {
    try {
      const token = await getIdToken()
      if (!token) {
        return null
      }

      const status = await RateLimitService.getRateLimitStatus(token)
      setRateLimitStatus(status)
      return status
    } catch (error) {
      console.error("Error fetching latest rate limit status:", error)
      return null
    }
  }, [setRateLimitStatus])

  const getStatusSummary = useCallback(() => {
    if (!rateLimitStatus) return null

    return {
      isInFreeMode: rateLimitStatus.current_mode === "free",
      requestsRemaining: rateLimitStatus.requests_remaining,
      isRunningLow:
        rateLimitStatus.current_mode === "pro" &&
        rateLimitStatus.requests_remaining <= 2,
      progressPercentage:
        (rateLimitStatus.requests_used / rateLimitStatus.daily_limit) * 100,
      timeUntilReset: RateLimitService.getTimeUntilReset(
        rateLimitStatus.reset_time_unix
      )
    }
  }, [rateLimitStatus])

  return {
    rateLimitStatus,
    updateFromHeaders,
    fetchLatestStatus,
    refreshRateLimit,
    getStatusSummary
  }
}

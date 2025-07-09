import { getIdToken } from "@/lib/firebase/auth"
import { RateLimitStatus } from "@/types/rate-limit"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const getRateLimitStatus = async (): Promise<RateLimitStatus | null> => {
  try {
    const token = await getIdToken()
    if (!token) {
      console.error("No authentication token available for rate limit check")
      return null
    }

    const response = await fetch(`${API_BASE_URL}/v1/rate-limit-status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`Rate limit status request failed: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    
    // Handle null or invalid response from backend
    if (!data || typeof data !== 'object') {
      console.error("Invalid rate limit response from backend:", data)
      return null
    }

    return data as RateLimitStatus
  } catch (error) {
    console.error("Error fetching rate limit status:", error)
    return null
  }
}

export class RateLimitService {
  static parseRateLimitHeaders(headers: Headers): Partial<RateLimitStatus> {
    return {
      daily_limit: parseInt(headers.get("X-RateLimit-Limit") || "0"),
      requests_remaining: parseInt(headers.get("X-RateLimit-Remaining") || "0"),
      requests_used: parseInt(headers.get("X-RateLimit-Used") || "0"),
      current_mode: (headers.get("X-Request-Type") as "max" | "free") || "max",
      reset_time_unix: parseInt(headers.get("X-RateLimit-Reset") || "0"),
      message: headers.get("X-RateLimit-Status") || ""
    }
  }

  static getTimeUntilReset(resetTimeUnix: number): string {
    const now = Date.now() / 1000
    const secondsUntilReset = resetTimeUnix - now

    if (secondsUntilReset <= 0) {
      return "Reset available"
    }

    const hours = Math.floor(secondsUntilReset / 3600)
    const minutes = Math.floor((secondsUntilReset % 3600) / 60)

    if (hours > 0) {
      return `Resets in ${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `Resets in ${minutes}m`
    } else {
      return "Resets soon"
    }
  }

  static getStatusColor(mode: "max" | "free", remaining: number): string {
    if (mode === "free") {
      return "text-orange-600 bg-orange-50 border-orange-200"
    }

    if (remaining <= 2) {
      return "text-yellow-600 bg-yellow-50 border-yellow-200"
    }

    return "text-purple-600 bg-purple-50 border-purple-200"
  }

  static getStatusIcon(mode: "max" | "free", remaining: number): string {
    if (mode === "free") {
      return "⚡"
    }

    if (remaining <= 2) {
      return "⚠️"
    }

    return "✨"
  }
}

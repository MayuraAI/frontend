import { RateLimitStatus } from "@/types/rate-limit"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

export class RateLimitService {
  static async getRateLimitStatus(token: string): Promise<RateLimitStatus> {
    try {
      const response = await fetch(`/api/rate-limit-status`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed")
        }
        throw new Error(`Failed to fetch rate limit status: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching rate limit status:", error)
      throw error
    }
  }

  static parseRateLimitHeaders(headers: Headers): Partial<RateLimitStatus> {
    return {
      daily_limit: parseInt(headers.get("X-RateLimit-Limit") || "0"),
      requests_remaining: parseInt(headers.get("X-RateLimit-Remaining") || "0"),
      requests_used: parseInt(headers.get("X-RateLimit-Used") || "0"),
      current_mode: (headers.get("X-Request-Type") as "pro" | "free") || "pro",
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

  static getStatusColor(mode: "pro" | "free", remaining: number): string {
    if (mode === "free") {
      return "text-orange-600 bg-orange-50 border-orange-200"
    }
    
    if (remaining <= 2) {
      return "text-yellow-600 bg-yellow-50 border-yellow-200"
    }
    
    return "text-green-600 bg-green-50 border-green-200"
  }

  static getStatusIcon(mode: "pro" | "free", remaining: number): string {
    if (mode === "free") {
      return "⚡"
    }
    
    if (remaining <= 2) {
      return "⚠️"
    }
    
    return "✨"
  }
} 
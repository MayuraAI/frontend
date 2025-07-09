export interface RateLimitStatus {
  daily_limit: number
  requests_used: number
  requests_remaining: number
  current_mode: "max" | "free"
  reset_time: string
  reset_time_unix: number
  user_id?: string
  user_email?: string
  message: string
}

export interface RateLimitState {
  status: RateLimitStatus | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

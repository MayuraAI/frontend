export type UserTier = "anonymous" | "free" | "plus" | "pro"

export interface TierLimits {
  freeRequests: number  // -1 means unlimited
  maxRequests: number   // -1 means unlimited
  requestsPerDay: number
  lifetimeLimit: boolean // For anonymous users
  displayName: string
  description: string
}

export const RATE_LIMIT_CONFIG: Record<UserTier, TierLimits> = {
  anonymous: {
    freeRequests: 5,
    maxRequests: 0,
    requestsPerDay: 5,
    lifetimeLimit: true,
    displayName: "Anonymous",
    description: "5 free requests total (lifetime). Sign up to get 100 free requests per day!"
  },
  free: {
    freeRequests: 100,
    maxRequests: 0,
    requestsPerDay: 100,
    lifetimeLimit: false,
    displayName: "Free",
    description: "100 free requests per day. Upgrade to get max requests!"
  },
  plus: {
    freeRequests: -1, // Unlimited
    maxRequests: 50,
    requestsPerDay: 50,
    lifetimeLimit: false,
    displayName: "Plus",
    description: "50 max requests per day + unlimited free requests"
  },
  pro: {
    freeRequests: -1, // Unlimited
    maxRequests: 100,
    requestsPerDay: 100,
    lifetimeLimit: false,
    displayName: "Pro",
    description: "100 max requests per day + unlimited free requests"
  }
}

export function getTierConfig(tier: UserTier): TierLimits {
  return RATE_LIMIT_CONFIG[tier] || RATE_LIMIT_CONFIG.free
}

export function isUnlimited(limit: number): boolean {
  return limit === -1
}

export function getTierDisplayName(tier: UserTier): string {
  return getTierConfig(tier).displayName
}

export function getTierDescription(tier: UserTier): string {
  return getTierConfig(tier).description
} 
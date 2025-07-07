"use client"

import { useAuth } from "@/context/auth-context"
import { isAnonymousUser } from "@/lib/firebase/auth"
import { IconCrown, IconStar, IconBolt, IconLoader2, IconCreditCard, IconCalendar, IconArrowUp } from "@tabler/icons-react"
import { FC, useEffect, useState } from "react"
import { Badge } from "./badge"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"
import { Label } from "./label"
import { Separator } from "./separator"
import { toast } from "sonner"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface SubscriptionData {
  user_id: string
  sub_id?: string
  tier: "free" | "plus" | "pro"
  status: string
  expires_at?: string
  rate_limit: {
    free_requests: number
    max_requests: number
    requests_per_day: number
    daily_reset: boolean
    requests_per_minute: number
  }
  usage?: {
    free_requests_used: number
    max_requests_used: number
    last_reset: string
  }
}

interface SubscriptionBadgeProps {
  compact?: boolean
}

export const SubscriptionBadge: FC<SubscriptionBadgeProps> = ({ compact = false }) => {
  const { user, getToken } = useAuth()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!user || isAnonymousUser()) {
      setLoading(false)
      return
    }

    fetchSubscriptionData()
  }, [user])

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/v1/profile/subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data)
      } else {
        setSubscriptionData({
          user_id: user?.uid || '',
          tier: "free",
          status: "active",
          rate_limit: {
            free_requests: -1,
            max_requests: 5,
            requests_per_day: -1,
            daily_reset: true,
            requests_per_minute: 5
          }
        })
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error)
      setSubscriptionData({
        user_id: user?.uid || '',
        tier: "free",
        status: "active",
        rate_limit: {
          free_requests: -1,
          max_requests: 5,
          requests_per_day: -1,
          daily_reset: true,
          requests_per_minute: 5
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (tier: "plus" | "pro") => {
    if (!user) return

    try {
      setCheckoutLoading(true)
      const token = await getToken()
      if (!token) {
        toast.error("Authentication required")
        return
      }

      // Check if user has existing subscription and is trying to upgrade
      const isUpgrade = subscriptionData?.tier === "plus" && tier === "pro"
      
      if (isUpgrade) {
        // For upgrades, redirect to subscription management portal
        const response = await fetch(`${API_BASE_URL}/v1/subscription/management`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          window.open(data.management_url, '_blank')
          toast.success("Redirecting to subscription management portal for upgrade")
        } else if (response.status === 404) {
          toast.error("No active subscription found. Please upgrade to a paid plan first.")
        } else {
          const errorData = await response.json().catch(() => ({}))
          toast.error(errorData.error || "Failed to get management URL")
        }
      } else {
        // For new subscriptions, create checkout session
        const response = await fetch(`${API_BASE_URL}/v1/subscription/checkout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tier })
        })

        if (response.ok) {
          const data = await response.json()
          window.open(data.checkout_url, '_blank')
        } else {
          const error = await response.json()
          toast.error(error.error || "Failed to create checkout session")
        }
      }
    } catch (error) {
      console.error("Error processing upgrade:", error)
      toast.error("Failed to process upgrade request")
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!user) return

    try {
      const token = await getToken()
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const response = await fetch(`${API_BASE_URL}/v1/subscription/management`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        window.open(data.management_url, '_blank')
      } else if (response.status === 404) {
        toast.error("No active subscription found. Please upgrade to a paid plan first.")
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.error || "Failed to get management URL")
      }
    } catch (error) {
      console.error("Error getting management URL:", error)
      toast.error("Failed to get management URL")
    }
  }

  const getTierIcon = (tier: string, compact: boolean = false) => {
    const iconSize = compact ? 16 : 20
    switch (tier) {
      case "plus":
        return <IconStar size={iconSize} className="text-yellow-500" />
      case "pro":
        return <IconBolt size={iconSize} className="text-purple-500" />
      default:
        return <IconCrown size={iconSize} className="text-gray-500" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "plus":
        return "border-yellow-700 bg-yellow-900/20 text-yellow-400 shadow-yellow-500/20"
      case "pro":
        return "border-purple-700 bg-purple-900/20 text-purple-400 shadow-purple-500/20"
      default:
        return "border-gray-700 bg-gray-900/20 text-gray-400 shadow-gray-500/20"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const formatUsage = (used: number, limit: number) => {
    if (limit === -1) return "Unlimited"
    return `${used}/${limit}`
  }

  // Don't show anything for anonymous users
  if (isAnonymousUser()) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-2">
        <IconLoader2 className="h-4 w-4 animate-spin text-violet-500" />
      </div>
    )
  }

  if (!subscriptionData) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className={`
            inline-flex items-center space-x-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:opacity-80 cursor-pointer
            ${getTierColor(subscriptionData.tier)}
            ${subscriptionData.tier !== 'free' ? 'shadow-lg' : ''}
          `}
          style={{
            boxShadow: subscriptionData.tier !== 'free' 
              ? `0 0 20px ${subscriptionData.tier === 'plus' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(147, 51, 234, 0.3)'}` 
              : undefined
          }}
        >
          <div className="flex items-center space-x-2">
            {getTierIcon(subscriptionData.tier, compact)}
                         <span className={compact ? "text-xs font-medium capitalize" : "text-sm font-medium capitalize"}>
               {compact ? subscriptionData.tier : `${subscriptionData.tier} Plan`}
             </span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <IconCreditCard className="h-5 w-5" />
            Subscription Plan Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan Info */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTierIcon(subscriptionData.tier, false)}
                  <span className="capitalize">{subscriptionData.tier} Plan</span>
                </div>
                <Badge variant="outline" className={`
                  ${subscriptionData.tier === 'plus' ? 'border-yellow-700 bg-yellow-900/20 text-yellow-400' : 
                    subscriptionData.tier === 'pro' ? 'border-purple-700 bg-purple-900/20 text-purple-400' : 
                    'border-gray-700 bg-gray-900/20 text-gray-400'}
                `}>
                  {subscriptionData.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Plan Type</Label>
                  <p className="text-white font-medium capitalize">{subscriptionData.tier}</p>
                </div>
                <div>
                  <Label className="text-slate-300">Status</Label>
                  <p className="text-white font-medium capitalize">{subscriptionData.status}</p>
                </div>
              </div>

              {subscriptionData.expires_at && (
                <div>
                  <Label className="text-slate-300 flex items-center gap-1">
                    <IconCalendar className="h-4 w-4" />
                    Expires On
                  </Label>
                  <p className="text-white font-medium">
                    {formatDate(subscriptionData.expires_at)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Plan Features & Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Standard Requests/day:</span>
                  <span className="text-white font-medium">
                    {subscriptionData.rate_limit?.free_requests === -1 ? "Unlimited" : 
                     `${subscriptionData.rate_limit?.free_requests || 0}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Max Requests/day:</span>
                  <span className="text-white font-medium">
                    {subscriptionData.rate_limit?.max_requests || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-slate-700" />

          {/* Upgrade Options */}
          <div className="space-y-4">
            {subscriptionData.tier === "free" && (
              <div className="space-y-3">
                <Label className="text-white text-lg font-semibold">Upgrade Your Experience</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    onClick={() => handleUpgrade("plus")}
                    disabled={checkoutLoading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
                  >
                    {checkoutLoading ? (
                      <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <IconStar className="h-4 w-4 mr-2" />
                    )}
                    Upgrade to Plus ($10/mo)
                  </Button>
                  <Button
                    onClick={() => handleUpgrade("pro")}
                    disabled={checkoutLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                  >
                    {checkoutLoading ? (
                      <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <IconBolt className="h-4 w-4 mr-2" />
                    )}
                    Upgrade to Pro ($15/mo)
                  </Button>
                </div>
              </div>
            )}

            {subscriptionData.tier === "plus" && (
              <div className="space-y-3">
                <Label className="text-white text-lg font-semibold">Want Even More Power?</Label>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={() => handleUpgrade("pro")}
                    disabled={checkoutLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                  >
                    {checkoutLoading ? (
                      <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <IconArrowUp className="h-4 w-4 mr-2" />
                    )}
                    Upgrade to Pro ($15/mo)
                  </Button>
                  <Button
                    onClick={handleManageSubscription}
                    variant="outline"
                    className="w-full border-slate-600 text-white hover:bg-slate-700"
                  >
                    <IconCreditCard className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </Button>
                </div>
              </div>
            )}

            {subscriptionData.tier === "pro" && (
              <div className="space-y-3">
                <Label className="text-white text-lg font-semibold">Subscription Management</Label>
                <Button
                  onClick={handleManageSubscription}
                  variant="outline"
                  className="w-full border-slate-600 text-white hover:bg-slate-700"
                >
                  <IconCreditCard className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
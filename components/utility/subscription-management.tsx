"use client"

import { useAuth } from "@/context/auth-context"
import { IconCrown, IconLoader2, IconCreditCard, IconStar, IconBolt } from "@tabler/icons-react"
import { FC, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"

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
    pro_requests: number
    requests_per_day: number
    daily_reset: boolean
    requests_per_minute: number
  }
  usage?: {
    free_requests_used: number
    pro_requests_used: number
    last_reset: string
  }
}

interface SubscriptionManagementProps {
  isAnonymous?: boolean
}

export const SubscriptionManagement: FC<SubscriptionManagementProps> = ({ isAnonymous = false }) => {
  const { user, getToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    if (!user || isAnonymous) {
      setLoading(false)
      return
    }

    fetchSubscriptionData()
  }, [user, isAnonymous])

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
        console.error("Failed to fetch subscription data:", response.status)
        // Default to free tier if unable to fetch
        setSubscriptionData({
          user_id: user?.uid || '',
          tier: "free",
          status: "active",
          rate_limit: {
            free_requests: -1,
            pro_requests: 0,
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
          pro_requests: 0,
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
        // Redirect to checkout URL
        window.open(data.checkout_url, '_blank')
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create checkout session")
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast.error("Failed to create checkout session")
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

  // Don't show anything for anonymous users
  if (isAnonymous) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <IconLoader2 className="h-6 w-6 animate-spin text-violet-500" />
      </div>
    )
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "plus":
        return <IconStar className="h-5 w-5 text-yellow-500" />
      case "pro":
        return <IconBolt className="h-5 w-5 text-purple-500" />
      default:
        return <IconCrown className="h-5 w-5 text-gray-500" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "plus":
        return "bg-yellow-500"
      case "pro":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatUsage = (used: number, limit: number) => {
    if (limit === -1) return "Unlimited"
    return `${used}/${limit}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white">Subscription & Billing</Label>
        <Badge className={`${getTierColor(subscriptionData?.tier || "free")} text-white`}>
          {getTierIcon(subscriptionData?.tier || "free")}
          <span className="ml-1 capitalize">{subscriptionData?.tier || "free"}</span>
        </Badge>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <IconCreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Plan</Label>
              <p className="text-white font-medium capitalize">{subscriptionData?.tier || "free"}</p>
            </div>
            <div>
              <Label className="text-slate-300">Status</Label>
              <p className="text-white font-medium capitalize">{subscriptionData?.status || "active"}</p>
            </div>
          </div>

          {subscriptionData?.expires_at && (
            <div>
              <Label className="text-slate-300">Expires</Label>
              <p className="text-white font-medium">
                {new Date(subscriptionData.expires_at).toLocaleDateString()}
              </p>
            </div>
          )}

          <Separator className="bg-slate-700" />

          <div className="space-y-3">
            <Label className="text-slate-300">Usage Limits</Label>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Free Requests:</span>
                <span className="text-white">
                  {subscriptionData?.rate_limit?.free_requests === -1 ? "Unlimited" : 
                   formatUsage(subscriptionData?.usage?.free_requests_used || 0, subscriptionData?.rate_limit?.free_requests || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pro Requests:</span>
                <span className="text-white">
                  {formatUsage(subscriptionData?.usage?.pro_requests_used || 0, subscriptionData?.rate_limit?.pro_requests || 0)}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          <div className="space-y-3">
            {subscriptionData?.tier === "free" && (
              <div className="space-y-2">
                <Label className="text-white">Choose Your Plan</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={() => handleUpgrade("plus")}
                    disabled={checkoutLoading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    {checkoutLoading ? (
                      <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <IconStar className="h-4 w-4 mr-2" />
                    )}
                    Upgrade to Plus
                  </Button>
                  <Button
                    onClick={() => handleUpgrade("pro")}
                    disabled={checkoutLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {checkoutLoading ? (
                      <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <IconBolt className="h-4 w-4 mr-2" />
                    )}
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            )}

            {subscriptionData?.tier === "plus" && (
              <div className="space-y-2">
                <Button
                  onClick={() => handleUpgrade("pro")}
                  disabled={checkoutLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {checkoutLoading ? (
                    <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <IconBolt className="h-4 w-4 mr-2" />
                  )}
                  Upgrade to Pro
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
            )}

            {subscriptionData?.tier === "pro" && (
              <Button
                onClick={handleManageSubscription}
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-700"
              >
                <IconCreditCard className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"

import { useAuth } from "@/context/auth-context"
import { isAnonymousUser } from "@/lib/firebase/auth"
import { IconCrown, IconStar, IconBolt } from "@tabler/icons-react"
import { FC, useEffect, useState } from "react"
import { Badge } from "./badge"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface PlanTagProps {
  compact?: boolean
}

export const PlanTag: FC<PlanTagProps> = ({ compact = false }) => {
  const { user, getToken } = useAuth()
  const [tier, setTier] = useState<string>("free")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || isAnonymousUser()) {
      setTier("free")
      setLoading(false)
      return
    }

    fetchUserTier()
  }, [user])

  const fetchUserTier = async () => {
    try {
      const token = await getToken()
      if (!token) {
        setTier("free")
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
        setTier(data.tier || "free")
      } else {
        setTier("free")
      }
    } catch (error) {
      console.error("Error fetching user tier:", error)
      setTier("free")
    } finally {
      setLoading(false)
    }
  }

  // Don't show anything for anonymous users
  if (isAnonymousUser()) {
    return null
  }

  if (loading) {
    return null // Don't show anything while loading
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "plus":
        return <IconStar className="h-3 w-3 text-yellow-500" />
      case "pro":
        return <IconBolt className="h-3 w-3 text-purple-500" />
      default:
        return <IconCrown className="h-3 w-3 text-gray-500" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "plus":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      case "pro":
        return "bg-purple-500/20 text-purple-500 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30"
    }
  }

  return (
    <Badge 
      variant="outline"
      className={`
        ${getTierColor(tier)} 
        ml-2 flex items-center gap-1 px-2 py-0.5
        ${compact ? 'text-xs' : 'text-xs'}
      `}
    >
      {getTierIcon(tier)}
      <span className="capitalize">{tier}</span>
    </Badge>
  )
} 
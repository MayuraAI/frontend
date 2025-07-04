"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, UserPlus, Zap, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface AnonymousBannerProps {
  requestsRemaining: number
  totalRequests: number
}

export function AnonymousBanner({ requestsRemaining, totalRequests }: AnonymousBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()

  if (!isVisible) return null

  const handleSignUp = () => {
    router.push("/login")
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  return (
    <Card className="mb-4 border-violet-600/20 bg-gradient-to-r from-violet-900/20 to-purple-900/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-violet-600/20 p-2">
              <Zap className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                You have {requestsRemaining} of {totalRequests} free requests remaining
              </p>
              <p className="text-xs text-slate-400">
                Sign up to get 10 pro requests daily + unlimited free requests
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSignUp}
              size="sm"
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
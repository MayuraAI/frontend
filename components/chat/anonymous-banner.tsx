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
  const router = useRouter()

  const handleSignUp = () => {
    router.push("/login")
  }
  const isQuotaExhausted = requestsRemaining <= 0

  return (
    <Card className={`mb-4 border-violet-600/20 shadow-xl backdrop-blur-sm ${isQuotaExhausted ? 'bg-gradient-to-r from-red-900/20 to-orange-900/20' : 'bg-gradient-to-r from-violet-900/20 to-purple-900/20'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`rounded-full p-2 ${isQuotaExhausted ? 'bg-red-600/20' : 'bg-violet-600/20'}`}>
              <Zap className={`size-5 ${isQuotaExhausted ? 'text-red-400' : 'text-violet-400'}`} />
            </div>
            <div>
              {isQuotaExhausted ? (
                <>
                  <p className="text-md font-medium text-white">
                    You&apos;ve used all {totalRequests} requests!
                  </p>
                  <p className="text-md text-slate-400">
                    Sign up now to get unlimited requests for FREE!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-md font-medium text-white">
                    You have {requestsRemaining} of {totalRequests} requests remaining
                  </p>
                  <p className="text-md text-slate-400">
                    Sign up to get unlimited requests for FREE!
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSignUp}
              size="sm"
              className="bg-violet-600 text-white hover:bg-violet-700 shrink-0"
            >
              <UserPlus className="mr-1 size-4 sm:mr-2" />
              <span className="text-xs sm:text-sm">Sign Up</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
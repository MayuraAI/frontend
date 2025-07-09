"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, X, Zap, Star, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface SignupPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignupPromptModal({ isOpen, onClose }: SignupPromptModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    setLoading(true)
    try {
      router.push("/login")
    } catch (error) {
      console.error("Error navigating to signup:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-600/20 p-2">
              <Zap className="size-5 text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-left">You&apos;ve reached your limit!</DialogTitle>
              <DialogDescription className="text-left">
                Sign up to continue using Mayura with more features
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <CheckCircle className="size-4 shrink-0 text-green-400" />
              <span className="text-sm text-slate-200">10 Max requests daily</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="size-4 shrink-0 text-blue-400" />
              <span className="text-sm text-slate-200">Unlimited Standard requests</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="size-4 shrink-0 text-purple-400" />
              <span className="text-sm text-slate-200">Access to premium AI models</span>
            </div>
            <div className="flex items-center gap-3">
              <UserPlus className="size-4 shrink-0 text-violet-400" />
              <span className="text-sm text-slate-200">Save your chat history</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 bg-violet-600 text-white hover:bg-violet-700"
            >
              <UserPlus className="mr-2 size-4" />
              {loading ? "Loading..." : "Sign Up Now"}
            </Button>
          </div>

          <p className="text-center text-xs text-slate-400">
            Free forever • No credit card required
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
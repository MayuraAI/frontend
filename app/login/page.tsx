"use client"
import { useEffect, useState, useContext, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  resetPassword, 
  resendEmailVerification,
  getCurrentUser,
  onAuthStateChange,
  formatAuthError,
  redirectAfterAuth,
  setTokenInCookies
} from "@/lib/firebase/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GoogleSVG } from "@/components/icons/google-svg"
import {
  AlertCircle,
  Zap,
  Mail,
  UserPlus,
  KeyRound,
  CheckCircle,
  RotateCcw
} from "lucide-react"
import posthog from "posthog-js"
import { getProfileByUserId } from "@/db/profile"
import { MayuraContext } from "@/context/context"

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<string | undefined>(undefined)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { setProfile } = useContext(MayuraContext)

  // On mount, check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const user = getCurrentUser()
      if (user) {
        console.log("🔄 User found on login page, redirecting...")
        await redirectAfterAuth(router)
      }
    }
    
    checkAuth()

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        console.log("🔄 Auth state changed, user logged in, redirecting...")
        await redirectAfterAuth(router)
      }
    })

    // Show message from query params if present
    if (searchParams?.get("message")) {
      setMessage(searchParams.get("message")!)
      setMessageType(searchParams.get("type") || undefined)
    }

    return () => unsubscribe()
  }, [router, searchParams])

  // Sign in with email/password
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await signInWithEmail(email, password)
      await setTokenInCookies()
      posthog.capture("sign_in_success")
      await redirectAfterAuth(router)
    } catch (error: any) {
      const errorMessage = formatAuthError(error)
      if (error.code === "auth/invalid-email" || !getCurrentUser()?.emailVerified) {
        setMessage("Please check your email and click the verification link before signing in.")
        setMessageType("info")
      } else {
        setMessage(errorMessage)
        setMessageType("destructive")
      }
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email/password
  const handleSignUp = async () => {
    if (!email || !password) {
      setMessage("Please enter both email and password.")
      setMessageType("destructive")
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await signUpWithEmail(email, password)
      posthog.capture("sign_up_success")
      setMessage("Please check your email and click the verification link to complete your account setup.")
      setMessageType("success")
    } catch (error: any) {
      const errorMessage = formatAuthError(error)
      if (error.code === "auth/email-already-in-use") {
        setMessage("An account with this email already exists. Please sign in instead.")
        setMessageType("existing")
      } else {
        setMessage(errorMessage)
        setMessageType("destructive")
      }
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth
  const handleSignInWithGoogle = async () => {
    setLoading(true)
    setMessage(null)

    try {
      await signInWithGoogle()
      await setTokenInCookies()
      posthog.capture("google_sign_in_success")
      await redirectAfterAuth(router)
    } catch (error: any) {
      setMessage(formatAuthError(error))
      setMessageType("destructive")
    } finally {
      setLoading(false)
    }
  }

  // Password reset
  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Please enter your email address first.")
      setMessageType("destructive")
      return
    }
    
    setLoading(true)
    setMessage(null)
    
    try {
      await resetPassword(email)
      posthog.capture("password_reset_success")
      setMessage("Password reset link has been sent to your email.")
      setMessageType("success")
    } catch (error: any) {
      setMessage(formatAuthError(error))
      setMessageType("destructive")
    } finally {
      setLoading(false)
    }
  }

  // Resend verification email
  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Please enter your email address first.")
      setMessageType("destructive")
      return
    }
    
    setLoading(true)
    setMessage(null)
    
    try {
      await resendEmailVerification()
      posthog.capture("verification_email_resent")
      setMessage("Verification email has been resent. Please check your inbox.")
      setMessageType("success")
    } catch (error: any) {
      setMessage(formatAuthError(error))
      setMessageType("destructive")
    } finally {
      setLoading(false)
    }
  }

  // UI helpers
  const getAlertVariant = (type?: string) => {
    switch (type) {
      case "success":
        return "success" as const
      case "info":
        return "info" as const
      case "warning":
        return "warning" as const
      default:
        return "destructive" as const
    }
  }

  const getAlertIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="size-4 text-green-600" />
      case "info":
        return <AlertCircle className="size-4 text-blue-600" />
      case "warning":
        return <AlertCircle className="size-4 text-yellow-600" />
      default:
        return <AlertCircle className="size-4 text-red-600" />
    }
  }

  const getAlertBgClass = (type?: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-red-50 border-red-200"
    }
  }

  const getAlertTextClass = (type?: string) => {
    switch (type) {
      case "success":
        return "text-green-800"
      case "info":
        return "text-blue-800"
      case "warning":
        return "text-yellow-800"
      default:
        return "text-red-800"
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="size-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Mayura</CardTitle>
          </div>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert className={getAlertBgClass(messageType)}>
              {getAlertIcon(messageType)}
              <AlertDescription className={getAlertTextClass(messageType)}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                type="submit" 
                disabled={loading || !email || !password}
                className="w-full bg-violet-600 text-white hover:bg-violet-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="size-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>

              <Button 
                type="button"
                variant="outline"
                onClick={handleSignUp}
                disabled={loading || !email || !password}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="size-4" />
                    <span>Sign Up</span>
                  </div>
                )}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleSignInWithGoogle}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <GoogleSVG className="size-4" />
                <span>Continue with Google</span>
              </div>
            )}
          </Button>

          <div className="flex flex-col space-y-2 text-center text-sm">
            <Button
              type="button"
              variant="link"
              onClick={handleResetPassword}
              disabled={loading || !email}
              className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"
            >
              <KeyRound className="size-3 mr-1" />
              Forgot your password?
            </Button>

            {messageType === "info" && (
              <Button
                type="button"
                variant="link"
                onClick={handleResendVerification}
                disabled={loading || !email}
                className="p-0 h-auto text-xs text-muted-foreground hover:text-primary"
              >
                <RotateCcw className="size-3 mr-1" />
                Resend verification email
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

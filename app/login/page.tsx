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

  const { setChatMessages, setSelectedChat } = useContext(MayuraContext)

  // On mount, check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const user = getCurrentUser()
      // Only redirect if user is authenticated (not anonymous)
      if (user && !user.isAnonymous) {
        // console.log("🔄 Authenticated user found on login page, redirecting...")
        await redirectAfterAuth(router)
      }
    }
    
    checkAuth()

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (user) => {
      // Only redirect if user is authenticated (not anonymous)
      if (user && !user.isAnonymous) {
        // console.log("🔄 Auth state changed, authenticated user logged in, redirecting...")
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
      if(getCurrentUser()?.emailVerified) {
        setChatMessages([])
        setSelectedChat(null)
        await redirectAfterAuth(router)
      } else {
        setMessage("Please check your email and click the verification link to complete your account setup.")
        setMessageType("info")
      }
    } catch (error: any) {
      const errorMessage = formatAuthError(error)
      // console.log("🚀 Error message:", errorMessage)
      if (error.code === "auth/invalid-email" || !getCurrentUser()?.emailVerified) {
        setMessage(errorMessage)
        setMessageType("info")
      } else if (error.code == "auth/user-not-found" || error.code == "auth/wrong-password" || error.code == "auth/invalid-credential") {
        setMessage(errorMessage)
        setMessageType("destructive")
      }
      else {
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

  // UI helpers
  const getAlertVariant = (type?: string) => {
    switch (type) {
      case "success":
        return "success" as const
      case "info":
        return "info" as const
      case "warning":
        return "warning" as const
      case "existing":
        return "info" as const // Use info variant for existing user messages
      default:
        return "destructive" as const
    }
  }

  const getAlertIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="size-4" />
      case "info":
      case "existing":
        return <AlertCircle className="size-4" />
      case "warning":
        return <AlertCircle className="size-4" />
      default:
        return <AlertCircle className="size-4" />
    }
  }

  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Zap className="text-primary size-6" />
            <CardTitle className="text-2xl font-bold">Mayura</CardTitle>
          </div>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={getAlertVariant(messageType)}>
              {getAlertIcon(messageType)}
              <AlertDescription>
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
                    {/* <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> */}
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
                    {/* <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div> */}
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
              <span className="bg-background text-muted-foreground px-2">
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
                {/* <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div> */}
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
              className="text-muted-foreground hover:text-primary h-auto p-0 text-xs"
            >
              <KeyRound className="mr-1 size-3" />
              Forgot your password?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

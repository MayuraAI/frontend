"use client"
import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/browser-client"
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

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<string | undefined>(undefined)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // On mount, check if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("Supabase session:", data.session)
      if (data.session) {
        router.replace("/chat")
      }
    })
    // Show message from query params if present
    if (searchParams?.get("message")) {
      setMessage(searchParams.get("message")!)
      setMessageType(searchParams.get("type") || undefined)
    }
  }, [router, searchParams])

  // Sign in with email/password
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setMessage("Please check your email and click the verification link before signing in.")
        setMessageType("info")
      } else if (error.message.includes("Invalid login credentials")) {
        setMessage("Invalid email or password. Please check your credentials and try again.")
        setMessageType("destructive")
      } else {
        setMessage(error.message)
        setMessageType("destructive")
      }
    } else {
      router.replace("/chat")
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

    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setMessage("An account with this email already exists. Please sign in instead.")
      setMessageType("existing")
      return
    }
    if (error) {
      if (error.message.includes("already registered") || error.message.includes("email_exists")) {
        setMessage("An account with this email already exists. Please sign in instead.")
        setMessageType("existing")
      } else if (error.message.includes("weak_password")) {
        setMessage("Password is too weak. Please choose a stronger password.")
        setMessageType("destructive")
      } else {
        setMessage(error.message)
        setMessageType("destructive")
      }
      return
    }
    setMessage("Please check your email and click the verification link to complete your account setup.")
    setMessageType("success")
  }

  // Google OAuth
  const signInWithGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` }
    })
    setLoading(false)
    if (error) {
      setMessage(error.message)
      setMessageType("destructive")
    }
    // On success, user will be redirected to Google and back to /login
    // useEffect will check session and redirect to /chat
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
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/password`
    })
    setLoading(false)
    if (error) {
      setMessage(error.message)
      setMessageType("destructive")
    } else {
      setMessage("Password reset link has been sent to your email.")
      setMessageType("success")
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
    
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/setup` }
    })
    setLoading(false)
    if (error) {
      setMessage(error.message)
      setMessageType("destructive")
    } else {
      setMessage("Verification email has been resent. Please check your inbox.")
      setMessageType("success")
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
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "info":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }
  const getAlertBgClass = (type?: string) => {
    switch (type) {
      case "success":
        return "bg-green-900/40 border-green-700"
      case "info":
        return "bg-blue-900/40 border-blue-700"
      case "warning":
        return "bg-yellow-900/40 border-yellow-700"
      default:
        return "bg-red-900/40 border-red-700"
    }
  }
  const getAlertTextClass = (type?: string) => {
    switch (type) {
      case "success":
        return "text-green-200"
      case "info":
        return "text-blue-200"
      case "warning":
        return "text-yellow-200"
      default:
        return "text-red-200"
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl shadow-primary/10">
          <CardHeader className="flex flex-col items-center justify-center text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Mayura
            </CardTitle>
            <CardDescription className="pt-1">
              Welcome back! Sign in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 px-8 py-6">
            {message && (
              <Alert variant={getAlertVariant(messageType)} className={`mb-4 ${getAlertBgClass(messageType)} ${getAlertTextClass(messageType)} border`}>
                {getAlertIcon(messageType)}
                <AlertDescription className={`text-sm ${getAlertTextClass(messageType)}`}>
                  {message}
                  {messageType === "info" && message.includes("verification") && (
                    <div className="mt-3">
                      <Button
                        onClick={handleResendVerification}
                        variant="outline"
                        size="sm"
                        className="w-full border-blue-700 text-blue-200 hover:bg-blue-800/40"
                        disabled={loading}
                      >
                        <RotateCcw className="mr-2 h-3 w-3" />
                        Resend Verification Email
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleSignIn} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleResetPassword}
                  variant="link"
                  size="sm"
                  className="h-auto self-end p-0 font-normal text-muted-foreground"
                  disabled={loading}
                >
                  Forgot Password?
                </Button>
              </div>
              <div className="grid gap-3 pt-2">
                <Button type="submit" className="w-full font-semibold" size="lg" disabled={loading}>
                  <Zap className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  type="button"
                  onClick={handleSignUp}
                  variant="outline"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </Button>
              </div>
            </form>

            {/* "Or" Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button
              onClick={signInWithGoogle}
              variant="outline"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              <GoogleSVG className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
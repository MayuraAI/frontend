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
import { createClient } from "@/lib/supabase/server"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { get } from "@vercel/edge-config"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import {
  AlertCircle,
  Zap,
  Mail,
  UserPlus,
  KeyRound,
  CheckCircle,
  RotateCcw
} from "lucide-react"

export const metadata: Metadata = {
  title: "Login - Mayura"
}

export default async function Login({
  searchParams
}: {
  searchParams: { message: string; type?: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
  const session = (await supabase.auth.getSession()).data.session

  if (session) {
    return redirect(`/chat`)
  }

  const signIn = async (formData: FormData) => {
    "use server"
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      // Handle specific error cases with better messaging
      if (error.message.includes("Email not confirmed")) {
        return redirect(`/login?message=Please check your email and click the verification link before signing in.&type=info`)
      }
      if (error.message.includes("Invalid login credentials")) {
        return redirect(`/login?message=Invalid email or password. Please check your credentials and try again.`)
      }
      return redirect(`/login?message=${error.message}`)
    }
    return redirect(`/chat`)
  }

  const getEnvVarOrEdgeConfigValue = async (name: string) => {
    "use server"
    if (process.env.EDGE_CONFIG) {
      return await get<string>(name)
    }
    return process.env[name]
  }

  const signUp = async (formData: FormData) => {
    "use server"
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Check if email verification is enabled
    const enableEmailConfirmation = true
    const origin = headers().get("origin")

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password, 
      // options: enableEmailConfirmation ? {
      //   emailRedirectTo: `${origin}/auth/callback?next=/setup`
      // } : {}
      options: {}
    })

    // Supabase workaround: if data.user exists and identities is empty, email is taken
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return redirect(`/login?message=An account with this email already exists. Please sign in instead.&type=existing`)
    }

    if (error) {
      if (error.message.includes("User already registered")) {
        return redirect(`/login?message=An account with this email already exists. Please sign in instead.&type=existing`)
      }
      if (error.message.includes("email_exists") || error.message.includes("already registered")) {
        return redirect(`/login?message=An account with this email already exists. Please sign in instead.&type=existing`)
      }
      if (error.message.includes("weak_password")) {
        return redirect(`/login?message=Password is too weak. Please choose a stronger password.`)
      }
      
      return redirect(`/login?message=${error.message}`)
    }

    const session = (await supabase.auth.signInWithPassword({
      email,
      password
    })).data.session
    if (session) {
      return redirect("/chat")
    } else {
      if (enableEmailConfirmation) {
        return redirect("/login?message=Please check your email and click the verification link to complete your account setup.&type=success")
      }
      return redirect("/login?message=Account created successfully! Please sign in to continue.&type=success")
    }
  }

  const signInWithGoogle = async () => {
    "use server"
    const origin = headers().get("origin")
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback?next=/chat` }
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }
    if (data.url) {
      return redirect(data.url)
    }
  }

  const handleResetPassword = async (formData: FormData) => {
    "use server"
    const origin = headers().get("origin")
    const email = formData.get("email") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    if (!email) {
      return redirect(`/login?message=Please enter your email address first.`)
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/login/password`
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }
    return redirect("/login?message=Password reset link has been sent to your email.&type=success")
  }

  const resendVerification = async (formData: FormData) => {
    "use server"
    const email = formData.get("email") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const origin = headers().get("origin")

    if (!email) {
      return redirect(`/login?message=Please enter your email address first.`)
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/setup`
      }
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }
    return redirect("/login?message=Verification email has been resent. Please check your inbox.&type=success")
  }

  // Determine alert variant based on message type
  const getAlertVariant = (type?: string) => {
    switch (type) {
      case 'success':
        return 'success' as const
      case 'info':
        return 'info' as const
      case 'warning':
        return 'warning' as const
      default:
        return 'destructive' as const
    }
  }

  const getAlertIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'info':
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  // Helper to get custom background class for each alert type (dark mode)
  const getAlertBgClass = (type?: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/40 border-green-700'
      case 'info':
        return 'bg-blue-900/40 border-blue-700'
      case 'warning':
        return 'bg-yellow-900/40 border-yellow-700'
      default:
        return 'bg-red-900/40 border-red-700'
    }
  }

  // Helper to get custom text color for each alert type (dark mode)
  const getAlertTextClass = (type?: string) => {
    switch (type) {
      case 'success':
        return 'text-green-200'
      case 'info':
        return 'text-blue-200'
      case 'warning':
        return 'text-yellow-200'
      default:
        return 'text-red-200'
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
            {/* Display messages */}
            {searchParams?.message && (
              <Alert variant={getAlertVariant(searchParams.type)} className={`mb-4 ${getAlertBgClass(searchParams.type)} ${getAlertTextClass(searchParams.type)} border`}>
                {getAlertIcon(searchParams.type)}
                <AlertDescription className={`text-sm ${getAlertTextClass(searchParams.type)}`}>
                  {searchParams.message}
                  {/* Show resend verification button for email confirmation messages */}
                  {searchParams.type === 'info' && searchParams.message.includes('verification') && (
                    <form action={resendVerification} className="mt-3">
                      <input type="hidden" name="email" />
                      <Button 
                        type="submit" 
                        variant="outline" 
                        size="sm"
                        className="w-full border-blue-700 text-blue-200 hover:bg-blue-800/40"
                      >
                        <RotateCcw className="mr-2 h-3 w-3" />
                        Resend Verification Email
                      </Button>
                    </form>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Email & Password Form */}
            <form action={signIn} className="grid gap-4">
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
                  />
                </div>
                <Button
                  formAction={handleResetPassword}
                  type="submit"
                  variant="link"
                  size="sm"
                  className="h-auto self-end p-0 font-normal text-muted-foreground"
                >
                  Forgot Password?
                </Button>
              </div>

              <div className="grid gap-3 pt-2">
                <Button type="submit" className="w-full font-semibold" size="lg">
                  <Zap className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  formAction={signUp}
                  variant="outline"
                  className="w-full"
                  size="lg"
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

            {/* Google Sign In Form */}
            <form action={signInWithGoogle}>
              <Button type="submit" variant="outline" className="w-full" size="lg">
                <GoogleSVG className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
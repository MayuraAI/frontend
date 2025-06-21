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
import { Badge } from "@/components/ui/badge"
import { GoogleSVG } from "@/components/icons/google-svg"
import { createClient } from "@/lib/supabase/server"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { get } from "@vercel/edge-config"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { AlertCircle, Zap, Lock, Mail, UserPlus, KeyRound } from "lucide-react"

export const metadata: Metadata = {
  title: "Login - Mayura" // Updated title
}

export default async function Login({
  searchParams
}: {
  searchParams: { message: string }
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    // Get the session after sign in
    const {
      data: { session }
    } = await supabase.auth.getSession()
    if (!session) {
      return redirect(`/login?message=Failed to establish session`)
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

    const emailDomainWhitelistPatternsString = await getEnvVarOrEdgeConfigValue(
      "EMAIL_DOMAIN_WHITELIST"
    )
    const emailDomainWhitelist = emailDomainWhitelistPatternsString?.trim()
      ? emailDomainWhitelistPatternsString?.split(",")
      : []
    const emailWhitelistPatternsString =
      await getEnvVarOrEdgeConfigValue("EMAIL_WHITELIST")
    const emailWhitelist = emailWhitelistPatternsString?.trim()
      ? emailWhitelistPatternsString?.split(",")
      : []

    // If there are whitelist patterns, check if the email is allowed to sign up
    if (emailDomainWhitelist.length > 0 || emailWhitelist.length > 0) {
      const domainMatch = emailDomainWhitelist?.includes(email.split("@")[1])
      const emailMatch = emailWhitelist?.includes(email)
      if (!domainMatch && !emailMatch) {
        return redirect(
          `/login?message=Email ${email} is not allowed to sign up.`
        )
      }
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
        // emailRedirectTo: `${origin}/auth/callback`
      }
    })

    if (error) {
      console.error(error)
      return redirect(`/login?message=${error.message}`)
    }

    return redirect("/setup")

    // USE IF YOU WANT TO SEND EMAIL VERIFICATION, ALSO CHANGE TOML FILE
    // return redirect("/login?message=Check email to continue sign in process")
  }

  const signInWithGoogle = async () => {
    "use server"

    const origin = headers().get("origin")
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=/chat`
      }
    })

    if (error) {
      console.error("Google sign-in error:", error)
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

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/login/password`
    })

    if (error) {
      return redirect(`/login?message=${error.message}`)
    }

    return redirect("/login?message=Check email to reset password")
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4">
      {/* Removed Decorative Background Elements for consistency with Mayura homepage */}

      <div className="z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Badge variant="default" className="bg-violet-600 px-4 py-2 text-lg text-white">
            {" "}
            {/* Changed badge variant */}
            Mayura
          </Badge>
        </div>

        <Card className="border-slate-200 bg-white shadow-lg">
          {" "}
          {/* Adjusted shadow */}
          {/* <CardHeader className="space-y-3 pb-6 text-center">
            <CardContent className="flex items-center justify-center gap-3 text-3xl font-bold text-zinc-800">
              <Lock className="size-8 text-primary" />
              Sign in to Mayura AI
            </CardContent>
          </CardHeader> */}
          <CardContent className="space-y-6 pt-6">
            <form className="space-y-6" action={signIn}>
              <div className="space-y-2">
                {" "}
                {/* Simplified form group styling */}
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-slate-700"
                >
                  {" "}
                  {/* Adjusted label color */}
                  <Mail className="size-5" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="w-full border-slate-200 bg-white text-slate-800 focus-visible:ring-violet-500" // Consistent border/focus
                />
              </div>

              <div className="space-y-2">
                {" "}
                {/* Simplified form group styling */}
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 text-slate-700"
                >
                  {" "}
                  {/* Adjusted label color */}
                  <KeyRound className="size-5" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full border-slate-200 bg-white text-slate-800 focus-visible:ring-violet-500" // Consistent border/focus
                />
              </div>

              <div className="space-y-4">
                <Button type="submit" className="w-full bg-violet-600 text-white hover:bg-violet-700" size="lg">
                  {" "}
                  {/* Default button variant */}
                  <Zap className="mr-2 size-5" />
                  Sign In
                </Button>

                <Button
                  type="submit"
                  variant="outline" // Outline variant for secondary action
                  size="lg"
                  className="w-full border-slate-200 text-slate-800 hover:bg-slate-50"
                  formAction={signUp}
                >
                  <UserPlus className="mr-2 size-5" />
                  Create Account
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  formAction={handleResetPassword}
                  className="rounded-md px-4 py-2 text-violet-600 transition-colors duration-200 hover:bg-violet-600 hover:text-white" // Styled to match link buttons
                >
                  Forgot Password?
                </button>
              </div>

              {searchParams?.message && (
                <Alert variant="destructive" className="mt-6 border-red-200 bg-red-50 text-red-800">
                  <AlertCircle className="size-6" />
                  <AlertDescription className="text-base">
                    {" "}
                    {/* Adjusted font size */}
                    {searchParams.message}
                  </AlertDescription>
                </Alert>
              )}
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-600">
                  Or continue with
                </span>
              </div>
            </div>

            <form action={signInWithGoogle}>
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="w-full border-slate-200 text-slate-800 hover:bg-slate-50"
              >
                <GoogleSVG width={20} height={20} className="mr-2" />
                Sign in with Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

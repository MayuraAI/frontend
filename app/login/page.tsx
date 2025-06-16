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
import { createClient } from "@/lib/supabase/server"
import { getServerHomeWorkspace } from "@/lib/server/workspaces"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { get } from "@vercel/edge-config"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { AlertCircle, Zap, Lock, Mail, UserPlus, KeyRound } from "lucide-react"

export const metadata: Metadata = {
  title: "Login - BRUTAL ACCESS"
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
    const homeWorkspace = await getServerHomeWorkspace(session.user.id)
    return redirect(`/${homeWorkspace.id}/chat`)
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

    const homeWorkspace = await getServerHomeWorkspace(session.user.id)
    return redirect(`/${homeWorkspace.id}/chat`)
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
    <div className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute left-20 top-20 rotate-12 opacity-20">
        <div className="bg-neo-electric shadow-neo size-32 border-4 border-black"></div>
      </div>
      <div className="pointer-events-none absolute bottom-20 right-20 -rotate-12 opacity-20">
        <div className="bg-neo-neon shadow-neo size-24 border-4 border-black"></div>
      </div>
      <div className="pointer-events-none absolute left-10 top-1/2 rotate-45 opacity-15">
        <div className="bg-neo-cyber shadow-neo size-20 border-4 border-black"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-brutal text-shadow-neo rotate-slight mb-4 text-5xl font-black">
            BRUTAL ACCESS
          </h1>
          <Badge variant="electric" className="rotate-slight-reverse px-4 py-2 text-lg">
            <Zap className="mr-2 size-5" />
            POWER UP
          </Badge>
        </div>

        <Card className="rotate-slight-reverse shadow-neo-lg">
          <CardHeader className="space-y-3 pb-6 text-center">
            <CardTitle className="font-brutal flex items-center justify-center gap-3 text-3xl font-black">
              <Lock className="size-8" />
              ENTER THE ZONE
            </CardTitle>
            <CardDescription className="text-lg font-bold">
              Sign in to unleash brutal AI intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6" action={signIn}>
              <div className="neo-form-group">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="size-5" />
                  EMAIL ADDRESS
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="w-full"
                />
              </div>

              <div className="neo-form-group">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <KeyRound className="size-5" />
                  PASSWORD
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <Button type="submit" className="w-full" size="lg" variant="electric">
                  <Zap className="mr-2 size-5" />
                  SIGN IN NOW
                </Button>

                <Button
                  type="submit"
                  variant="neon"
                  size="lg"
                  className="w-full"
                  formAction={signUp}
                >
                  <UserPlus className="mr-2 size-5" />
                  CREATE ACCOUNT
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  formAction={handleResetPassword}
                  className="text-primary hover:bg-primary hover:text-primary-foreground shadow-neo-sm hover:shadow-neo border-2 border-transparent px-4 py-2 text-lg font-black transition-all duration-100 hover:border-black"
                >
                  FORGOT PASSWORD?
                </button>
              </div>

              {searchParams?.message && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="size-6" />
                  <AlertDescription className="text-lg font-black">
                    {searchParams.message}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <div className="bg-neo-warning shadow-neo rotate-slight border-4 border-black p-4">
            <p className="text-lg font-black">
              Ready to experience BRUTAL efficiency? 
              <br />
              <span className="text-2xl">⚡ POWER UP NOW ⚡</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

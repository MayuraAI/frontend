import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}

export async function requireCompleteProfile() {
  const session = await requireAuth()
  const user = session.user

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // If no profile exists or user hasn't completed onboarding
  if (error && error.code === "PGRST116") {
    redirect("/setup")
  }

  if (profile && !profile.has_onboarded) {
    redirect("/setup")
  }

  return { session, profile }
}

export async function getProfileStatus() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
      return { isAuthenticated: false, hasProfile: false, hasOnboarded: false }
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single()

    if (error && error.code === "PGRST116") {
      return { isAuthenticated: true, hasProfile: false, hasOnboarded: false }
    }

    return {
      isAuthenticated: true,
      hasProfile: !!profile,
      hasOnboarded: profile?.has_onboarded || false,
      profile
    }
  } catch (error) {
    console.error("Error checking profile status:", error)
    return { isAuthenticated: false, hasProfile: false, hasOnboarded: false }
  }
}

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Auth callback error:", error)
      return NextResponse.redirect(
        requestUrl.origin + `/login?message=${error.message}`
      )
    }

    // Get the user after successful authentication
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting user:", userError)
      return NextResponse.redirect(
        requestUrl.origin + `/login?message=Authentication failed`
      )
    }

    try {
      // Check if user has a profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileError && profileError.code === "PGRST116") {
        // Generate a unique username
        const baseUsername = `user_${user.id.slice(0, 8)}`
        let finalUsername = baseUsername
        let counter = 0

        // Ensure username is unique
        while (counter < 100) {
          const { data: existingUser } = await supabase
            .from("profiles")
            .select("username")
            .eq("username", finalUsername)
            .single()

          if (!existingUser) break

          counter++
          finalUsername = `${baseUsername}_${counter}`
        }

        // Get user's display name from OAuth provider metadata or email
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          user.email?.split("@")[0] ||
          "New User"

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            username: finalUsername,
            display_name: displayName.substring(0, 100), // Ensure it fits
            profile_context: "Welcome to Mayura!",
            has_onboarded: false
          })
          .select("*")
          .single()

        if (createError) {
          console.error("Error creating profile:", createError)
          // Instead of failing, let's try with even simpler data
          const { error: fallbackError } = await supabase
            .from("profiles")
            .insert({
              user_id: user.id,
              username: `user${Date.now()}`, // Use timestamp for uniqueness
              display_name: "User",
              profile_context: "New user",
              has_onboarded: false
            })

          if (fallbackError) {
            console.error(
              "Fallback profile creation also failed:",
              fallbackError
            )
            return NextResponse.redirect(
              requestUrl.origin +
                `/login?message=Failed to create user profile. Please try again.`
            )
          }
        }
        // New user - redirect to setup
        return NextResponse.redirect(requestUrl.origin + "/setup")
      } else if (profileError) {
        console.error("Error fetching profile:", profileError)
        return NextResponse.redirect(
          requestUrl.origin + `/login?message=Profile access error`
        )
      }

      // Profile exists - check if user has completed onboarding
      if (!profile.has_onboarded) {
        return NextResponse.redirect(requestUrl.origin + "/setup")
      }
    } catch (error) {
      console.error("Unexpected error in auth callback:", error)
      return NextResponse.redirect(
        requestUrl.origin + `/login?message=Authentication error`
      )
    }
  }

  // Redirect to specified next URL or default to chat
  if (next) {
    return NextResponse.redirect(requestUrl.origin + next)
  } else {
    return NextResponse.redirect(requestUrl.origin + "/chat")
  }
}

import { getCurrentUser, getIdToken } from "@/lib/firebase/auth"
import { redirect } from "next/navigation"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function requireAuth() {
  const user = getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function requireCompleteProfile() {
  const user = await requireAuth()
  
  try {
    const token = await getIdToken()
    if (!token) {
      redirect("/login")
    }

    // Call our backend API to get profile
    const response = await fetch(`${API_BASE_URL}/v1/profiles/user/${user.uid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        redirect("/setup")
      }
      throw new Error(`Failed to fetch profile: ${response.statusText}`)
    }

    const profile = await response.json()

    // If profile exists but user hasn't completed onboarding
    if (profile && !profile.has_onboarded) {
      redirect("/setup")
    }

    return { user, profile }
  } catch (error) {
    console.error("Error checking profile:", error)
    redirect("/setup")
  }
}

export async function getProfileStatus() {
  try {
    const user = getCurrentUser()

    if (!user) {
      return { isAuthenticated: false, hasProfile: false, hasOnboarded: false }
    }

    const token = await getIdToken()
    if (!token) {
      return { isAuthenticated: false, hasProfile: false, hasOnboarded: false }
    }

    try {
      // Call our backend API to get profile
      const response = await fetch(`${API_BASE_URL}/v1/profiles/user/${user.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          return { isAuthenticated: true, hasProfile: false, hasOnboarded: false }
        }
        throw new Error(`Failed to fetch profile: ${response.statusText}`)
      }

      const profile = await response.json()

      return {
        isAuthenticated: true,
        hasProfile: !!profile,
        hasOnboarded: profile?.has_onboarded || false,
        profile
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      return { isAuthenticated: true, hasProfile: false, hasOnboarded: false }
    }
  } catch (error) {
    console.error("Error checking profile status:", error)
    return { isAuthenticated: false, hasProfile: false, hasOnboarded: false }
  }
}

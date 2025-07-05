"use client"

import { getCurrentUser, onAuthStateChange, getIdToken } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface ProfileStatus {
  isAuthenticated: boolean
  hasProfile: boolean
  hasOnboarded: boolean
  loading: boolean
  profile?: any
}

export function useProfileStatus(): ProfileStatus {
  const router = useRouter()
  const [status, setStatus] = useState<ProfileStatus>({
    isAuthenticated: false,
    hasProfile: false,
    hasOnboarded: false,
    loading: true
  })

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const user = getCurrentUser()

        if (!user) {
          setStatus({
            isAuthenticated: false,
            hasProfile: false,
            hasOnboarded: false,
            loading: false
          })
          return
        }

        const token = await getIdToken()
        if (!token) {
          setStatus({
            isAuthenticated: false,
            hasProfile: false,
            hasOnboarded: false,
            loading: false
          })
          return
        }

        try {
          // Call our backend API to get profile using the new route structure
          const response = await fetch(`${API_BASE_URL}/v1/profiles/by-user-id/${user.uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            if (response.status === 404) {
              // No profile exists
              setStatus({
                isAuthenticated: true,
                hasProfile: false,
                hasOnboarded: false,
                loading: false
              })
              return
            }
            throw new Error(`Failed to fetch profile: ${response.statusText}`)
          }

          const profile = await response.json()

          setStatus({
            isAuthenticated: true,
            hasProfile: !!profile,
            hasOnboarded: profile?.has_onboarded || false,
            loading: false,
            profile
          })
        } catch (error) {
          console.error("Error fetching profile:", error)
          setStatus({
            isAuthenticated: true,
            hasProfile: false,
            hasOnboarded: false,
            loading: false
          })
        }
      } catch (error) {
        console.error("Error checking profile status:", error)
        setStatus({
          isAuthenticated: false,
          hasProfile: false,
          hasOnboarded: false,
          loading: false
        })
      }
    }

    checkProfileStatus()

    // Listen for auth changes
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        checkProfileStatus()
      } else {
        setStatus({
          isAuthenticated: false,
          hasProfile: false,
          hasOnboarded: false,
          loading: false
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return status
}

export function useRequireCompleteProfile() {
  const router = useRouter()
  const status = useProfileStatus()

  useEffect(() => {
    if (!status.loading && status.isAuthenticated && getCurrentUser()?.emailVerified) {
      if (!status.hasProfile || !status.hasOnboarded) {
        console.log("🚀 Redirecting to setup user profile")
        router.push("/setup")
      }
    }
  }, [status, router])

  return status
}

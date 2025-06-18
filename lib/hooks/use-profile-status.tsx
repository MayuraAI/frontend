"use client"

import { supabase } from "@/lib/supabase/browser-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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
        const {
          data: { session }
        } = await supabase.auth.getSession()

        if (!session) {
          setStatus({
            isAuthenticated: false,
            hasProfile: false,
            hasOnboarded: false,
            loading: false
          })
          return
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (error && error.code === "PGRST116") {
          // No profile exists
          setStatus({
            isAuthenticated: true,
            hasProfile: false,
            hasOnboarded: false,
            loading: false
          })
          return
        }

        setStatus({
          isAuthenticated: true,
          hasProfile: !!profile,
          hasOnboarded: profile?.has_onboarded || false,
          loading: false,
          profile
        })
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
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED"
      ) {
        checkProfileStatus()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return status
}

export function useRequireCompleteProfile() {
  const router = useRouter()
  const status = useProfileStatus()

  useEffect(() => {
    if (!status.loading && status.isAuthenticated) {
      if (!status.hasProfile || !status.hasOnboarded) {
        router.push("/setup")
      }
    }
  }, [status, router])

  return status
}

"use client"

import { MayuraContext } from "@/context/context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { FinishStep } from "../../components/setup/finish-step"
import { ProfileStep } from "../../components/setup/profile-step"
import {
  SETUP_STEP_COUNT,
  StepContainer
} from "../../components/setup/step-container"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export default function SetupPage() {
  const { profile, setProfile } = useContext(MayuraContext)
  const { user, loading: authLoading, getToken } = useAuth()

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)

  const [username, setUsername] = useState("")
  const [usernameAvailable, setUsernameAvailable] = useState(false)
  const [displayName, setDisplayName] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        if (authLoading) return

        if (!user) {
          return router.push("/login")
        }

        // Anonymous users don't need setup - redirect to chat
        if (user.isAnonymous) {
          // console.log("👤 Anonymous user accessing setup page, redirecting to chat")
          return router.push("/chat")
        }

        const token = await getToken()
        if (!token) {
          return router.push("/login")
        }

        try {
          // Get profile from backend
          const response = await fetch(`${API_BASE_URL}/v1/profiles/by-user-id/${user.uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            if (response.status === 404) {
              // No profile exists, create one
              const displayName = user.displayName || 
                                 user.email?.split("@")[0] || 
                                 "New User"
              
              const createResponse = await fetch(`${API_BASE_URL}/v1/profiles`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  user_id: user.uid,
                  username: `user_${user.uid.slice(0, 8)}`,
                  display_name: displayName,
                  profile_context: "Welcome to Mayura!",
                  has_onboarded: false
                })
              })

              if (!createResponse.ok) {
                throw new Error(`Failed to create profile: ${createResponse.statusText}`)
              }

              const newProfile = await createResponse.json()
              setProfile(newProfile)
              setUsername(newProfile.username || "")
              setDisplayName(newProfile.display_name || "")
              setUsernameAvailable(true)
              setLoading(false)
              return
            }
            throw new Error(`Failed to fetch profile: ${response.statusText}`)
          }

          const existingProfile = await response.json()
          setProfile(existingProfile)
          setUsername(existingProfile.username || "")
          setDisplayName(existingProfile.display_name || "")

          if (existingProfile.username) {
            setUsernameAvailable(true)
          }

          if (existingProfile.has_onboarded) {
            return router.push("/chat")
          }

          setLoading(false)
        } catch (error) {
          console.error("Error fetching/creating profile:", error)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error in setup page:", error)
        setLoading(false)
      }
    })()
  }, [user, authLoading, router, setProfile, getToken])

  const handleShouldProceed = (proceed: boolean) => {
    if (proceed) {
      if (currentStep === SETUP_STEP_COUNT) {
        handleSaveSetupSetting()
      } else {
        setCurrentStep(currentStep + 1)
      }
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveSetupSetting = async () => {
    if (!profile || !user) return

    try {
      const token = await getToken()
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${API_BASE_URL}/v1/profiles/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...profile,
          username,
          display_name: displayName,
          has_onboarded: true
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`)
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)

      router.push("/chat")
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const renderStep = (stepNum: number) => {
    switch (stepNum) {
      // Profile Step
      case 1:
        return (
          <StepContainer
            stepDescription="Let's create your profile."
            stepNum={currentStep}
            stepTitle="Welcome to Mayura"
            onShouldProceed={handleShouldProceed}
            showNextButton={!!(username && usernameAvailable)}
            showBackButton={false}
          >
            <ProfileStep
              username={username}
              usernameAvailable={usernameAvailable}
              displayName={displayName}
              currentUserId={user?.uid || ""}
              onUsernameAvailableChange={setUsernameAvailable}
              onUsernameChange={setUsername}
              onDisplayNameChange={setDisplayName}
            />
          </StepContainer>
        )

      // Finish Step
      case 2:
        return (
          <StepContainer
            stepDescription="You are all set up!"
            stepNum={currentStep}
            stepTitle="Setup Complete"
            onShouldProceed={handleShouldProceed}
            showNextButton={true}
            showBackButton={true}
          >
            <FinishStep displayName={displayName} />
          </StepContainer>
        )
      default:
        return null
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-bold text-white">Loading...</div>
          <div className="size-8 animate-spin rounded-full border-y-2 border-violet-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="center-setup-step">
      {renderStep(currentStep)}
    </div>
  )
}

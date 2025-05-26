"use client"

import { ChatbotUIContext } from "@/context/context"
import { getProfileByUserId, updateProfile } from "@/db/profile"
import { getHomeWorkspaceByUserId } from "@/db/workspaces"
import { supabase } from "@/lib/supabase/browser-client"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { FinishStep } from "../../components/setup/finish-step"
import { ProfileStep } from "../../components/setup/profile-step"
import {
  SETUP_STEP_COUNT,
  StepContainer
} from "../../components/setup/step-container"

export default function SetupPage() {
  const { profile, setProfile } = useContext(ChatbotUIContext)

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)

  const [username, setUsername] = useState("")
  const [usernameAvailable, setUsernameAvailable] = useState(false)
  const [displayName, setDisplayName] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const session = (await supabase.auth.getSession()).data.session

        if (!session) {
          return router.push("/login")
        }

        const user = session.user
        const profile = await getProfileByUserId(user.id)

        if (!profile) {
          console.error("Profile not found")
          setLoading(false)
          return
        }

        setProfile(profile)
        setUsername(profile.username || "")
        setDisplayName(profile.display_name || "")

        if (profile.has_onboarded) {
          const homeWorkspaceId = await getHomeWorkspaceByUserId(user.id)
          if (homeWorkspaceId) {
            return router.push(`/${homeWorkspaceId}/chat`)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Error in setup page:", error)
        setLoading(false)
      }
    })()
  }, [router, setProfile])

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
    if (!profile) return

    const updatedProfile = await updateProfile(profile.id, {
      ...profile,
      username,
      display_name: displayName,
      has_onboarded: true
    })

    setProfile(updatedProfile)

    const homeWorkspaceId = await getHomeWorkspaceByUserId(profile.id)
    router.push(`/${homeWorkspaceId}/chat`)
  }

  const renderStep = (stepNum: number) => {
    switch (stepNum) {
      // Profile Step
      case 1:
        return (
          <StepContainer
            stepDescription="Let's create your profile."
            stepNum={currentStep}
            stepTitle="Welcome to Chatbot UI"
            onShouldProceed={handleShouldProceed}
            showNextButton={!!(username && usernameAvailable)}
            showBackButton={false}
          >
            <ProfileStep
              username={username}
              usernameAvailable={usernameAvailable}
              displayName={displayName}
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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-xl font-bold">Loading...</div>
          <div className="size-8 animate-spin rounded-full border-y-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full items-center justify-center">
      {renderStep(currentStep)}
    </div>
  )
}

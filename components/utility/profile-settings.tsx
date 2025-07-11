import { MayuraContext } from "@/context/context"
import {
  PROFILE_CONTEXT_MAX,
  PROFILE_DISPLAY_NAME_MAX,
  PROFILE_USERNAME_MAX,
  PROFILE_USERNAME_MIN
} from "@/db/limits"
import { updateProfile } from "@/db/profile"
import { useAuth } from "@/context/auth-context"
import { getIdToken, signOutUser } from "@/lib/firebase/auth"
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader2,
  IconLogout,
  IconUser
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { FC, useCallback, useContext, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { LimitDisplay } from "../ui/limit-display"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../ui/sheet"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { WithTooltip } from "../ui/with-tooltip"


// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface ProfileSettingsProps {}

export const ProfileSettings: FC<ProfileSettingsProps> = ({}) => {
  const { profile, setProfile } = useContext(MayuraContext)
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [usernameAvailable, setUsernameAvailable] = useState(true)
  const [loadingUsername, setLoadingUsername] = useState(false)
  const [profileInstructions, setProfileInstructions] = useState(
    profile?.profile_context || ""
  )

  const handleSignOut = async () => {
    await signOutUser()
    router.push("/login")
    router.refresh()
    return
  }

  const handleSave = async () => {
    if (!profile) return

    const updatedProfile = await updateProfile(profile.user_id, {
      display_name: displayName,
      username,
      profile_context: profileInstructions
    })

    setProfile(updatedProfile)
    toast.success("Profile updated!")
    setIsOpen(false)
  }

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout | null

    return (...args: any[]) => {
      const later = () => {
        if (timeout) clearTimeout(timeout)
        func(...args)
      }

      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (!username) return

      if (username.length < PROFILE_USERNAME_MIN) {
        setUsernameAvailable(false)
        return
      }

      if (username === profile?.username) {
        setUsernameAvailable(true)
        return
      }

      setLoadingUsername(true)

      try {
        const token = await getIdToken()
        if (!token) {
          setUsernameAvailable(false)
          setLoadingUsername(false)
          return
        }

        const response = await fetch(`${API_BASE_URL}/v1/profiles/username-availability-check?username=${username}&exclude_user_id=${profile?.user_id || ''}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUsernameAvailable(data.available)
        } else {
          setUsernameAvailable(false)
        }
      } catch (error) {
        console.error("Error checking username availability:", error)
        setUsernameAvailable(false)
      }

      setLoadingUsername(false)
    }, 500),
    [profile]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      buttonRef.current?.click()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-lg"
        >
          <IconUser size={24} className="text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent
        className="flex flex-col justify-between"
        side="left"
        onKeyDown={handleKeyDown}
      >
        <div className="grow overflow-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between space-x-2 text-white">
              <div>User Profile</div>

              <Button
                tabIndex={-1}
                variant="outline"
                className="border-red-600 bg-red-600 text-xs text-white hover:bg-red-700"
                size="sm"
                onClick={handleSignOut}
              >
                <IconLogout className="mr-1" size={20} />
                Logout
              </Button>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Display Name</Label>

              <div className="space-y-1">
                <Input
                  placeholder="Display Name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                />

                <LimitDisplay
                  used={displayName.length}
                  limit={PROFILE_DISPLAY_NAME_MAX}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Username</Label>

              <div className="space-y-1">
                <div className="relative">
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={e => {
                      setUsername(e.target.value)
                      checkUsernameAvailability(e.target.value)
                    }}
                  />

                  {username.length > 0 && (
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      {loadingUsername ? (
                        <IconLoader2
                          className="animate-spin text-slate-400"
                          size={20}
                        />
                      ) : usernameAvailable ? (
                        <WithTooltip
                          display={<div>Username is available</div>}
                          trigger={
                            <IconCircleCheckFilled
                              className="text-violet-500"
                              size={20}
                            />
                          }
                        />
                      ) : (
                        <WithTooltip
                          display={<div>Username is not available</div>}
                          trigger={
                            <IconCircleXFilled
                              className="text-red-500"
                              size={20}
                            />
                          }
                        />
                      )}
                    </div>
                  )}
                </div>

                <LimitDisplay
                  used={username.length}
                  limit={PROFILE_USERNAME_MAX}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Profile Instructions</Label>

              <div className="space-y-1">
                <TextareaAutosize
                  placeholder="Instructions to be included with every chat. Can be used to provide context about yourself that you want the assistant to know."
                  value={profileInstructions}
                  onValueChange={setProfileInstructions}
                  minRows={3}
                  maxRows={6}
                />

                <LimitDisplay
                  used={profileInstructions.length}
                  limit={PROFILE_CONTEXT_MAX}
                />
              </div>
            </div>


          </div>
        </div>

        <div className="mt-6">
          <Button
            ref={buttonRef}
            className="w-full bg-violet-600 text-white hover:bg-violet-700"
            disabled={
              !usernameAvailable ||
              username.length < PROFILE_USERNAME_MIN ||
              username.length > PROFILE_USERNAME_MAX ||
              displayName.length > PROFILE_DISPLAY_NAME_MAX ||
              profileInstructions.length > PROFILE_CONTEXT_MAX
            }
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

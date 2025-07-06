import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  PROFILE_DISPLAY_NAME_MAX,
  PROFILE_USERNAME_MAX,
  PROFILE_USERNAME_MIN
} from "@/db/limits"
import { useAuth } from "@/context/auth-context"
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader2
} from "@tabler/icons-react"
import { FC, useCallback, useState } from "react"
import { LimitDisplay } from "../ui/limit-display"
import { toast } from "sonner"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface ProfileStepProps {
  username: string
  usernameAvailable: boolean
  displayName: string
  currentUserId?: string
  onUsernameAvailableChange: (isAvailable: boolean) => void
  onUsernameChange: (username: string) => void
  onDisplayNameChange: (name: string) => void
}

export const ProfileStep: FC<ProfileStepProps> = ({
  username,
  usernameAvailable,
  displayName,
  currentUserId,
  onUsernameAvailableChange,
  onUsernameChange,
  onDisplayNameChange
}) => {
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

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
        onUsernameAvailableChange(false)
        return
      }

      if (username.length > PROFILE_USERNAME_MAX) {
        onUsernameAvailableChange(false)
        return
      }

      const usernameRegex = /^[a-zA-Z0-9_]+$/
      if (!usernameRegex.test(username)) {
        onUsernameAvailableChange(false)
        toast.error(
          "Username must be letters, numbers, or underscores only - no other characters or spacing allowed."
        )
        return
      }

      setLoading(true)

      try {
        const token = await getToken()
        if (!token) {
          onUsernameAvailableChange(false)
          setLoading(false)
          return
        }

        // Use our backend API to check username availability
        const response = await fetch(`${API_BASE_URL}/v1/profiles/username-availability-check?username=${username}&exclude_user_id=${currentUserId || ''}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          console.error('Error checking username availability:', response.statusText)
          onUsernameAvailableChange(false)
          setLoading(false)
          return
        }

        const data = await response.json()
        onUsernameAvailableChange(data.available)
        setLoading(false)
      } catch (error) {
        console.error('Error checking username availability:', error)
        onUsernameAvailableChange(false)
        setLoading(false)
      }
    }, 500),
    [currentUserId, onUsernameAvailableChange, getToken]
  )

  return (
    <>
      <div className="space-y-2">
        <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <Label className="text-sm font-medium">Username</Label>

          <div className="text-xs">
            {username &&
              (usernameAvailable ? (
                <div className="text-purple-500 font-medium">AVAILABLE</div>
              ) : (
                <div className="text-red-500 font-medium">UNAVAILABLE</div>
              ))}
          </div>
        </div>

        <div className="relative">
          <Input
            className="pr-10 h-11 sm:h-10"
            placeholder="username"
            value={username}
            onChange={e => {
              onUsernameChange(e.target.value)
              checkUsernameAvailability(e.target.value)
            }}
            minLength={PROFILE_USERNAME_MIN}
            maxLength={PROFILE_USERNAME_MAX}
          />

          {username && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {loading ? (
                <IconLoader2 className="animate-spin size-5" />
              ) : usernameAvailable ? (
                <IconCircleCheckFilled className="text-purple-500 size-5" />
              ) : (
                <IconCircleXFilled className="text-red-500 size-5" />
              )}
            </div>
          )}
        </div>

        <LimitDisplay used={username.length} limit={PROFILE_USERNAME_MAX} />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Display Name</Label>

        <Input
          className="h-11 sm:h-10"
          placeholder="Your Name"
          value={displayName}
          onChange={e => onDisplayNameChange(e.target.value)}
          maxLength={PROFILE_DISPLAY_NAME_MAX}
        />

        <LimitDisplay
          used={displayName.length}
          limit={PROFILE_DISPLAY_NAME_MAX}
        />
      </div>
    </>
  )
}

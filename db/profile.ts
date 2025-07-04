import { getIdToken } from "@/lib/firebase/auth"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface Profile {
  user_id: string
  username: string
  display_name: string
  profile_context: string
  has_onboarded: boolean
  created_at: string
  updated_at: string
}

export interface CreateProfileData {
  user_id: string
  username: string
  display_name: string
  profile_context: string
  has_onboarded: boolean
}

export interface UpdateProfileData {
  username?: string
  display_name?: string
  profile_context?: string
  has_onboarded?: boolean
}

export const getProfileByUserId = async (userId: string): Promise<Profile> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/profiles/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      // Auto-create profile if it doesn't exist
      try {
        // Generate a unique username
        const baseUsername = `user_${userId.slice(0, 8)}`
        let finalUsername = baseUsername
        let counter = 0

        // Ensure username is unique
        while (counter < 100) {
          const checkResponse = await fetch(`${API_BASE_URL}/v1/profiles/username/check/${finalUsername}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (checkResponse.ok) {
            const checkData = await checkResponse.json()
            if (checkData.available) break
          }

          counter++
          finalUsername = `${baseUsername}_${counter}`
        }

        const newProfile = await createProfile({
          user_id: userId,
          username: finalUsername,
          display_name: "",
          profile_context: "",
          has_onboarded: false
        })

        return newProfile
      } catch (createError) {
        console.error("Error creating profile:", createError)

        // Fallback: try with timestamp-based username
        try {
          const fallbackProfile = await createProfile({
            user_id: userId,
            username: `user${Date.now()}`,
            display_name: "",
            profile_context: "",
            has_onboarded: false
          })

          return fallbackProfile
        } catch (fallbackError) {
          console.error("Fallback profile creation failed:", fallbackError)
          throw new Error(`Failed to create profile: ${fallbackError}`)
        }
      }
    }
    throw new Error(`Failed to fetch profile: ${response.statusText}`)
  }

  return await response.json()
}

export const getProfilesByUserId = async (userId: string): Promise<Profile[]> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/profiles/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch profiles: ${response.statusText}`)
  }

  return await response.json()
}

export const createProfile = async (profile: CreateProfileData): Promise<Profile> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/profiles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profile)
  })

  if (!response.ok) {
    throw new Error(`Failed to create profile: ${response.statusText}`)
  }

  return await response.json()
}

export const updateProfile = async (
  userId: string,
  profile: UpdateProfileData
): Promise<Profile> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/profiles/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profile)
  })

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${response.statusText}`)
  }

  return await response.json()
}

export const deleteProfile = async (userId: string): Promise<boolean> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/profiles/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to delete profile: ${response.statusText}`)
  }

  return true
}

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

// Get current user's profile (no user ID needed - extracted from token)
export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/profiles/current`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch profile: ${response.statusText}`)
  }

  return await response.json()
}

// Legacy function - now redirects to getCurrentUserProfile
export const getProfileByUserId = async (userId: string): Promise<Profile | null> => {
  // For backward compatibility, we'll use the new endpoint
  // The userId parameter is ignored since the backend gets it from the token
  return getCurrentUserProfile()
}

export const getProfilesByUserId = async (userId: string): Promise<Profile[]> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/profiles/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return [] // Return empty array for 404 (no profiles found)
      }
      throw new Error(`Failed to fetch profiles: ${response.statusText}`)
    }

    const data = await response.json()
    // Handle null or undefined response from backend
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching profiles:", error)
    return [] // Return empty array on error
  }
}

export const createProfile = async (profile: Omit<Profile, 'user_id' | 'created_at' | 'updated_at'>): Promise<Profile> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  // Remove user_id from the request body since backend will set it from token
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
  profileId: string,
  profile: Partial<Omit<Profile, 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Profile> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  // Remove user_id from the request body since backend will set it from token
  const response = await fetch(`${API_BASE_URL}/v1/profiles/${profileId}`, {
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

export const deleteProfile = async (profileId: string): Promise<boolean> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/profiles/${profileId}`, {
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

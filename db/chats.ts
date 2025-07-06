import { getIdToken } from "@/lib/firebase/auth"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface Chat {
  id: string
  user_id: string
  name: string
  sharing: string
  created_at: string
  updated_at: string | null
}

export interface CreateChatData {
  name: string
  sharing: string
}

export interface UpdateChatData {
  name?: string
  sharing?: string
}

// Get current user's chats (no user ID needed - extracted from token)
export const getCurrentUserChats = async (): Promise<Chat[]> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/chats/current`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return [] // Return empty array for 404 (no chats found)
      }
      throw new Error(`Failed to fetch chats: ${response.statusText}`)
    }

    const data = await response.json()
    // Handle null or undefined response from backend
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching chats:", error)
    return [] // Return empty array on error
  }
}

// Legacy function - now redirects to getCurrentUserChats
export const getChatsByUserId = async (userId: string): Promise<Chat[]> => {
  // For backward compatibility, we'll use the new endpoint
  // The userId parameter is ignored since the backend gets it from the token
  return getCurrentUserChats()
}

export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/chats/${chatId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch chat: ${response.statusText}`)
  }

  return await response.json()
}

export const createChat = async (chat: CreateChatData): Promise<Chat> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  // Remove user_id from the request body since backend will set it from token
  const response = await fetch(`${API_BASE_URL}/v1/chats`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chat)
  })

  if (!response.ok) {
    throw new Error(`Failed to create chat: ${response.statusText}`)
  }

  return await response.json()
}

export const updateChat = async (
  chatId: string,
  chat: UpdateChatData
): Promise<Chat> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/chats/${chatId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chat)
  })

  if (!response.ok) {
    throw new Error(`Failed to update chat: ${response.statusText}`)
  }

  return await response.json()
}

export const deleteChat = async (chatId: string): Promise<boolean> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/chats/${chatId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to delete chat: ${response.statusText}`)
  }

  return true
}

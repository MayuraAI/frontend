import { getIdToken } from "@/lib/firebase/auth"

// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface Message {
  id: string
  chat_id: string
  user_id: string
  content: string
  model_name: string
  role: string
  sequence_number: number
  created_at: string
  updated_at: string
}

export interface CreateMessageData {
  chat_id: string
  user_id: string
  content: string
  model_name: string
  role: string
  sequence_number: number
}

export interface UpdateMessageData {
  content?: string
  model_name?: string
  role?: string
  sequence_number?: number
}

export const getMessageById = async (messageId: string): Promise<Message> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/messages/${messageId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Message not found")
    }
    throw new Error(`Failed to fetch message: ${response.statusText}`)
  }

  return await response.json()
}

export const getMessagesByChatId = async (chatId: string): Promise<Message[]> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/messages/chat/${chatId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      return []
    }
    throw new Error(`Failed to fetch messages: ${response.statusText}`)
  }

  return await response.json()
}

export const createMessage = async (message: CreateMessageData): Promise<Message> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })

  if (!response.ok) {
    throw new Error(`Failed to create message: ${response.statusText}`)
  }

  return await response.json()
}

export const createMessages = async (messages: CreateMessageData[]): Promise<Message[]> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/messages/batch`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messages })
  })

  if (!response.ok) {
    throw new Error(`Failed to create messages: ${response.statusText}`)
  }

  return await response.json()
}

export const updateMessage = async (
  messageId: string,
  message: UpdateMessageData
): Promise<Message> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/messages/${messageId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })

  if (!response.ok) {
    throw new Error(`Failed to update message: ${response.statusText}`)
  }

  return await response.json()
}

export const deleteMessage = async (messageId: string): Promise<boolean> => {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/messages/${messageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to delete message: ${response.statusText}`)
  }

  return true
}

export async function deleteMessagesIncludingAndAfter(
  userId: string,
  chatId: string,
  sequenceNumber: number
): Promise<boolean | { error: string }> {
  const token = await getIdToken()
  if (!token) {
    throw new Error("No authentication token available")
  }

  const response = await fetch(`${API_BASE_URL}/v1/messages/delete-from-sequence`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      chat_id: chatId,
      sequence_number: sequenceNumber
    })
  })

  if (!response.ok) {
    return {
      error: "Failed to delete messages."
    }
  }

  return true
}

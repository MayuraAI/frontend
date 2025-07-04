"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User } from "firebase/auth"
import { getCurrentUser, onAuthStateChange, getIdToken, setTokenInCookies, removeTokenFromCookies } from "@/lib/firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)

    // Set token in cookies if user is logged in
    if (currentUser) {
      setTokenInCookies()
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user)
      setLoading(false)
      
      if (user) {
        // User logged in, set token in cookies
        await setTokenInCookies()
      } else {
        // User logged out, remove token from cookies
        removeTokenFromCookies()
      }
    })

    return () => unsubscribe()
  }, [])

  const getToken = async () => {
    return await getIdToken()
  }

  const value = {
    user,
    loading,
    getToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 
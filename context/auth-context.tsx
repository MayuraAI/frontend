"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import {
  getIdToken,
  setTokenInCookies,
  removeTokenFromCookies
} from "@/lib/firebase/auth"
import { auth } from "@/lib/firebase/config"

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      if (firebaseUser) {
        await setTokenInCookies()
      } else {
        removeTokenFromCookies()
      }
    })

    return () => unsubscribe()
  }, [])

  const getToken = async () => {
    return await getIdToken()
  }

  return (
    <AuthContext.Provider value={{ user, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

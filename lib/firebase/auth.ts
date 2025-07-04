import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updatePassword,
  User,
  UserCredential,
  AuthError
} from 'firebase/auth'
import { auth } from './config'
import { MayuraContext } from '@/context/context'
import { useContext } from 'react'

// Google provider for OAuth
const googleProvider = new GoogleAuthProvider()

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(auth, email, password)
}

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  
  // Send email verification
  if (userCredential.user) {
    await sendEmailVerification(userCredential.user)
  }
  
  return userCredential
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  return await signInWithPopup(auth, googleProvider)
}

// Sign out
export const signOutUser = async (): Promise<void> => {
  removeTokenFromCookies()
  return await signOut(auth)
}

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  return await sendPasswordResetEmail(auth, email)
}

// Resend email verification
export const resendEmailVerification = async (): Promise<void> => {
  if (auth.currentUser) {
    return await sendEmailVerification(auth.currentUser)
  }
  throw new Error('No user is currently signed in')
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Get ID token for API calls
export const getIdToken = async (): Promise<string | null> => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken()
    // Set the token in cookies for middleware access
    if (token) {
      document.cookie = `firebase-token=${token}; path=/; max-age=3600; secure; samesite=strict`
    }
    return token
  }
  return null
}

// Set Firebase token in cookies
export const setTokenInCookies = async (): Promise<void> => {
  const token = await getIdToken()
  if (token) {
    document.cookie = `firebase-token=${token}; path=/; max-age=3600; secure; samesite=strict`
  }
}

// Remove Firebase token from cookies
export const removeTokenFromCookies = (): void => {
  document.cookie = 'firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

// Check if user's email is verified
export const isEmailVerified = (): boolean => {
  return auth.currentUser?.emailVerified ?? false
}

// Update user password
export const updateUserPassword = async (newPassword: string): Promise<void> => {
  if (auth.currentUser) {
    return await updatePassword(auth.currentUser, newPassword)
  }
  throw new Error('No user is currently signed in')
}

// Helper to format Firebase auth errors
export const formatAuthError = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials and try again.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.'
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'
    default:
      return error.message || 'An unexpected error occurred. Please try again.'
  }
} 
// API base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Check profile status and redirect appropriately after authentication
export const redirectAfterAuth = async (router: any) => {
  try {
    console.log("🔄 Checking profile status after authentication...")
    const user = getCurrentUser()
    if (!user) {
      console.log("❌ No user found, redirecting to login")
      router.push("/login")
      return
    }

    console.log("✅ User found:", user.uid)
    const token = await getIdToken()
    if (!token) {
      console.log("❌ No token found, redirecting to login")
      router.push("/login")
      return
    }

    console.log("✅ Token obtained, checking profile in backend...")
    // Check if profile exists in backend
    const response = await fetch(`${API_BASE_URL}/v1/profiles/by-user-id/${user.uid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log("📡 Backend response status:", response.status)

    if (!response.ok) {
      if (response.status === 404) {
        console.log("📝 No profile exists, redirecting to setup")
        router.push("/setup")
        return
      }
      throw new Error(`Failed to check profile: ${response.statusText}`)
    }

    const profile = await response.json()
    console.log("✅ Profile found:", profile)
    
    // If profile exists but user hasn't completed onboarding
    if (profile && !profile.has_onboarded) {
      console.log("🚀 Profile exists but not onboarded, redirecting to setup")
      router.push("/setup")
      return
    }

    // If profile exists and user has completed onboarding
    if (profile && profile.has_onboarded) {
      console.log("🎉 Profile exists and onboarded, redirecting to chat")
      router.push("/chat")
      return
    }

    // Fallback to setup if we can't determine status
    console.log("⚠️ Unknown profile status, redirecting to setup")
    router.push("/setup")
  } catch (error) {
    console.error("❌ Error checking profile status:", error)
    // On error, redirect to setup to be safe
    router.push("/setup")
  }
}

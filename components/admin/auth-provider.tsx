"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signOut as firebaseSignOut, 
  onAuthChange,
  type User as FirebaseUser
} from "@/lib/firebase/client"
import type { AdminPermission } from "@/lib/firebase/collections"

// Public admin info sent to client
export interface AdminUser {
  email: string
  name: string
  role: "admin"
  permissions: AdminPermission[]
  photoURL?: string
}

interface AuthContextType {
  user: AdminUser | null
  firebaseUser: FirebaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  hasPermission: (permission: AdminPermission) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verify the Firebase user against our admin database
  const verifyAdminAccess = useCallback(async (fbUser: FirebaseUser): Promise<AdminUser | null> => {
    try {
      const idToken = await fbUser.getIdToken()
      
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        credentials: "include",
      })
      
      const data = await response.json()
      
      if (data.success && data.user) {
        return {
          ...data.user,
          photoURL: fbUser.photoURL || undefined,
        }
      }
      
      return null
    } catch (error) {
      console.error("Failed to verify admin access:", error)
      return null
    }
  }, [])

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (fbUser) => {
      setIsLoading(true)
      setFirebaseUser(fbUser)
      
      if (fbUser) {
        // Verify this Firebase user is an approved admin
        const adminUser = await verifyAdminAccess(fbUser)
        setUser(adminUser)
        
        if (!adminUser) {
          // User is authenticated with Firebase but not an approved admin
          // Sign them out
          console.log("User not approved as admin, signing out")
          await firebaseSignOut()
        }
      } else {
        setUser(null)
      }
      
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [verifyAdminAccess])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const fbUser = await signInWithGoogle()
      const adminUser = await verifyAdminAccess(fbUser)
      
      if (!adminUser) {
        await firebaseSignOut()
        return { success: false, error: "This email is not authorized for admin access." }
      }
      
      setUser(adminUser)
      return { success: true }
    } catch (error) {
      console.error("Google sign-in error:", error)
      return { success: false, error: "Sign-in failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const fbUser = await signInWithEmail(email, password)
      const adminUser = await verifyAdminAccess(fbUser)
      
      if (!adminUser) {
        await firebaseSignOut()
        return { success: false, error: "This email is not authorized for admin access." }
      }
      
      setUser(adminUser)
      return { success: true }
    } catch (error: unknown) {
      console.error("Email sign-in error:", error)
      const firebaseError = error as { code?: string }
      if (firebaseError.code === "auth/user-not-found" || firebaseError.code === "auth/wrong-password") {
        return { success: false, error: "Invalid email or password." }
      }
      return { success: false, error: "Sign-in failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Clear server session
      await fetch("/api/admin/auth", { 
        method: "DELETE",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      await firebaseSignOut()
      setUser(null)
      setFirebaseUser(null)
    }
  }

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!user) return false
    // All authenticated Firebase users have full admin access
    return user.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isAuthenticated: !!user,
        signInWithGoogle: handleGoogleSignIn,
        signInWithEmail: handleEmailSignIn,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

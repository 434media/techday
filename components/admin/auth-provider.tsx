"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { PublicAdminUser, AdminPermission } from "@/lib/admin/config"

interface AuthContextType {
  user: PublicAdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
  getQuestion: (email: string) => Promise<{ success: boolean; question?: string; isValid?: boolean }>
  verify: (email: string, answer: string, pin: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  hasPermission: (permission: AdminPermission) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicAdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/auth")
      const data = await response.json()
      
      if (data.authenticated && data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const getQuestion = async (email: string) => {
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "get-question" }),
      })
      
      const data = await response.json()
      return { 
        success: true, 
        question: data.question,
        isValid: data.isValid,
      }
    } catch {
      return { success: false }
    }
  }

  const verify = async (email: string, answer: string, pin: string) => {
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answer, pin, action: "verify" }),
      })
      
      const data = await response.json()
      
      if (data.success && data.user) {
        setUser(data.user)
        return { success: true }
      }
      
      return { success: false, error: data.error || "Verification failed" }
    } catch {
      return { success: false, error: "Verification failed" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" })
    } finally {
      setUser(null)
    }
  }

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!user) return false
    if (user.role === "superadmin") return true
    return user.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        getQuestion,
        verify,
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

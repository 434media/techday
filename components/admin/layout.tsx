"use client"

import { type ReactNode } from "react"
import { AdminAuthProvider, useAdminAuth } from "./auth-provider"
import { AdminLogin } from "./login"
import { AdminSidebar } from "./sidebar"

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAdminAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 pt-16 overflow-x-hidden">
      <div className="flex">
        <AdminSidebar />
        {/* Add extra padding on mobile for the admin header bar */}
        <main className="flex-1 min-w-0 min-h-[calc(100vh-4rem)] pt-14 lg:pt-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  )
}

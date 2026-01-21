"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAdminAuth } from "@/components/admin/auth-provider"

interface Stats {
  registrations: number
  newsletter: number
  pitches: number
}

export default function AdminOverviewPage() {
  const { user } = useAdminAuth()
  const [stats, setStats] = useState<Stats>({ registrations: 0, newsletter: 0, pitches: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Use combined stats endpoint for better performance (single cold start)
        const response = await fetch("/api/admin/stats", { credentials: "include" })
        const data = await response.json()

        setStats({
          registrations: data.registrations || 0,
          newsletter: data.newsletter || 0,
          pitches: data.pitches || 0,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
          Welcome back
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-black">
          {user?.name}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          label="Registrations"
          value={stats.registrations}
          isLoading={isLoading}
          href="/admin/registrations"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          label="Newsletter Subscribers"
          value={stats.newsletter}
          isLoading={isLoading}
          href="/admin/newsletter"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Pitch Submissions"
          value={stats.pitches}
          isLoading={isLoading}
          href="/admin/pitches"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction href="/admin/registrations" label="View Registrations" />
          <QuickAction href="/admin/pitches" label="Review Pitches" />
          <QuickAction href="/admin/speakers" label="Manage Speakers" />
          <QuickAction href="/admin/schedule" label="Edit Schedule" />
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-4">
          System Info
        </h2>
        <div className="bg-white border border-neutral-200 p-6">
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm text-neutral-500">Your Role</dt>
              <dd className="text-sm font-medium text-black capitalize">{user?.role}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-neutral-500">Email</dt>
              <dd className="text-sm font-medium text-black">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-neutral-500">Permissions</dt>
              <dd className="text-sm font-medium text-black">
                {user?.role === "superadmin" ? "All" : user?.permissions?.length || 0}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  isLoading,
  href,
  icon,
}: {
  label: string
  value: number
  isLoading: boolean
  href?: string
  icon?: React.ReactNode
}) {
  const content = (
    <div className={`bg-white border border-neutral-200 p-6 transition-all ${href ? "hover:border-neutral-300 hover:shadow-sm cursor-pointer" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {label}
        </p>
        {icon && (
          <div className="text-neutral-300">
            {icon}
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-10 w-24 bg-neutral-100 rounded animate-pulse" />
          <div className="h-3 w-16 bg-neutral-50 rounded animate-pulse" />
        </div>
      ) : (
        <div>
          <p className="text-4xl font-semibold tracking-tight text-black">
            {value.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {value === 1 ? "record" : "records"}
          </p>
        </div>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="bg-white border border-neutral-200 p-4 text-sm font-medium text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors"
    >
      {label}
    </Link>
  )
}

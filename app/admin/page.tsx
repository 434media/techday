"use client"

import { useEffect, useState } from "react"
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
        const [regRes, newsRes, pitchRes] = await Promise.all([
          fetch("/api/admin/stats/registrations"),
          fetch("/api/admin/stats/newsletter"),
          fetch("/api/admin/stats/pitches"),
        ])

        const [regData, newsData, pitchData] = await Promise.all([
          regRes.json(),
          newsRes.json(),
          pitchRes.json(),
        ])

        setStats({
          registrations: regData.count || 0,
          newsletter: newsData.count || 0,
          pitches: pitchData.count || 0,
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
        />
        <StatCard
          label="Newsletter Subscribers"
          value={stats.newsletter}
          isLoading={isLoading}
        />
        <StatCard
          label="Pitch Submissions"
          value={stats.pitches}
          isLoading={isLoading}
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
}: {
  label: string
  value: number
  isLoading: boolean
}) {
  return (
    <div className="bg-white border border-neutral-200 p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
        {label}
      </p>
      {isLoading ? (
        <div className="h-10 bg-neutral-100 animate-pulse" />
      ) : (
        <p className="text-4xl font-semibold tracking-tight text-black">
          {value.toLocaleString()}
        </p>
      )}
    </div>
  )
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="bg-white border border-neutral-200 p-4 text-sm font-medium text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors"
    >
      {label}
    </a>
  )
}

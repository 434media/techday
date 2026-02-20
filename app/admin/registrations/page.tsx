"use client"

import { useEffect, useState } from "react"

interface Registration {
  id: string
  ticketId: string
  firstName: string
  lastName: string
  email: string
  category: string
  company: string
  title: string
  events: string[]
  eventLabel: string
  status: string
  createdAt: string
}

interface RegistrationStats {
  total: number
  techday: number
  techfuel: number
  bothDays: number
  techdayOnly: number
  techfuelOnly: number
  limits: Record<string, number>
  activeTechday: number
  activeTechfuel: number
}

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "founder", label: "Founder" },
  { value: "investor", label: "Investor" },
  { value: "attendee", label: "Attendee" },
  { value: "student", label: "Student" },
  { value: "government", label: "Government" },
]

const STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "checked-in", label: "Checked In" },
  { value: "cancelled", label: "Cancelled" },
]

const EVENT_FILTERS = [
  { value: "", label: "All Events" },
  { value: "techday", label: "Tech Day (all)" },
  { value: "techfuel", label: "Tech Fuel (all)" },
  { value: "both", label: "Both Days" },
  { value: "techday-only", label: "Tech Day Only" },
  { value: "techfuel-only", label: "Tech Fuel Only" },
]

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [stats, setStats] = useState<RegistrationStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [eventFilter, setEventFilter] = useState("")
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [isDeletingAll, setIsDeletingAll] = useState(false)

  useEffect(() => {
    fetchRegistrations()
  }, [category, status, eventFilter])

  async function fetchRegistrations() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set("category", category)
      if (status) params.set("status", status)
      if (eventFilter) params.set("event", eventFilter)

      const response = await fetch(`/api/admin/data/registrations?${params}`, {
        credentials: "include",
      })
      const data = await response.json()
      setRegistrations(data.registrations || [])
      if (data.stats) setStats(data.stats)
    } catch (error) {
      console.error("Failed to fetch registrations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRegistrations = registrations.filter((reg) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      reg.firstName?.toLowerCase().includes(searchLower) ||
      reg.lastName?.toLowerCase().includes(searchLower) ||
      reg.email?.toLowerCase().includes(searchLower) ||
      reg.company?.toLowerCase().includes(searchLower) ||
      reg.ticketId?.toLowerCase().includes(searchLower)
    )
  })

  const exportToCSV = () => {
    const headers = [
      "Ticket ID",
      "First Name",
      "Last Name",
      "Email",
      "Category",
      "Company",
      "Title",
      "Event",
      "Events (raw)",
      "Status",
      "Registration Date",
    ]
    const rows = filteredRegistrations.map((reg) => [
      reg.ticketId || "",
      reg.firstName || "",
      reg.lastName || "",
      reg.email || "",
      reg.category || "",
      reg.company || "",
      reg.title || "",
      reg.eventLabel || "",
      reg.events?.join("; ") || "",
      reg.status || "",
      reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "",
    ])

    // Escape CSV values that contain commas, quotes, or newlines
    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  async function deleteRegistration(id: string) {
    if (!confirm("Are you sure you want to delete this registration?")) return

    try {
      const response = await fetch(`/api/admin/data/registrations?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        fetchRegistrations()
      }
    } catch (error) {
      console.error("Failed to delete registration:", error)
    }
  }

  async function deleteAllRegistrations() {
    if (!confirm("Are you sure you want to delete ALL registrations? This action cannot be undone.")) return
    if (!confirm("This will permanently remove all registration data. Are you absolutely sure?")) return

    setIsDeletingAll(true)
    try {
      const response = await fetch("/api/admin/data/registrations?id=all", {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        fetchRegistrations()
      }
    } catch (error) {
      console.error("Failed to delete all registrations:", error)
    } finally {
      setIsDeletingAll(false)
    }
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Registrations
          </h1>
          <p className="text-sm text-neutral-500">
            {filteredRegistrations.length} registrations found
          </p>
        </div>
        <div className="flex items-center gap-3">
          {registrations.length > 0 && (
            <button
              onClick={deleteAllRegistrations}
              disabled={isDeletingAll}
              className="px-4 py-2 text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isDeletingAll ? "Deleting..." : "Delete All"}
            </button>
          )}
          <button
            onClick={exportToCSV}
            disabled={filteredRegistrations.length === 0}
            className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard label="Total" value={stats.total} />
          <StatCard
            label="Tech Day"
            value={stats.techday}
            sublabel={`${stats.activeTechday} / ${stats.limits.techday} capacity`}
            progress={(stats.activeTechday / stats.limits.techday) * 100}
          />
          <StatCard
            label="Tech Fuel"
            value={stats.techfuel}
            sublabel={`${stats.activeTechfuel} / ${stats.limits.techfuel} capacity`}
            progress={(stats.activeTechfuel / stats.limits.techfuel) * 100}
          />
          <StatCard label="Both Days" value={stats.bothDays} accent="blue" />
          <StatCard label="Tech Day Only" value={stats.techdayOnly} accent="green" />
          <StatCard label="Tech Fuel Only" value={stats.techfuelOnly} accent="purple" />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-neutral-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-50">
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email, company, ticket..."
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
            />
          </div>
          <div className="w-44">
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Event
            </label>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            >
              {EVENT_FILTERS.map((ef) => (
                <option key={ef.value} value={ef.value}>
                  {ef.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-neutral-500">Loading registrations...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-neutral-500">No registrations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Ticket
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredRegistrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-mono text-black cursor-pointer" onClick={() => setSelectedRegistration(reg)}>
                      {reg.ticketId}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-black cursor-pointer" onClick={() => setSelectedRegistration(reg)}>
                      {reg.firstName} {reg.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 cursor-pointer" onClick={() => setSelectedRegistration(reg)}>
                      {reg.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 capitalize cursor-pointer" onClick={() => setSelectedRegistration(reg)}>
                      {reg.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 cursor-pointer" onClick={() => setSelectedRegistration(reg)}>
                      {reg.company || "—"}
                    </td>
                    <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedRegistration(reg)}>
                      <EventBadge label={reg.eventLabel} />
                    </td>
                    <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedRegistration(reg)}>
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500 cursor-pointer" onClick={() => setSelectedRegistration(reg)}>
                      {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteRegistration(reg.id)
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Delete registration"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRegistration && (
        <RegistrationDetailModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
        />
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  sublabel,
  progress,
  accent,
}: {
  label: string
  value: number
  sublabel?: string
  progress?: number
  accent?: "blue" | "green" | "purple"
}) {
  const accentColors = {
    blue: "border-blue-200 bg-blue-50/50",
    green: "border-green-200 bg-green-50/50",
    purple: "border-purple-200 bg-purple-50/50",
  }
  const accentTextColors = {
    blue: "text-blue-700",
    green: "text-green-700",
    purple: "text-purple-700",
  }

  return (
    <div className={`border p-4 ${accent ? accentColors[accent] : "border-neutral-200 bg-white"}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
        {label}
      </p>
      <p className={`text-2xl font-semibold ${accent ? accentTextColors[accent] : "text-black"}`}>
        {value}
      </p>
      {sublabel && (
        <p className="text-xs text-neutral-500 mt-1">{sublabel}</p>
      )}
      {progress !== undefined && (
        <div className="mt-2 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              progress >= 90 ? "bg-red-500" : progress >= 70 ? "bg-yellow-500" : "bg-black"
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

function EventBadge({ label }: { label: string }) {
  const styles: Record<string, string> = {
    "Both Days": "bg-blue-100 text-blue-700",
    "Tech Day Only": "bg-green-100 text-green-700",
    "Tech Fuel Only": "bg-purple-100 text-purple-700",
    None: "bg-neutral-100 text-neutral-500",
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium tracking-wider ${
        styles[label] || styles.None
      }`}
    >
      {label}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-black text-white",
    pending: "bg-neutral-200 text-neutral-600",
    "checked-in": "bg-neutral-800 text-white",
    cancelled: "bg-neutral-100 text-neutral-400",
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  )
}

function RegistrationDetailModal({
  registration,
  onClose,
}: {
  registration: Registration
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
              Registration Details
            </p>
            <h2 className="text-lg font-semibold text-black">
              {registration.firstName} {registration.lastName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <DetailRow label="Ticket ID" value={registration.ticketId} mono />
          <DetailRow label="Email" value={registration.email} />
          <DetailRow label="Category" value={registration.category} capitalize />
          <DetailRow label="Company" value={registration.company || "—"} />
          <DetailRow label="Title" value={registration.title || "—"} />
          <div className="flex justify-between items-start gap-4">
            <dt className="text-sm text-neutral-500 shrink-0">Event</dt>
            <dd className="text-right">
              <EventBadge label={registration.eventLabel} />
            </dd>
          </div>
          <DetailRow label="Events (raw)" value={registration.events?.join(", ") || "—"} />
          <DetailRow label="Status" value={registration.status} capitalize />
          <DetailRow
            label="Registered"
            value={registration.createdAt ? new Date(registration.createdAt).toLocaleString() : "—"}
          />
        </div>
        <div className="p-6 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  mono,
  capitalize,
}: {
  label: string
  value: string
  mono?: boolean
  capitalize?: boolean
}) {
  return (
    <div className="flex justify-between items-start gap-4">
      <dt className="text-sm text-neutral-500 shrink-0">{label}</dt>
      <dd
        className={`text-sm text-black text-right ${mono ? "font-mono" : ""} ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

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
  ecosystemTours?: boolean
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
  ecosystemTours: number
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
      "Ecosystem Tours",
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
      reg.ecosystemTours ? "Yes" : "No",
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
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-black leading-tight">
            Registrations
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-medium">
            {filteredRegistrations.length} of {registrations.length} shown
          </p>
        </div>
        <div className="flex items-center gap-2">
          {registrations.length > 0 && (
            <button
              onClick={deleteAllRegistrations}
              disabled={isDeletingAll}
              className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isDeletingAll ? "Deleting..." : "Delete All"}
            </button>
          )}
          <button
            onClick={exportToCSV}
            disabled={filteredRegistrations.length === 0}
            className="px-3 py-1.5 text-xs font-medium bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
          <StatCard label="Total" value={stats.total} />
          <StatCard
            label="Tech Day"
            value={stats.techday}
            sublabel={`${stats.activeTechday} / ${stats.limits.techday}`}
            progress={(stats.activeTechday / stats.limits.techday) * 100}
          />
          <StatCard
            label="Tech Fuel"
            value={stats.techfuel}
            sublabel={`${stats.activeTechfuel} / ${stats.limits.techfuel}`}
            progress={(stats.activeTechfuel / stats.limits.techfuel) * 100}
          />
          <StatCard label="Both Days" value={stats.bothDays} accent="blue" />
          <StatCard label="TD Only" value={stats.techdayOnly} accent="green" />
          <StatCard label="TF Only" value={stats.techfuelOnly} accent="purple" />
          <StatCard label="Eco Tours" value={stats.ecosystemTours} accent="amber" />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-neutral-200 p-3 mb-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-44">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email, company, ticket..."
              className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
            />
          </div>
          <div className="w-40">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Event
            </label>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 text-xs text-black focus:outline-none focus:border-black"
            >
              {EVENT_FILTERS.map((ef) => (
                <option key={ef.value} value={ef.value}>
                  {ef.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 text-xs text-black focus:outline-none focus:border-black"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 text-xs text-black focus:outline-none focus:border-black"
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
          <div className="p-10 text-center">
            <div className="w-5 h-5 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400">Loading registrations...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-xs text-neutral-400">No registrations found</p>
          </div>
        ) : (
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="w-[10%] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Ticket
                </th>
                <th className="w-[18%] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Name
                </th>
                <th className="w-[22%] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Email
                </th>
                <th className="w-[11%] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Category
                </th>
                <th className="w-[12%] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Event
                </th>
                <th className="w-[7%] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Tours
                </th>
                <th className="w-[10%] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Status
                </th>
                <th className="w-[9%] px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Date
                </th>
                <th className="w-[4%] px-2 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredRegistrations.map((reg) => (
                <tr
                  key={reg.id}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedRegistration(reg)}
                >
                  <td className="px-3 py-2 text-xs font-mono text-neutral-500 truncate">
                    {reg.ticketId}
                  </td>
                  <td className="px-3 py-2 truncate">
                    <span className="text-xs font-semibold text-black">{reg.firstName} {reg.lastName}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-neutral-500 truncate">
                    {reg.email}
                  </td>
                  <td className="px-3 py-2 text-xs text-neutral-500 capitalize truncate">
                    {reg.category}
                  </td>
                  <td className="px-3 py-2">
                    <EventBadge label={reg.eventLabel} />
                  </td>
                  <td className="px-3 py-2">
                    {reg.ecosystemTours ? (
                      <span className="inline-block px-1.5 py-px text-[10px] font-semibold tracking-wide leading-relaxed bg-amber-100 text-amber-700">
                        Yes
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={reg.status} />
                  </td>
                  <td className="px-3 py-2 text-xs text-neutral-400 truncate">
                    {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                  </td>
                  <td className="px-2 py-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteRegistration(reg.id)
                      }}
                      className="p-1 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  accent?: "blue" | "green" | "purple" | "amber"
}) {
  const accentColors = {
    blue: "border-blue-200 bg-blue-50/50",
    green: "border-green-200 bg-green-50/50",
    purple: "border-purple-200 bg-purple-50/50",
    amber: "border-amber-200 bg-amber-50/50",
  }
  const accentTextColors = {
    blue: "text-blue-700",
    green: "text-green-700",
    purple: "text-purple-700",
    amber: "text-amber-700",
  }

  return (
    <div className={`border p-3 ${accent ? accentColors[accent] : "border-neutral-200 bg-white"}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 leading-none mb-1.5">
        {label}
      </p>
      <p className={`text-lg font-bold leading-none ${accent ? accentTextColors[accent] : "text-black"}`}>
        {value}
      </p>
      {sublabel && (
        <p className="text-[10px] text-neutral-400 mt-1.5 leading-none font-medium">{sublabel}</p>
      )}
      {progress !== undefined && (
        <div className="mt-1.5 h-1 bg-neutral-100 rounded-full overflow-hidden">
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

  const short: Record<string, string> = {
    "Both Days": "Both",
    "Tech Day Only": "TD",
    "Tech Fuel Only": "TF",
    None: "—",
  }

  return (
    <span
      className={`inline-block px-1.5 py-px text-[10px] font-semibold tracking-wide leading-relaxed ${
        styles[label] || styles.None
      }`}
    >
      {short[label] || label}
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
      className={`inline-block px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide leading-relaxed ${
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 leading-none mb-1.5">
              Registration Details
            </p>
            <h2 className="text-base font-bold text-black leading-tight">
              {registration.firstName} {registration.lastName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-100 transition-colors rounded"
          >
            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-3">
          <DetailRow label="Ticket ID" value={registration.ticketId} mono />
          <DetailRow label="Email" value={registration.email} />
          <DetailRow label="Category" value={registration.category} capitalize />
          <DetailRow label="Company" value={registration.company || "—"} />
          <DetailRow label="Title" value={registration.title || "—"} />
          <div className="flex justify-between items-center gap-4">
            <dt className="text-xs text-neutral-400 font-medium shrink-0">Event</dt>
            <dd className="text-right">
              <EventBadge label={registration.eventLabel} />
            </dd>
          </div>
          <div className="flex justify-between items-center gap-4">
            <dt className="text-xs text-neutral-400 font-medium shrink-0">Ecosystem Tours</dt>
            <dd className="text-right">
              {registration.ecosystemTours ? (
                <span className="inline-block px-1.5 py-px text-[10px] font-semibold tracking-wide leading-relaxed bg-amber-100 text-amber-700">
                  Registered
                </span>
              ) : (
                <span className="text-xs text-neutral-400">No</span>
              )}
            </dd>
          </div>
          <DetailRow label="Status" value={registration.status} capitalize />
          <DetailRow
            label="Registered"
            value={registration.createdAt ? new Date(registration.createdAt).toLocaleString() : "—"}
          />
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
    <div className="flex justify-between items-center gap-4">
      <dt className="text-xs text-neutral-400 font-medium shrink-0">{label}</dt>
      <dd
        className={`text-xs text-black text-right leading-snug ${mono ? "font-mono text-[11px]" : ""} ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

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
  status: string
  createdAt: string
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

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)

  useEffect(() => {
    fetchRegistrations()
  }, [category, status])

  async function fetchRegistrations() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set("category", category)
      if (status) params.set("status", status)

      const response = await fetch(`/api/admin/data/registrations?${params}`)
      const data = await response.json()
      setRegistrations(data.registrations || [])
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

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
          Registrations
        </h1>
        <p className="text-sm text-neutral-500">
          {filteredRegistrations.length} registrations found
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
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
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredRegistrations.map((reg) => (
                  <tr
                    key={reg.id}
                    onClick={() => setSelectedRegistration(reg)}
                    className="hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-mono text-black">
                      {reg.ticketId}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-black">
                      {reg.firstName} {reg.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {reg.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 capitalize">
                      {reg.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {reg.company || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "—"}
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
          <DetailRow label="Events" value={registration.events?.join(", ") || "—"} />
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

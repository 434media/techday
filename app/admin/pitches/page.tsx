"use client"

import { useEffect, useState } from "react"

interface Pitch {
  id: string
  companyName: string
  founderName: string
  email: string
  website: string
  stage: string
  industry: string
  pitch: string
  problem: string
  solution: string
  traction: string
  teamSize: string
  fundingRaised: string
  fundingGoal: string
  deckUrl: string
  status: string
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
}

const STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
]

export default function PitchesPage() {
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null)

  useEffect(() => {
    fetchPitches()
  }, [status])

  async function fetchPitches() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (status) params.set("status", status)

      const response = await fetch(`/api/admin/data/pitches?${params}`, {
        credentials: "include",
      })
      const data = await response.json()
      setPitches(data.pitches || [])
    } catch (error) {
      console.error("Failed to fetch pitches:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function updatePitchStatus(id: string, newStatus: string, reviewNotes?: string) {
    try {
      const response = await fetch("/api/admin/data/pitches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, reviewNotes }),
        credentials: "include",
      })

      if (response.ok) {
        fetchPitches()
        setSelectedPitch(null)
      }
    } catch (error) {
      console.error("Failed to update pitch:", error)
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Company Name",
      "Founder Name",
      "Email",
      "Website",
      "Industry",
      "Stage",
      "Team Size",
      "Funding Raised",
      "Funding Goal",
      "Status",
      "Submitted Date",
      "Pitch Summary",
      "Problem",
      "Solution",
    ]
    const rows = pitches.map((pitch) => [
      pitch.companyName || "",
      pitch.founderName || "",
      pitch.email || "",
      pitch.website || "",
      pitch.industry || "",
      pitch.stage || "",
      pitch.teamSize || "",
      pitch.fundingRaised || "",
      pitch.fundingGoal || "",
      pitch.status || "",
      pitch.submittedAt ? new Date(pitch.submittedAt).toLocaleDateString() : "",
      pitch.pitch || "",
      pitch.problem || "",
      pitch.solution || "",
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
    a.download = `pitch-submissions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Pitch Submissions
          </h1>
          <p className="text-sm text-neutral-500">
            {pitches.length} applications
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={pitches.length === 0}
          className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="w-48">
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

      {/* Cards */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading submissions...</p>
        </div>
      ) : pitches.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-500">No pitch submissions found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pitches.map((pitch) => (
            <div
              key={pitch.id}
              onClick={() => setSelectedPitch(pitch)}
              className="bg-white border border-neutral-200 p-6 cursor-pointer hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-black truncate">
                      {pitch.companyName}
                    </h3>
                    <StatusBadge status={pitch.status} />
                  </div>
                  <p className="text-sm text-neutral-600 mb-1">
                    {pitch.founderName} · {pitch.email}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {pitch.industry} · {pitch.stage}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-neutral-400">
                    {pitch.submittedAt
                      ? new Date(pitch.submittedAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                {pitch.pitch}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedPitch && (
        <PitchDetailModal
          pitch={selectedPitch}
          onClose={() => setSelectedPitch(null)}
          onUpdateStatus={updatePitchStatus}
        />
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-neutral-200 text-neutral-600",
    reviewing: "bg-neutral-300 text-neutral-700",
    accepted: "bg-black text-white",
    rejected: "bg-neutral-100 text-neutral-400",
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

function PitchDetailModal({
  pitch,
  onClose,
  onUpdateStatus,
}: {
  pitch: Pitch
  onClose: () => void
  onUpdateStatus: (id: string, status: string, notes?: string) => void
}) {
  const [reviewNotes, setReviewNotes] = useState(pitch.reviewNotes || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    await onUpdateStatus(pitch.id, newStatus, reviewNotes)
    setIsUpdating(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-1">
              Pitch Application
            </p>
            <h2 className="text-lg font-semibold text-black">
              {pitch.companyName}
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

        <div className="p-6 space-y-6">
          {/* Company Info */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">
              Company Information
            </h3>
            <div className="space-y-2">
              <DetailRow label="Founder" value={pitch.founderName} />
              <DetailRow label="Email" value={pitch.email} />
              <DetailRow label="Website" value={pitch.website || "—"} link />
              <DetailRow label="Industry" value={pitch.industry} />
              <DetailRow label="Stage" value={pitch.stage} />
              <DetailRow label="Team Size" value={pitch.teamSize || "—"} />
            </div>
          </section>

          {/* Pitch Details */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">
              Pitch
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">{pitch.pitch}</p>
          </section>

          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">
              Problem
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">{pitch.problem}</p>
          </section>

          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">
              Solution
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed">{pitch.solution}</p>
          </section>

          {pitch.traction && (
            <section>
              <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">
                Traction
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">{pitch.traction}</p>
            </section>
          )}

          {/* Funding */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">
              Funding
            </h3>
            <div className="space-y-2">
              <DetailRow label="Raised" value={pitch.fundingRaised || "—"} />
              <DetailRow label="Goal" value={pitch.fundingGoal || "—"} />
              {pitch.deckUrl && (
                <DetailRow label="Deck" value="View Deck" link href={pitch.deckUrl} />
              )}
            </div>
          </section>

          {/* Review Notes */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-3">
              Review Notes
            </h3>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add internal notes about this application..."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black resize-none"
            />
          </section>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-neutral-200 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              onClick={() => handleStatusUpdate("accepted")}
              disabled={isUpdating || pitch.status === "accepted"}
              className="flex-1 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusUpdate("reviewing")}
              disabled={isUpdating || pitch.status === "reviewing"}
              className="flex-1 py-2 text-sm font-medium bg-neutral-200 text-black hover:bg-neutral-300 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
            >
              Mark Reviewing
            </button>
            <button
              onClick={() => handleStatusUpdate("rejected")}
              disabled={isUpdating || pitch.status === "rejected"}
              className="flex-1 py-2 text-sm font-medium border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  link,
  href,
}: {
  label: string
  value: string
  link?: boolean
  href?: string
}) {
  return (
    <div className="flex justify-between items-start gap-4">
      <dt className="text-sm text-neutral-500 shrink-0">{label}</dt>
      {link && (href || value.startsWith("http")) ? (
        <a
          href={href || value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-black underline hover:no-underline"
        >
          {value}
        </a>
      ) : (
        <dd className="text-sm text-black text-right">{value}</dd>
      )}
    </div>
  )
}

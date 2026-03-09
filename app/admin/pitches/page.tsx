"use client"

import { useEffect, useState, useRef } from "react"
import { useAdminAuth } from "@/components/admin/auth-provider"

interface PitchComment {
  id: string
  text: string
  authorEmail: string
  authorName: string
  createdAt: string
}

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
  logoUrl?: string
  comments?: PitchComment[]
}

const STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
]

export default function PitchesPage() {
  const { user } = useAdminAuth()
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null)
  const [isDeletingAll, setIsDeletingAll] = useState(false)

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

  async function deletePitch(id: string) {
    if (!confirm("Are you sure you want to delete this pitch submission?")) return

    try {
      const response = await fetch(`/api/admin/data/pitches?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        fetchPitches()
        setSelectedPitch(null)
      }
    } catch (error) {
      console.error("Failed to delete pitch:", error)
    }
  }

  async function deleteAllPitches() {
    if (!confirm("Are you sure you want to delete ALL pitch submissions? This action cannot be undone.")) return
    if (!confirm("This will permanently remove all pitch data. Are you absolutely sure?")) return

    setIsDeletingAll(true)
    try {
      const response = await fetch("/api/admin/data/pitches?id=all", {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        fetchPitches()
      }
    } catch (error) {
      console.error("Failed to delete all pitches:", error)
    } finally {
      setIsDeletingAll(false)
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
        <div className="flex items-center gap-3">
          {pitches.length > 0 && (
            <button
              onClick={deleteAllPitches}
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
            disabled={pitches.length === 0}
            className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
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
              className="bg-white border border-neutral-200 p-6 cursor-pointer hover:border-neutral-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Logo or placeholder */}
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {pitch.logoUrl ? (
                      <img src={pitch.logoUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-sm font-bold text-neutral-400">
                        {pitch.companyName?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-base font-bold text-black truncate leading-tight">
                        {pitch.companyName}
                      </h3>
                      <StatusBadge status={pitch.status} />
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {pitch.founderName} · <span className="text-neutral-400">{pitch.email}</span>
                    </p>
                    <p className="text-[13px] text-neutral-400 mt-0.5 leading-relaxed">
                      {pitch.industry} · {pitch.stage}
                      {pitch.comments && pitch.comments.length > 0 && (
                        <span className="ml-2 inline-flex items-center gap-1 text-neutral-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {pitch.comments.length}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-2">
                  <p className="text-xs text-neutral-400 leading-5">
                    {pitch.submittedAt
                      ? new Date(pitch.submittedAt).toLocaleDateString()
                      : "—"}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePitch(pitch.id)
                    }}
                    className="p-1.5 text-neutral-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete pitch"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-500 line-clamp-2 leading-relaxed">
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
          adminUser={user}
          onClose={() => setSelectedPitch(null)}
          onUpdateStatus={updatePitchStatus}
          onRefresh={fetchPitches}
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
  adminUser,
  onClose,
  onUpdateStatus,
  onRefresh,
}: {
  pitch: Pitch
  adminUser: { email: string; name: string } | null
  onClose: () => void
  onUpdateStatus: (id: string, status: string, notes?: string) => void
  onRefresh: () => void
}) {
  const [reviewNotes, setReviewNotes] = useState(pitch.reviewNotes || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [comments, setComments] = useState<PitchComment[]>(pitch.comments || [])
  const [newComment, setNewComment] = useState("")
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [logoUrl, setLogoUrl] = useState(pitch.logoUrl || "")
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const commentsEndRef = useRef<HTMLDivElement>(null)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    await onUpdateStatus(pitch.id, newStatus, reviewNotes)
    setIsUpdating(false)
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || isAddingComment) return
    setIsAddingComment(true)
    try {
      const res = await fetch("/api/admin/data/pitches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pitch.id, action: "addComment", text: newComment }),
        credentials: "include",
      })
      const data = await res.json()
      if (res.ok && data.comment) {
        setComments((prev) => [...prev, data.comment])
        setNewComment("")
        setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
      }
    } catch {
      console.error("Failed to add comment")
    } finally {
      setIsAddingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch("/api/admin/data/pitches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pitch.id, action: "deleteComment", commentId }),
        credentials: "include",
      })
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId))
      }
    } catch {
      console.error("Failed to delete comment")
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "pitch-logos")

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        console.error("Upload failed:", uploadData.error)
        return
      }

      // Save to pitch document
      const patchRes = await fetch("/api/admin/data/pitches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pitch.id, action: "updateLogo", logoUrl: uploadData.url }),
        credentials: "include",
      })

      if (patchRes.ok) {
        setLogoUrl(uploadData.url)
        onRefresh()
      }
    } catch {
      console.error("Failed to upload logo")
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleRemoveLogo = async () => {
    try {
      const res = await fetch("/api/admin/data/pitches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pitch.id, action: "updateLogo", logoUrl: "" }),
        credentials: "include",
      })
      if (res.ok) {
        setLogoUrl("")
        onRefresh()
      }
    } catch {
      console.error("Failed to remove logo")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-start justify-between sticky top-0 bg-white rounded-t-lg z-10">
          <div className="flex items-start gap-4">
            {/* Logo area */}
            <div className="relative group/logo">
              <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-neutral-300">
                    {pitch.companyName?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => logoUrl ? handleRemoveLogo() : fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border border-neutral-200 rounded-full flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity shadow-sm hover:bg-neutral-50"
                title={logoUrl ? "Remove logo" : "Upload logo"}
              >
                {isUploadingLogo ? (
                  <div className="w-3 h-3 border border-neutral-300 border-t-black rounded-full animate-spin" />
                ) : logoUrl ? (
                  <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="text-lg font-bold text-black leading-tight">
                  {pitch.companyName}
                </h2>
                <StatusBadge status={pitch.status} />
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {pitch.founderName} · {pitch.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Company Info */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Company Information
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <DetailRow label="Website" value={pitch.website || "—"} link />
              <DetailRow label="Industry" value={pitch.industry} />
              <DetailRow label="Stage" value={pitch.stage} />
              <DetailRow label="Team Size" value={pitch.teamSize || "—"} />
            </div>
          </section>

          {/* Pitch Narrative */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Pitch
            </h3>
            <p className="text-sm text-neutral-700 leading-7">{pitch.pitch}</p>
          </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Problem
              </h3>
              <p className="text-sm text-neutral-700 leading-7">{pitch.problem}</p>
            </section>
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Solution
              </h3>
              <p className="text-sm text-neutral-700 leading-7">{pitch.solution}</p>
            </section>

          {pitch.traction && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Traction
              </h3>
              <p className="text-sm text-neutral-700 leading-7">{pitch.traction}</p>
            </section>
          )}

          {/* Funding */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Funding
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <DetailRow label="Raised" value={pitch.fundingRaised || "—"} />
              <DetailRow label="Goal" value={pitch.fundingGoal || "—"} />
            </div>
            {pitch.deckUrl && (
              <a
                href={pitch.deckUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-black hover:text-neutral-600 underline underline-offset-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Pitch Deck
              </a>
            )}
          </section>

          {/* Divider */}
          <div className="border-t border-neutral-100" />

          {/* Comments Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Team Comments
                {comments.length > 0 && (
                  <span className="ml-2 text-neutral-300 normal-case tracking-normal font-medium">
                    ({comments.length})
                  </span>
                )}
              </h3>
            </div>

            {/* Comment list */}
            {comments.length > 0 ? (
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="group/comment flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-neutral-400">
                        {comment.authorName?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-black leading-tight">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-neutral-300 leading-tight">
                          {new Date(comment.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        {comment.authorEmail === adminUser?.email && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-neutral-300 hover:text-red-500 transition-colors opacity-0 group-hover/comment:opacity-100"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed mt-0.5">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>
            ) : (
              <p className="text-sm text-neutral-300 italic mb-4 leading-relaxed">
                No comments yet. Be the first to share feedback.
              </p>
            )}

            {/* Add comment */}
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-white">
                  {adminUser?.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleAddComment()
                    }
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:border-black focus:bg-white rounded-md resize-none leading-relaxed transition-colors"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-neutral-300">
                    {"\u2318"}+Enter to submit
                  </p>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isAddingComment}
                    className="px-3 py-1.5 text-xs font-semibold bg-black text-white rounded-md hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isAddingComment ? "Posting..." : "Comment"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Legacy review notes (hidden if empty, read-only) */}
          {reviewNotes && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Review Notes (Legacy)
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed bg-neutral-50 border border-neutral-100 p-3 rounded-md">
                {reviewNotes}
              </p>
            </section>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-neutral-200 sticky bottom-0 bg-white rounded-b-lg">
          <div className="flex gap-3">
            <button
              onClick={() => handleStatusUpdate("accepted")}
              disabled={isUpdating || pitch.status === "accepted"}
              className="flex-1 py-2.5 text-sm font-bold bg-black text-white rounded-md hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors leading-tight"
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusUpdate("reviewing")}
              disabled={isUpdating || pitch.status === "reviewing"}
              className="flex-1 py-2.5 text-sm font-bold bg-neutral-100 text-black rounded-md hover:bg-neutral-200 disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors leading-tight"
            >
              Reviewing
            </button>
            <button
              onClick={() => handleStatusUpdate("rejected")}
              disabled={isUpdating || pitch.status === "rejected"}
              className="flex-1 py-2.5 text-sm font-bold border border-neutral-200 text-neutral-500 rounded-md hover:bg-neutral-50 disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors leading-tight"
            >
              Reject
            </button>
          </div>
          {pitch.reviewedBy && (
            <p className="text-xs text-neutral-400 mt-3 text-center leading-relaxed">
              Last reviewed by <span className="font-medium text-neutral-500">{pitch.reviewedBy}</span>
              {pitch.reviewedAt && (
                <> on {new Date(pitch.reviewedAt).toLocaleDateString()}</>
              )}
            </p>
          )}
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
    <div>
      <dt className="text-xs font-medium text-neutral-400 mb-0.5 leading-relaxed">{label}</dt>
      {link && (href || value.startsWith("http")) ? (
        <a
          href={href || value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-black underline underline-offset-2 hover:no-underline leading-relaxed"
        >
          {value}
        </a>
      ) : (
        <dd className="text-sm font-medium text-black leading-relaxed">{value}</dd>
      )}
    </div>
  )
}

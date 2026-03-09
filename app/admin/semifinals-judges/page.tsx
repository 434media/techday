"use client"

import { useEffect, useState } from "react"

interface JudgeEntry {
  id: string
  judgeName: string
  email: string
  isCustomName: boolean
  date: string
  timeSlot: string
  submittedAt: string
}

const ZOOM_LINKS: Record<string, { url: string; meetingId: string; passcode: string }> = {
  "2026-04-02": {
    url: "https://us06web.zoom.us/j/84733840136?pwd=WfCT50nnaUvgGV9PwWe3zgAeM1nt5Y.1",
    meetingId: "847 3384 0136",
    passcode: "Techbloc",
  },
  "2026-04-03": {
    url: "https://us06web.zoom.us/j/81595831528?pwd=HnDxWd4sU0RoKezdGsZEaGS7Ajqmif.1",
    meetingId: "815 9583 1528",
    passcode: "Techbloc",
  },
}

const DATE_LABELS: Record<string, string> = {
  "2026-04-02": "Thursday, April 2, 2026",
  "2026-04-03": "Friday, April 3, 2026",
}

const SLOT_ORDER = ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "1:00 PM - 2:30 PM"]

const ALL_DATES = ["2026-04-02", "2026-04-03"] as const

const SLOTS_PER_DATE: Record<string, string[]> = {
  "2026-04-02": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "1:00 PM - 2:30 PM"],
  "2026-04-03": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM"],
}

export default function AdminJudgeSchedulingPage() {
  const [judges, setJudges] = useState<JudgeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ judgeName: "", email: "", date: "", timeSlot: "" })
  const [addError, setAddError] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function fetchJudges() {
    try {
      const res = await fetch("/api/admin/data/semifinals-judges", { credentials: "include" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error("Failed to fetch judges:", err.error || res.statusText)
        return
      }
      const data = await res.json()
      setJudges(data.judges || [])
    } catch {
      console.error("Failed to fetch judges")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchJudges() }, [])

  async function handleAddJudge(e: React.FormEvent) {
    e.preventDefault()
    setAddError("")

    if (!addForm.judgeName.trim() || !addForm.date || !addForm.timeSlot) {
      setAddError("All fields are required")
      return
    }

    setIsAdding(true)
    try {
      const res = await fetch("/api/admin/data/semifinals-judges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addForm),
      })
      const data = await res.json()
      if (!res.ok) {
        setAddError(data.error || "Failed to add judge")
        return
      }
      setJudges((prev) => [...prev, data.judge])
      setShowAddModal(false)
      setAddForm({ judgeName: "", email: "", date: "", timeSlot: "" })
      showToast(`${data.judge.judgeName} added successfully`)
    } catch {
      setAddError("Failed to add judge")
    } finally {
      setIsAdding(false)
    }
  }

  async function handleRemoveJudge(judge: JudgeEntry) {
    if (!confirm(`Remove ${judge.judgeName} from ${DATE_LABELS[judge.date]} at ${judge.timeSlot}?`)) return

    setRemovingId(judge.id)
    try {
      const res = await fetch(`/api/admin/data/semifinals-judges?id=${judge.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        showToast("Failed to remove judge", "error")
        return
      }
      setJudges((prev) => prev.filter((j) => j.id !== judge.id))
      showToast(`${judge.judgeName} removed`)
    } catch {
      showToast("Failed to remove judge", "error")
    } finally {
      setRemovingId(null)
    }
  }

  async function handleSendEmail(judge: JudgeEntry) {
    if (!judge.email) {
      showToast("No email address for this judge", "error")
      return
    }

    setSendingEmailId(judge.id)
    try {
      const res = await fetch("/api/admin/data/semifinals-judges", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: judge.email,
          judgeName: judge.judgeName,
          date: judge.date,
          timeSlot: judge.timeSlot,
        }),
      })
      if (!res.ok) {
        showToast("Failed to send email", "error")
        return
      }
      showToast(`Email sent to ${judge.email}`)
    } catch {
      showToast("Failed to send email", "error")
    } finally {
      setSendingEmailId(null)
    }
  }

  // Group judges by date and time slot
  const grouped: Record<string, Record<string, JudgeEntry[]>> = {}
  for (const date of ALL_DATES) {
    grouped[date] = {}
    for (const slot of SLOT_ORDER) {
      grouped[date][slot] = judges.filter(
        (j) => j.date === date && j.timeSlot === slot
      )
    }
  }

  const totalJudges = judges.length

  return (
    <div className="p-8 lg:p-12">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-md shadow-lg text-sm font-medium leading-5 transition-all ${
          toast.type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
            Tech Fuel Semi-Finals
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-black leading-tight">
            Judge Scheduling
          </h1>
          <p className="text-neutral-500 mt-2 text-[15px] leading-relaxed">
            {totalJudges} judge{totalJudges !== 1 ? "s" : ""} confirmed across {ALL_DATES.length} days
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-md hover:bg-neutral-800 transition-colors leading-5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Judge
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-neutral-100 animate-pulse rounded" />
          ))}
        </div>
      ) : (
        <div className="space-y-14">
          {ALL_DATES.map((date) => {
            const zoom = ZOOM_LINKS[date]
            const slots = SLOTS_PER_DATE[date]

            return (
              <div key={date}>
                {/* Date Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-black mb-3 leading-tight">
                    {DATE_LABELS[date]}
                  </h2>

                  {/* Zoom Info Card */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <div className="text-sm leading-relaxed">
                        <p className="font-bold text-blue-900 mb-1">Zoom Meeting</p>
                        <p className="text-blue-800 leading-5">
                          <a href={zoom.url} target="_blank" rel="noopener noreferrer" className="underline break-all">
                            {zoom.url}
                          </a>
                        </p>
                        <p className="text-blue-700 mt-1.5 leading-5">
                          Meeting ID: <span className="font-mono font-semibold">{zoom.meetingId}</span>
                          {" "} | Passcode: <span className="font-mono font-semibold">{zoom.passcode}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-5">
                  {slots.map((slot) => {
                    const slotJudges = grouped[date]?.[slot] || []
                    return (
                      <div
                        key={slot}
                        className="bg-white border border-neutral-200 rounded-md p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-mono font-bold text-black text-[15px] leading-5">
                            {slot}
                          </h3>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full leading-4 ${
                            slotJudges.length >= 5
                              ? "bg-red-100 text-red-700"
                              : slotJudges.length >= 3
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                          }`}>
                            {slotJudges.length}/5 judges
                          </span>
                        </div>

                        {slotJudges.length === 0 ? (
                          <p className="text-sm text-neutral-400 italic leading-5">
                            No judges assigned yet
                          </p>
                        ) : (
                          <div className="divide-y divide-neutral-100">
                            {slotJudges.map((judge) => (
                              <div
                                key={judge.id}
                                className="py-3 flex items-center justify-between gap-3"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="text-[14px] font-semibold text-black leading-5">
                                    {judge.judgeName}
                                    {judge.isCustomName && (
                                      <span className="ml-2 text-[11px] text-neutral-400 font-normal tracking-wide">(custom)</span>
                                    )}
                                  </p>
                                  {judge.email && (
                                    <p className="text-[13px] text-neutral-500 leading-5 mt-0.5 truncate">{judge.email}</p>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {/* Send Email */}
                                  <button
                                    onClick={() => handleSendEmail(judge)}
                                    disabled={sendingEmailId === judge.id || !judge.email}
                                    title={judge.email ? `Send confirmation to ${judge.email}` : "No email address"}
                                    className={`p-2 rounded-md transition-colors ${
                                      !judge.email
                                        ? "text-neutral-300 cursor-not-allowed"
                                        : sendingEmailId === judge.id
                                          ? "text-blue-400 bg-blue-50"
                                          : "text-neutral-400 hover:text-blue-600 hover:bg-blue-50"
                                    }`}
                                  >
                                    {sendingEmailId === judge.id ? (
                                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                    )}
                                  </button>

                                  {/* Remove */}
                                  <button
                                    onClick={() => handleRemoveJudge(judge)}
                                    disabled={removingId === judge.id}
                                    title={`Remove ${judge.judgeName}`}
                                    className={`p-2 rounded-md transition-colors ${
                                      removingId === judge.id
                                        ? "text-red-400 bg-red-50"
                                        : "text-neutral-400 hover:text-red-600 hover:bg-red-50"
                                    }`}
                                  >
                                    {removingId === judge.id ? (
                                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Judge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-black leading-tight">Add Judge</h3>
              <button
                onClick={() => { setShowAddModal(false); setAddError("") }}
                className="p-1 text-neutral-400 hover:text-black transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddJudge} className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5 leading-5">
                  Judge Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.judgeName}
                  onChange={(e) => setAddForm((f) => ({ ...f, judgeName: e.target.value }))}
                  placeholder="Full name"
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-md text-[14px] leading-5 text-black focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5 leading-5">
                  Email
                </label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="judge@example.com"
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-md text-[14px] leading-5 text-black focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-[11px] text-neutral-400 mt-1 leading-4">Required to send confirmation email</p>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5 leading-5">
                  Date <span className="text-red-500">*</span>
                </label>
                <select
                  value={addForm.date}
                  onChange={(e) => setAddForm((f) => ({ ...f, date: e.target.value, timeSlot: "" }))}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-md text-[14px] leading-5 text-black focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Select a date...</option>
                  {ALL_DATES.map((d) => (
                    <option key={d} value={d}>{DATE_LABELS[d]}</option>
                  ))}
                </select>
              </div>

              {addForm.date && (
                <div>
                  <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5 leading-5">
                    Time Slot <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.timeSlot}
                    onChange={(e) => setAddForm((f) => ({ ...f, timeSlot: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-md text-[14px] leading-5 text-black focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select a time...</option>
                    {SLOTS_PER_DATE[addForm.date]?.map((s) => {
                      const count = grouped[addForm.date]?.[s]?.length || 0
                      return (
                        <option key={s} value={s}>
                          {s} ({count}/5 judges)
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              {addError && (
                <p className="text-sm text-red-600 font-medium leading-5">{addError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setAddError("") }}
                  className="flex-1 py-2.5 border border-neutral-300 rounded-md text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors leading-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex-1 py-2.5 bg-black text-white rounded-md text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 leading-5"
                >
                  {isAdding ? "Adding..." : "Add Judge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

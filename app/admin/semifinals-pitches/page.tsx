"use client"

import { useEffect, useState } from "react"

interface PitchEntry {
  id: string
  companyName: string
  founderName: string
  email: string
  date: string
  judgeBlock: string
  pitchSlot: string
  submittedAt: string
}

interface AcceptedPitch {
  id: string
  companyName: string
  founderName: string
  email: string
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

const ALL_DATES = ["2026-04-02", "2026-04-03"] as const

const JUDGE_BLOCKS_PER_DATE: Record<string, string[]> = {
  "2026-04-02": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "1:00 PM - 2:30 PM"],
  "2026-04-03": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM"],
}

const PITCH_SLOTS: Record<string, string[]> = {
  "9:00 AM - 10:30 AM": [
    "9:05 AM - 9:15 AM",
    "9:20 AM - 9:30 AM",
    "9:35 AM - 9:45 AM",
    "9:50 AM - 10:00 AM",
    "10:05 AM - 10:15 AM",
  ],
  "11:00 AM - 12:30 PM": [
    "11:05 AM - 11:15 AM",
    "11:20 AM - 11:30 AM",
    "11:35 AM - 11:45 AM",
    "11:50 AM - 12:00 PM",
    "12:05 PM - 12:15 PM",
  ],
  "1:00 PM - 2:30 PM": [
    "1:05 PM - 1:15 PM",
    "1:20 PM - 1:30 PM",
    "1:35 PM - 1:45 PM",
    "1:50 PM - 2:00 PM",
    "2:05 PM - 2:15 PM",
  ],
}

export default function AdminPitchSchedulingPage() {
  const [pitches, setPitches] = useState<PitchEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ companyName: "", founderName: "", email: "", date: "", judgeBlock: "", pitchSlot: "" })
  const [addError, setAddError] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [acceptedPitches, setAcceptedPitches] = useState<AcceptedPitch[]>([])
  const [emailPromptPitch, setEmailPromptPitch] = useState<PitchEntry | null>(null)
  const [isSendingCongrats, setIsSendingCongrats] = useState(false)
  const [companySearch, setCompanySearch] = useState("")
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)
  const [previewEmailPitch, setPreviewEmailPitch] = useState<PitchEntry | null>(null)

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function fetchPitches() {
    try {
      const res = await fetch("/api/admin/data/semifinals-pitches", { credentials: "include" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error("Failed to fetch pitches:", err.error || res.statusText)
        return
      }
      const data = await res.json()
      setPitches(data.pitches || [])
    } catch {
      console.error("Failed to fetch pitches")
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchAcceptedPitches() {
    try {
      const res = await fetch("/api/admin/data/pitches", { credentials: "include" })
      if (!res.ok) return
      const data = await res.json()
      setAcceptedPitches(
        (data.pitches || []).map((p: Record<string, string>) => ({
          id: p.id,
          companyName: p.companyName,
          founderName: p.founderName,
          email: p.email,
        }))
      )
    } catch {
      console.error("Failed to fetch pitch submissions")
    }
  }

  useEffect(() => { fetchPitches(); fetchAcceptedPitches() }, [])

  async function handleAddPitch(e: React.FormEvent) {
    e.preventDefault()
    setAddError("")

    if (!addForm.companyName.trim() || !addForm.founderName.trim() || !addForm.date || !addForm.judgeBlock || !addForm.pitchSlot) {
      setAddError("All fields except email are required")
      return
    }

    setIsAdding(true)
    try {
      const res = await fetch("/api/admin/data/semifinals-pitches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addForm),
      })
      const data = await res.json()
      if (!res.ok) {
        setAddError(data.error || "Failed to add pitch")
        return
      }
      setPitches((prev) => [...prev, data.pitch])
      setShowAddModal(false)
      setAddForm({ companyName: "", founderName: "", email: "", date: "", judgeBlock: "", pitchSlot: "" })
      if (data.emailSent) {
        showToast(`${data.pitch.companyName} added — notification email sent to ${data.pitch.email}`)
      } else {
        showToast(`${data.pitch.companyName} added successfully`)
      }
      if (data.pitch.email) {
        setEmailPromptPitch(data.pitch)
      }
    } catch {
      setAddError("Failed to add pitch")
    } finally {
      setIsAdding(false)
    }
  }

  async function handleRemovePitch(pitch: PitchEntry) {
    if (!confirm(`Remove ${pitch.companyName} from ${pitch.pitchSlot} on ${DATE_LABELS[pitch.date]}?`)) return

    setRemovingId(pitch.id)
    try {
      const res = await fetch(`/api/admin/data/semifinals-pitches?id=${pitch.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        showToast("Failed to remove pitch", "error")
        return
      }
      setPitches((prev) => prev.filter((p) => p.id !== pitch.id))
      showToast(`${pitch.companyName} removed`)
    } catch {
      showToast("Failed to remove pitch", "error")
    } finally {
      setRemovingId(null)
    }
  }

  async function handleSendEmail(pitch: PitchEntry) {
    if (!pitch.email) {
      showToast("No email address for this pitch", "error")
      return
    }

    setSendingEmailId(pitch.id)
    try {
      const res = await fetch("/api/admin/data/semifinals-pitches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: pitch.email,
          companyName: pitch.companyName,
          founderName: pitch.founderName,
          date: pitch.date,
          pitchSlot: pitch.pitchSlot,
          judgeBlock: pitch.judgeBlock,
        }),
      })
      if (!res.ok) {
        showToast("Failed to send email", "error")
        return
      }
      showToast(`Email sent to ${pitch.email}`)
    } catch {
      showToast("Failed to send email", "error")
    } finally {
      setSendingEmailId(null)
    }
  }

  // Group pitches by date → block → slot
  const grouped: Record<string, Record<string, Record<string, PitchEntry | null>>> = {}
  for (const date of ALL_DATES) {
    grouped[date] = {}
    const blocks = JUDGE_BLOCKS_PER_DATE[date] || []
    for (const block of blocks) {
      grouped[date][block] = {}
      const slots = PITCH_SLOTS[block] || []
      for (const slot of slots) {
        const match = pitches.find(
          (p) => p.date === date && p.judgeBlock === block && p.pitchSlot === slot
        )
        grouped[date][block][slot] = match || null
      }
    }
  }

  const totalPitches = pitches.length

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
            Pitch Scheduling
          </h1>
          <p className="text-neutral-500 mt-2 text-[15px] leading-relaxed">
            {totalPitches} pitch{totalPitches !== 1 ? "es" : ""} scheduled across {ALL_DATES.length} days
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-md hover:bg-neutral-800 transition-colors leading-5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Semifinalist
          </button>
        </div>
      </div>

      {/* Email Preview for Selected Semifinalist */}
      {previewEmailPitch && (() => {
        const zoom = ZOOM_LINKS[previewEmailPitch.date]
        return (
          <div className="mb-10 bg-white border border-neutral-200 rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <div>
                <h3 className="text-sm font-bold text-black leading-5">Email Preview — {previewEmailPitch.companyName}</h3>
                <p className="text-[12px] text-neutral-400 mt-0.5 leading-4">
                  From: Beto Altamirano &lt;ceo@send.satechbloc.com&gt; • Reply-To: ceo@satechbloc.com
                </p>
                <p className="text-[12px] text-neutral-400 mt-0.5 leading-4">
                  To: {previewEmailPitch.email || "No email on file"} • {previewEmailPitch.founderName}
                </p>
              </div>
              <button
                onClick={() => setPreviewEmailPitch(null)}
                className="p-1.5 text-neutral-400 hover:text-black transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Simulated email */}
            <div className="bg-neutral-50 p-5">
              <div className="bg-white rounded-md border border-neutral-200 max-w-lg mx-auto overflow-hidden shadow-sm">
                {/* Email header */}
                <div className="bg-[#0a0a0a] p-6 text-center">
                  <p className="text-white font-bold text-lg">TECH FUEL <span className="text-[#c73030]">2026</span></p>
                  <p className="text-white/60 text-[11px] font-mono mt-1 tracking-wider">April 20, 2026 • 2:00–6:00 PM • UTSA SP1</p>
                </div>
                {/* Email body */}
                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-[#0a0a0a]">Hey {previewEmailPitch.founderName},</h2>
                  <p className="text-[14px] text-neutral-600 leading-relaxed">
                    <strong>{previewEmailPitch.companyName}</strong> has been selected as a <strong>2026 TechFuel Semi-Finalist!</strong>
                  </p>
                  <p className="text-[14px] text-neutral-600 leading-relaxed">
                    We reviewed a strong pool of applicants, and your company stood out. We&apos;re looking forward to learning more about what you&apos;re building.
                  </p>
                  <p className="text-[14px] text-neutral-600 leading-relaxed">
                    As part of the next round, you&apos;ll pitch live via Zoom to a panel of five judges. The format will be a <strong>5-minute pitch</strong> followed by a <strong>5-minute Q&A</strong>.
                  </p>
                  {/* Session card */}
                  <div className="bg-[#0a0a0a] rounded-lg p-5 text-white">
                    <p className="text-[#c73030] text-[10px] font-mono tracking-widest uppercase mb-3">Your Semi-Finals Interview</p>
                    <div className="grid grid-cols-2 gap-3 text-[13px]">
                      <div>
                        <p className="text-white/50 text-[10px] uppercase tracking-wide">Date</p>
                        <p className="font-medium">{DATE_LABELS[previewEmailPitch.date]}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-[10px] uppercase tracking-wide">Pitch Time</p>
                        <p className="font-mono font-medium">{previewEmailPitch.pitchSlot}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-[10px] uppercase tracking-wide">Company</p>
                        <p className="font-medium">{previewEmailPitch.companyName}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-[10px] uppercase tracking-wide">Format</p>
                        <p className="font-medium">5 min pitch + 5 min Q&A</p>
                      </div>
                    </div>
                  </div>
                  {/* Zoom details */}
                  {zoom && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="font-semibold text-blue-900 text-[13px] mb-2">📹 Zoom Meeting Details</p>
                      <p className="text-[13px] text-blue-800 break-all">{zoom.url}</p>
                      <p className="text-[12px] text-blue-700 mt-2">
                        Meeting ID: <span className="font-mono font-semibold">{zoom.meetingId}</span>
                        {" "} | Passcode: <span className="font-mono font-semibold">{zoom.passcode}</span>
                      </p>
                    </div>
                  )}
                  {/* Closing */}
                  <p className="text-[14px] text-neutral-600 leading-relaxed">
                    If you have any questions, feel free to reply directly to this email.
                  </p>
                  <p className="text-[14px] text-neutral-600">We look forward to your pitch.</p>
                  <p className="text-[14px] text-neutral-600">Best,</p>
                  {/* Signature */}
                  <div className="pt-2">
                    <p className="text-[15px] font-semibold text-[#0a0a0a]">Beto Altamirano</p>
                    <p className="text-[13px] text-neutral-500">CEO, Tech Bloc</p>
                  </div>
                </div>
                {/* Email footer */}
                <div className="bg-[#0a0a0a] p-4 text-center">
                  <p className="text-white/40 text-[11px]">© 2026 Tech Bloc & 434 MEDIA • San Antonio, TX</p>
                </div>
              </div>
            </div>
            {/* Send button */}
            <div className="p-5 border-t border-neutral-100 flex items-center justify-between gap-3">
              <p className="text-[12px] text-neutral-400">
                Subject: TechFuel 2026 Application Update
              </p>
              <button
                onClick={() => {
                  if (previewEmailPitch.email) {
                    handleSendEmail(previewEmailPitch)
                  } else {
                    showToast("No email address for this pitch", "error")
                  }
                }}
                disabled={sendingEmailId === previewEmailPitch.id || !previewEmailPitch.email}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed leading-5 shrink-0"
              >
                {sendingEmailId === previewEmailPitch.id ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        )
      })()}

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
            const blocks = JUDGE_BLOCKS_PER_DATE[date] || []

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

                {/* Judge Blocks */}
                <div className="space-y-6">
                  {blocks.map((block) => {
                    const slots = PITCH_SLOTS[block] || []
                    const filledCount = slots.filter(
                      (s) => grouped[date]?.[block]?.[s] !== null
                    ).length

                    return (
                      <div
                        key={block}
                        className="bg-white border border-neutral-200 rounded-md p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-mono font-bold text-black text-[15px] leading-5">
                              {block}
                            </h3>
                            <p className="text-[12px] text-neutral-400 mt-0.5 leading-4">Judge Block</p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full leading-4 ${
                            filledCount >= slots.length
                              ? "bg-red-100 text-red-700"
                              : filledCount >= 3
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                          }`}>
                            {filledCount}/{slots.length} filled
                          </span>
                        </div>

                        <div className="divide-y divide-neutral-100">
                          {slots.map((slot) => {
                            const pitch = grouped[date]?.[block]?.[slot]
                            return (
                              <div
                                key={slot}
                                className={`py-3 flex items-center justify-between gap-3 ${
                                  !pitch ? "cursor-pointer hover:bg-neutral-50 -mx-2 px-2 rounded-md transition-colors" : ""
                                }`}
                                onClick={() => {
                                  if (!pitch) {
                                    setAddForm({
                                      companyName: "",
                                      founderName: "",
                                      email: "",
                                      date,
                                      judgeBlock: block,
                                      pitchSlot: slot,
                                    })
                                    setAddError("")
                                    setShowAddModal(true)
                                  }
                                }}
                              >
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                  <p className="font-mono text-[13px] font-semibold text-neutral-500 leading-5 shrink-0 w-35">
                                    {slot}
                                  </p>
                                  {pitch ? (
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[14px] font-semibold text-black leading-5">
                                        {pitch.companyName}
                                      </p>
                                      <p className="text-[12px] text-neutral-400 leading-4 mt-0.5 truncate">
                                        {pitch.founderName}{pitch.email ? ` — ${pitch.email}` : ""}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-[13px] text-neutral-300 italic leading-5 flex items-center gap-1.5">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                      Click to add semifinalist
                                    </p>
                                  )}
                                </div>

                                {pitch && (
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {/* Preview Email */}
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setPreviewEmailPitch(pitch) }}
                                      disabled={!pitch.email}
                                      title={pitch.email ? `Preview email for ${pitch.companyName}` : "No email address"}
                                      className={`p-2 rounded-md transition-colors ${
                                        !pitch.email
                                          ? "text-neutral-300 cursor-not-allowed"
                                          : previewEmailPitch?.id === pitch.id
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-neutral-400 hover:text-blue-600 hover:bg-blue-50"
                                      }`}
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                    </button>

                                    {/* Remove */}
                                    <button
                                      onClick={() => handleRemovePitch(pitch)}
                                      disabled={removingId === pitch.id}
                                      title={`Remove ${pitch.companyName}`}
                                      className={`p-2 rounded-md transition-colors ${
                                        removingId === pitch.id
                                          ? "text-red-400 bg-red-50"
                                          : "text-neutral-400 hover:text-red-600 hover:bg-red-50"
                                      }`}
                                    >
                                      {removingId === pitch.id ? (
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
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Semifinalist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-black leading-tight">Add Semifinalist to Schedule</h3>
              <button
                onClick={() => { setShowAddModal(false); setAddError("") }}
                className="p-1 text-neutral-400 hover:text-black transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddPitch} className="p-6 space-y-5">
              {/* Company Search Dropdown */}
              <div className="relative">
                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5 leading-5">
                  Select Pitch Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.companyName ? `${addForm.companyName}` : companySearch}
                  onChange={(e) => {
                    setCompanySearch(e.target.value)
                    setAddForm((f) => ({ ...f, companyName: "", founderName: "", email: "" }))
                    setShowCompanyDropdown(true)
                  }}
                  onFocus={() => setShowCompanyDropdown(true)}
                  placeholder="Search companies..."
                  className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-md text-[14px] leading-5 text-black focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  autoComplete="off"
                />
                {addForm.companyName && (
                  <button
                    type="button"
                    onClick={() => {
                      setAddForm((f) => ({ ...f, companyName: "", founderName: "", email: "" }))
                      setCompanySearch("")
                      setShowCompanyDropdown(true)
                    }}
                    className="absolute right-3 top-8.5 p-0.5 text-neutral-400 hover:text-black"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {showCompanyDropdown && !addForm.companyName && (() => {
                  const available = acceptedPitches
                    .filter((ap) => !pitches.some((p) => p.companyName === ap.companyName))
                    .filter((ap) =>
                      !companySearch ||
                      ap.companyName.toLowerCase().includes(companySearch.toLowerCase()) ||
                      ap.founderName.toLowerCase().includes(companySearch.toLowerCase())
                    )
                    .sort((a, b) => a.companyName.localeCompare(b.companyName))
                  return (
                    <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {available.length === 0 ? (
                        <p className="px-3.5 py-3 text-[13px] text-neutral-400 italic">No matching companies</p>
                      ) : (
                        available.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setAddForm((f) => ({
                                ...f,
                                companyName: p.companyName,
                                founderName: p.founderName,
                                email: p.email || "",
                              }))
                              setCompanySearch("")
                              setShowCompanyDropdown(false)
                            }}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0"
                          >
                            <p className="text-[13px] font-semibold text-black leading-5 truncate">{p.companyName}</p>
                            <p className="text-[11px] text-neutral-400 leading-4 truncate">{p.founderName}{p.email ? ` — ${p.email}` : ""}</p>
                          </button>
                        ))
                      )}
                    </div>
                  )
                })()}
                <p className="text-[11px] text-neutral-400 mt-1 leading-4">
                  {acceptedPitches.filter((ap) => !pitches.some((p) => p.companyName === ap.companyName)).length} of {acceptedPitches.length} pitch submissions available
                </p>
              </div>

              {/* Auto-filled details */}
              {addForm.companyName && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wide w-20">Founder</span>
                    <span className="text-[14px] text-black font-medium">{addForm.founderName || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wide w-20">Email</span>
                    <span className="text-[14px] text-black font-medium">{addForm.email || <span className="text-neutral-400 italic">No email on file</span>}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5 leading-5">
                  Date <span className="text-red-500">*</span>
                </label>
                <select
                  value={addForm.date}
                  onChange={(e) => setAddForm((f) => ({ ...f, date: e.target.value, judgeBlock: "", pitchSlot: "" }))}
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
                    Judge Block <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.judgeBlock}
                    onChange={(e) => setAddForm((f) => ({ ...f, judgeBlock: e.target.value, pitchSlot: "" }))}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-md text-[14px] leading-5 text-black focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select a block...</option>
                    {JUDGE_BLOCKS_PER_DATE[addForm.date]?.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              {addForm.judgeBlock && (
                <div>
                  <label className="block text-[13px] font-semibold text-neutral-700 mb-1.5 leading-5">
                    Pitch Slot <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.pitchSlot}
                    onChange={(e) => setAddForm((f) => ({ ...f, pitchSlot: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-md text-[14px] leading-5 text-black focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select a slot...</option>
                    {PITCH_SLOTS[addForm.judgeBlock]?.map((s) => {
                      const taken = pitches.some(
                        (p) => p.date === addForm.date && p.judgeBlock === addForm.judgeBlock && p.pitchSlot === s
                      )
                      return (
                        <option key={s} value={s} disabled={taken}>
                          {s}{taken ? " (taken)" : ""}
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
                  {isAdding ? "Adding..." : "Add to Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Congrats Email Prompt */}
      {emailPromptPitch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black leading-tight">
                    {emailPromptPitch.companyName} Scheduled
                  </h3>
                  <p className="text-[13px] text-neutral-500 mt-0.5 leading-5">
                    {DATE_LABELS[emailPromptPitch.date]} at {emailPromptPitch.pitchSlot}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-5">
                <p className="text-[13px] text-blue-900 leading-5">
                  <strong>Semi-finalist notification was auto-sent</strong> to <strong>{emailPromptPitch.founderName}</strong> at{" "}
                  <span className="font-mono">{emailPromptPitch.email}</span> with their assigned pitch time, Zoom details, and Beto&apos;s signature.
                </p>
              </div>

              {/* Preview of email content */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4 mb-5 text-[12px] text-neutral-600 space-y-1.5">
                <p className="font-semibold text-neutral-700 text-[13px]">Email included:</p>
                <p>Subject: TechFuel 2026 Application Update</p>
                <p>Semi-finalist selection notification</p>
                <p>Pitch time: <span className="font-mono font-semibold text-black">{emailPromptPitch.pitchSlot}</span></p>
                <p>Date: <span className="font-semibold text-black">{DATE_LABELS[emailPromptPitch.date]}</span></p>
                <p>Zoom link, Meeting ID &amp; Passcode</p>
                <p>Signed by Beto Altamirano, CEO, Tech Bloc</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEmailPromptPitch(null)}
                  className="flex-1 py-2.5 border border-neutral-300 rounded-md text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors leading-5"
                >
                  Skip
                </button>
                <button
                  onClick={async () => {
                    setIsSendingCongrats(true)
                    try {
                      const res = await fetch("/api/admin/data/semifinals-pitches", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                          email: emailPromptPitch.email,
                          companyName: emailPromptPitch.companyName,
                          founderName: emailPromptPitch.founderName,
                          date: emailPromptPitch.date,
                          pitchSlot: emailPromptPitch.pitchSlot,
                          judgeBlock: emailPromptPitch.judgeBlock,
                        }),
                      })
                      if (!res.ok) {
                        showToast("Failed to send email", "error")
                      } else {
                        showToast(`Congrats email sent to ${emailPromptPitch.email}`)
                      }
                    } catch {
                      showToast("Failed to send email", "error")
                    } finally {
                      setIsSendingCongrats(false)
                      setEmailPromptPitch(null)
                    }
                  }}
                  disabled={isSendingCongrats}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 leading-5 flex items-center justify-center gap-2"
                >
                  {isSendingCongrats ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Congrats Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

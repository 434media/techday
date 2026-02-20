"use client"

import { useEffect, useState } from "react"

type SessionType = "keynote" | "talk" | "workshop" | "panel" | "break" | "networking"
type TrackType = "emerging" | "founders" | "ai" | ""

interface Speaker {
  id: string
  name: string
  title: string
  company: string
  imageUrl: string
}

interface Session {
  id: string
  title: string
  description: string
  time: string
  duration: number
  room: string
  moderatorIds?: string[]
  speakerIds?: string[]
  type: SessionType
  track?: TrackType
}

const SESSION_TYPES: { value: SessionType; label: string }[] = [
  { value: "keynote", label: "Keynote" },
  { value: "talk", label: "Talk" },
  { value: "workshop", label: "Workshop" },
  { value: "panel", label: "Panel" },
  { value: "break", label: "Break" },
  { value: "networking", label: "Networking" },
]

const TRACKS: { value: TrackType; label: string }[] = [
  { value: "", label: "No Track" },
  { value: "emerging", label: "Emerging Industries" },
  { value: "founders", label: "Founders & Investors" },
  { value: "ai", label: "AI" },
]

const EMPTY_SESSION: Session = {
  id: "",
  title: "",
  description: "",
  time: "09:00",
  duration: 30,
  room: "",
  moderatorIds: [],
  speakerIds: [],
  type: "talk",
  track: "",
}

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)

  useEffect(() => {
    fetchSessions()
    fetchSpeakers()
  }, [])

  async function fetchSpeakers() {
    try {
      const response = await fetch("/api/admin/content/speakers", {
        credentials: "include",
      })
      const data = await response.json()
      setSpeakers(data.speakers || [])
    } catch (error) {
      console.error("Failed to fetch speakers:", error)
    }
  }

  async function fetchSessions() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/content/schedule", {
        credentials: "include",
      })
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function saveSession(session: Session) {
    const isNew = !session.id || isCreating
    const method = isNew ? "POST" : "PUT"

    try {
      const response = await fetch("/api/admin/content/schedule", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
        credentials: "include",
      })

      if (response.ok) {
        fetchSessions()
        setEditingSession(null)
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Failed to save session:", error)
    }
  }

  async function deleteSession(id: string) {
    if (!confirm("Are you sure you want to delete this session?")) return

    try {
      const response = await fetch(`/api/admin/content/schedule?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        fetchSessions()
      }
    } catch (error) {
      console.error("Failed to delete session:", error)
    }
  }

  async function deleteAllSessions() {
    if (!confirm("Are you sure you want to delete ALL sessions? This action cannot be undone.")) return
    if (!confirm("This will permanently remove all session data. Are you absolutely sure?")) return

    setIsDeletingAll(true)
    try {
      const response = await fetch("/api/admin/content/schedule?id=all", {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        fetchSessions()
      }
    } catch (error) {
      console.error("Failed to delete all sessions:", error)
    } finally {
      setIsDeletingAll(false)
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Schedule
          </h1>
          <p className="text-sm text-neutral-500">
            Manage conference sessions
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          {sessions.length > 0 && (
            <button
              onClick={deleteAllSessions}
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
            onClick={() => {
              setIsCreating(true)
              setEditingSession({ ...EMPTY_SESSION })
            }}
            className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 transition-colors"
          >
            Add Session
          </button>
        </div>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading schedule...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-500 mb-4">No sessions added yet</p>
          <button
            onClick={() => {
              setIsCreating(true)
              setEditingSession({ ...EMPTY_SESSION })
            }}
            className="text-sm font-medium text-black underline hover:no-underline"
          >
            Add your first session
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => {
            const sessionModerators = speakers.filter((s) => session.moderatorIds?.includes(s.id))
            const sessionSpeakers = speakers.filter((s) => session.speakerIds?.includes(s.id))
            return (
              <div
                key={session.id}
                className="bg-white border border-neutral-200 p-4 hover:border-neutral-300 transition-colors"
              >
                {/* Mobile/Tablet Layout */}
                <div className="flex flex-col gap-3 lg:hidden">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-neutral-500">
                          {formatTime(session.time)} · {session.duration} min
                        </span>
                        <TypeBadge type={session.type} />
                        {session.track && <TrackBadge track={session.track} />}
                      </div>
                      <h3 className="text-sm font-semibold text-black line-clamp-2">
                        {session.title}
                      </h3>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setIsCreating(false)
                          setEditingSession(session)
                        }}
                        className="p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors rounded"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {session.description && (
                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {session.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    {session.room && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {session.room}
                      </span>
                    )}
                    {sessionModerators.length > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Mod: {sessionModerators.map(s => s.name).join(", ")}
                      </span>
                    )}
                    {sessionSpeakers.length > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {sessionSpeakers.map(s => s.name).join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center gap-4">
                  <div className="w-20 shrink-0">
                    <p className="text-sm font-medium text-black">
                      {formatTime(session.time)}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {session.duration} min
                    </p>
                  </div>
                  <div className="flex-1 min-w-0 max-w-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-black truncate max-w-xs">
                        {session.title}
                      </h3>
                      <TypeBadge type={session.type} />
                      {session.track && <TrackBadge track={session.track} />}
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-1 max-w-md">
                      {session.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 mt-1.5">
                      {session.room && (
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {session.room}
                        </span>
                      )}
                      {sessionModerators.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5">Mod</span>
                          <div className="flex -space-x-1.5">
                            {sessionModerators.slice(0, 3).map((speaker) => (
                              speaker.imageUrl ? (
                                <img
                                  key={speaker.id}
                                  src={speaker.imageUrl}
                                  alt={speaker.name}
                                  title={`Moderator: ${speaker.name}`}
                                  className="w-5 h-5 rounded-full object-cover border border-white bg-neutral-100"
                                />
                              ) : (
                                <div
                                  key={speaker.id}
                                  title={`Moderator: ${speaker.name}`}
                                  className="w-5 h-5 rounded-full bg-amber-100 border border-white flex items-center justify-center text-[9px] font-medium text-amber-600"
                                >
                                  {speaker.name.charAt(0)}
                                </div>
                              )
                            ))}
                          </div>
                          <span className="text-xs text-neutral-500 truncate max-w-37.5">
                            {sessionModerators.map(s => s.name).join(", ")}
                          </span>
                        </div>
                      )}
                      {sessionSpeakers.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            {sessionSpeakers.slice(0, 3).map((speaker) => (
                              speaker.imageUrl ? (
                                <img
                                  key={speaker.id}
                                  src={speaker.imageUrl}
                                  alt={speaker.name}
                                  title={speaker.name}
                                  className="w-5 h-5 rounded-full object-cover border border-white bg-neutral-100"
                                />
                              ) : (
                                <div
                                  key={speaker.id}
                                  title={speaker.name}
                                  className="w-5 h-5 rounded-full bg-neutral-200 border border-white flex items-center justify-center text-[9px] font-medium text-neutral-500"
                                >
                                  {speaker.name.charAt(0)}
                                </div>
                              )
                            ))}
                          </div>
                          <span className="text-xs text-neutral-500 truncate max-w-37.5">
                            {sessionSpeakers.map(s => s.name).join(", ")}
                          </span>
                          {sessionSpeakers.length > 3 && (
                            <span className="text-xs text-neutral-400">+{sessionSpeakers.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-auto">
                    <button
                      onClick={() => {
                        setIsCreating(false)
                        setEditingSession(session)
                      }}
                      className="px-3 py-1.5 text-xs font-medium border border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingSession && (
        <SessionModal
          session={editingSession}
          isNew={isCreating}
          speakers={speakers}
          onSave={saveSession}
          onClose={() => {
            setEditingSession(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

function TypeBadge({ type }: { type: SessionType }) {
  const styles: Record<SessionType, string> = {
    keynote: "bg-black text-white",
    talk: "bg-neutral-200 text-neutral-700",
    workshop: "bg-neutral-300 text-neutral-700",
    panel: "bg-neutral-200 text-neutral-700",
    break: "bg-neutral-100 text-neutral-500",
    networking: "bg-neutral-100 text-neutral-500",
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles[type]}`}
    >
      {type}
    </span>
  )
}

function TrackBadge({ track }: { track: TrackType }) {
  const styles: Record<Exclude<TrackType, "">, { bg: string; label: string }> = {
    emerging: { bg: "bg-emerald-100 text-emerald-700", label: "Emerging Industries" },
    founders: { bg: "bg-violet-100 text-violet-700", label: "Founders & Investors" },
    ai: { bg: "bg-blue-100 text-blue-700", label: "AI" },
  }

  if (!track) return null

  const style = styles[track]
  if (!style) return null

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${style.bg}`}
    >
      {style.label}
    </span>
  )
}

function SessionModal({
  session,
  isNew,
  speakers,
  onSave,
  onClose,
}: {
  session: Session
  isNew: boolean
  speakers: Speaker[]
  onSave: (session: Session) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    ...session,
    moderatorIds: session.moderatorIds || [],
    speakerIds: session.speakerIds || [],
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showModerators, setShowModerators] = useState((session.moderatorIds || []).length > 0)
  const [showSpeakers, setShowSpeakers] = useState((session.speakerIds || []).length > 0)
  const [moderatorSearch, setModeratorSearch] = useState("")
  const [speakerSearch, setSpeakerSearch] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await onSave(form)
    setIsSaving(false)
  }

  const toggleModerator = (speakerId: string) => {
    setForm((prev) => ({
      ...prev,
      moderatorIds: prev.moderatorIds.includes(speakerId)
        ? prev.moderatorIds.filter((id: string) => id !== speakerId)
        : [...prev.moderatorIds, speakerId],
    }))
  }

  const toggleSpeaker = (speakerId: string) => {
    setForm((prev) => ({
      ...prev,
      speakerIds: prev.speakerIds.includes(speakerId)
        ? prev.speakerIds.filter((id) => id !== speakerId)
        : [...prev.speakerIds, speakerId],
    }))
  }

  const filteredModerators = speakers.filter(
    (s) =>
      s.name.toLowerCase().includes(moderatorSearch.toLowerCase()) ||
      s.company.toLowerCase().includes(moderatorSearch.toLowerCase())
  )

  const filteredSpeakers = speakers.filter(
    (s) =>
      s.name.toLowerCase().includes(speakerSearch.toLowerCase()) ||
      s.company.toLowerCase().includes(speakerSearch.toLowerCase())
  )

  const selectedModerators = speakers.filter((s) => form.moderatorIds.includes(s.id))
  const selectedSpeakers = speakers.filter((s) => form.speakerIds.includes(s.id))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-black">
            {isNew ? "Add Session" : "Edit Session"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
                Time *
              </label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
                Duration (min)
              </label>
              <input
                type="number"
                min={5}
                max={480}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as SessionType })}
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
              >
                {SESSION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
                Track
              </label>
              <select
                value={form.track || ""}
                onChange={(e) => setForm({ ...form, track: e.target.value as TrackType })}
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
              >
                {TRACKS.map((track) => (
                  <option key={track.value} value={track.value}>
                    {track.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Room
            </label>
            <input
              type="text"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              placeholder="e.g. Main Stage"
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black resize-none"
            />
          </div>

          {/* Moderator Toggle & Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400">
                Moderator
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowModerators(!showModerators)
                  if (showModerators) {
                    setForm((prev) => ({ ...prev, moderatorIds: [] }))
                  }
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  showModerators ? "bg-amber-500" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    showModerators ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {showModerators && (
              <div className="space-y-2">
                {/* Selected Moderators */}
                {selectedModerators.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-1">
                    {selectedModerators.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full"
                      >
                        {speaker.imageUrl && (
                          <img
                            src={speaker.imageUrl}
                            alt={speaker.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm text-amber-800">{speaker.name}</span>
                        <button
                          type="button"
                          onClick={() => toggleModerator(speaker.id)}
                          className="text-amber-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Moderator Search */}
                <input
                  type="text"
                  value={moderatorSearch}
                  onChange={(e) => setModeratorSearch(e.target.value)}
                  placeholder="Search speakers to add as moderator..."
                  className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-amber-500 mb-1"
                />

                {/* Moderator List */}
                <div className="max-h-40 overflow-y-auto border border-neutral-200 rounded-md">
                  {filteredModerators.length === 0 ? (
                    <p className="p-3 text-sm text-neutral-500 text-center">
                      {speakers.length === 0 ? "No speakers available" : "No speakers found"}
                    </p>
                  ) : (
                    filteredModerators.map((speaker) => {
                      const isSelected = form.moderatorIds.includes(speaker.id)
                      return (
                        <button
                          key={speaker.id}
                          type="button"
                          onClick={() => toggleModerator(speaker.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-amber-50 border-b border-neutral-100 last:border-b-0 transition-colors ${
                            isSelected ? "bg-amber-50" : ""
                          }`}
                        >
                          {speaker.imageUrl ? (
                            <img
                              src={speaker.imageUrl}
                              alt={speaker.name}
                              className="w-8 h-8 rounded-full object-cover bg-neutral-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-500">
                              {speaker.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black truncate">{speaker.name}</p>
                            <p className="text-xs text-neutral-500 truncate">
                              {speaker.title}{speaker.company && `, ${speaker.company}`}
                            </p>
                          </div>
                          {isSelected && (
                            <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Speaker Toggle & Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400">
                Speakers
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowSpeakers(!showSpeakers)
                  if (showSpeakers) {
                    setForm((prev) => ({ ...prev, speakerIds: [] }))
                  }
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  showSpeakers ? "bg-black" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    showSpeakers ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {showSpeakers && (
              <div className="space-y-2">
                {/* Selected Speakers */}
                {selectedSpeakers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-1">
                    {selectedSpeakers.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-full"
                      >
                        {speaker.imageUrl && (
                          <img
                            src={speaker.imageUrl}
                            alt={speaker.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm text-neutral-700">{speaker.name}</span>
                        <button
                          type="button"
                          onClick={() => toggleSpeaker(speaker.id)}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Speaker Search */}
                <input
                  type="text"
                  value={speakerSearch}
                  onChange={(e) => setSpeakerSearch(e.target.value)}
                  placeholder="Search speakers..."
                  className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black mb-1"
                />

                {/* Speaker List */}
                <div className="max-h-40 overflow-y-auto border border-neutral-200 rounded-md">
                  {filteredSpeakers.length === 0 ? (
                    <p className="p-3 text-sm text-neutral-500 text-center">
                      {speakers.length === 0 ? "No speakers available" : "No speakers found"}
                    </p>
                  ) : (
                    filteredSpeakers.map((speaker) => {
                      const isSelected = form.speakerIds.includes(speaker.id)
                      return (
                        <button
                          key={speaker.id}
                          type="button"
                          onClick={() => toggleSpeaker(speaker.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0 transition-colors ${
                            isSelected ? "bg-neutral-100" : ""
                          }`}
                        >
                          {speaker.imageUrl ? (
                            <img
                              src={speaker.imageUrl}
                              alt={speaker.name}
                              className="w-8 h-8 rounded-full object-cover bg-neutral-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-500">
                              {speaker.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black truncate">{speaker.name}</p>
                            <p className="text-xs text-neutral-500 truncate">
                              {speaker.title}{speaker.company && `, ${speaker.company}`}
                            </p>
                          </div>
                          {isSelected && (
                            <svg className="w-5 h-5 text-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors"
            >
              {isSaving ? "Saving..." : isNew ? "Add Session" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

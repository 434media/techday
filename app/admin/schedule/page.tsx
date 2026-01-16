"use client"

import { useEffect, useState } from "react"

type SessionType = "keynote" | "talk" | "workshop" | "panel" | "break" | "networking"

interface Session {
  id: string
  title: string
  description: string
  time: string
  duration: number
  room: string
  speakerId?: string
  type: SessionType
}

const SESSION_TYPES: { value: SessionType; label: string }[] = [
  { value: "keynote", label: "Keynote" },
  { value: "talk", label: "Talk" },
  { value: "workshop", label: "Workshop" },
  { value: "panel", label: "Panel" },
  { value: "break", label: "Break" },
  { value: "networking", label: "Networking" },
]

const EMPTY_SESSION: Session = {
  id: "",
  title: "",
  description: "",
  time: "09:00",
  duration: 30,
  room: "",
  type: "talk",
}

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [])

  async function fetchSessions() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/content/schedule")
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
      })

      if (response.ok) {
        fetchSessions()
      }
    } catch (error) {
      console.error("Failed to delete session:", error)
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
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Schedule
          </h1>
          <p className="text-sm text-neutral-500">
            Manage conference sessions
          </p>
        </div>
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
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border border-neutral-200 p-4 flex items-center gap-6"
            >
              <div className="w-24 shrink-0">
                <p className="text-sm font-medium text-black">
                  {formatTime(session.time)}
                </p>
                <p className="text-xs text-neutral-500">
                  {session.duration} min
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-black truncate">
                    {session.title}
                  </h3>
                  <TypeBadge type={session.type} />
                </div>
                <p className="text-sm text-neutral-600 truncate">
                  {session.description || "No description"}
                </p>
                {session.room && (
                  <p className="text-xs text-neutral-400 mt-1">
                    {session.room}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setEditingSession(session)
                  }}
                  className="px-3 py-1.5 text-sm font-medium border border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSession(session.id)}
                  className="px-3 py-1.5 text-sm font-medium text-neutral-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingSession && (
        <SessionModal
          session={editingSession}
          isNew={isCreating}
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

function SessionModal({
  session,
  isNew,
  onSave,
  onClose,
}: {
  session: Session
  isNew: boolean
  onSave: (session: Session) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(session)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await onSave(form)
    setIsSaving(false)
  }

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

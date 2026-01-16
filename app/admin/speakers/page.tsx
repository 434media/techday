"use client"

import { useEffect, useState } from "react"

interface Speaker {
  id: string
  name: string
  title: string
  company: string
  bio: string
  imageUrl: string
  sessionId?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

const EMPTY_SPEAKER: Speaker = {
  id: "",
  name: "",
  title: "",
  company: "",
  bio: "",
  imageUrl: "",
  socialLinks: {},
}

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchSpeakers()
  }, [])

  async function fetchSpeakers() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/content/speakers")
      const data = await response.json()
      setSpeakers(data.speakers || [])
    } catch (error) {
      console.error("Failed to fetch speakers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function saveSpeaker(speaker: Speaker) {
    const isNew = !speaker.id || isCreating
    const method = isNew ? "POST" : "PUT"

    try {
      const response = await fetch("/api/admin/content/speakers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(speaker),
      })

      if (response.ok) {
        fetchSpeakers()
        setEditingSpeaker(null)
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Failed to save speaker:", error)
    }
  }

  async function deleteSpeaker(id: string) {
    if (!confirm("Are you sure you want to delete this speaker?")) return

    try {
      const response = await fetch(`/api/admin/content/speakers?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchSpeakers()
      }
    } catch (error) {
      console.error("Failed to delete speaker:", error)
    }
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Speakers
          </h1>
          <p className="text-sm text-neutral-500">
            Manage conference speakers
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true)
            setEditingSpeaker({ ...EMPTY_SPEAKER })
          }}
          className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 transition-colors"
        >
          Add Speaker
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading speakers...</p>
        </div>
      ) : speakers.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-500 mb-4">No speakers added yet</p>
          <button
            onClick={() => {
              setIsCreating(true)
              setEditingSpeaker({ ...EMPTY_SPEAKER })
            }}
            className="text-sm font-medium text-black underline hover:no-underline"
          >
            Add your first speaker
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="bg-white border border-neutral-200 p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                {speaker.imageUrl ? (
                  <img
                    src={speaker.imageUrl}
                    alt={speaker.name}
                    className="w-16 h-16 object-cover bg-neutral-100"
                  />
                ) : (
                  <div className="w-16 h-16 bg-neutral-100 flex items-center justify-center text-neutral-400 text-lg font-medium">
                    {speaker.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-black truncate">
                    {speaker.name}
                  </h3>
                  <p className="text-sm text-neutral-600 truncate">
                    {speaker.title}
                  </p>
                  <p className="text-sm text-neutral-500 truncate">
                    {speaker.company}
                  </p>
                </div>
              </div>
              <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                {speaker.bio || "No bio provided"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setEditingSpeaker(speaker)
                  }}
                  className="flex-1 py-2 text-sm font-medium border border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSpeaker(speaker.id)}
                  className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingSpeaker && (
        <SpeakerModal
          speaker={editingSpeaker}
          isNew={isCreating}
          onSave={saveSpeaker}
          onClose={() => {
            setEditingSpeaker(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

function SpeakerModal({
  speaker,
  isNew,
  onSave,
  onClose,
}: {
  speaker: Speaker
  isNew: boolean
  onSave: (speaker: Speaker) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(speaker)
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
            {isNew ? "Add Speaker" : "Edit Speaker"}
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
              Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. CEO, Founder"
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Company
            </label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
                Twitter
              </label>
              <input
                type="text"
                value={form.socialLinks?.twitter || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, twitter: e.target.value },
                  })
                }
                placeholder="@handle"
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                value={form.socialLinks?.linkedin || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, linkedin: e.target.value },
                  })
                }
                placeholder="URL"
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
                Website
              </label>
              <input
                type="text"
                value={form.socialLinks?.website || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, website: e.target.value },
                  })
                }
                placeholder="URL"
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors"
            >
              {isSaving ? "Saving..." : isNew ? "Add Speaker" : "Save Changes"}
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

"use client"

import { useEffect, useState } from "react"

interface Speaker {
  id: string
  name: string
  title: string
  company: string
  bio: string
  imageUrl: string
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isSavingOrder, setIsSavingOrder] = useState(false)

  useEffect(() => {
    fetchSpeakers()
  }, [])

  async function fetchSpeakers() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/content/speakers", {
        credentials: "include",
      })
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
        credentials: "include",
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
        credentials: "include",
      })

      if (response.ok) {
        fetchSpeakers()
      }
    } catch (error) {
      console.error("Failed to delete speaker:", error)
    }
  }

  async function saveOrder(newSpeakers: Speaker[]) {
    setIsSavingOrder(true)
    try {
      const response = await fetch("/api/admin/content/speakers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speakers: newSpeakers }),
        credentials: "include",
      })

      if (!response.ok) {
        console.error("Failed to save order")
        fetchSpeakers() // Revert on error
      }
    } catch (error) {
      console.error("Failed to save order:", error)
      fetchSpeakers() // Revert on error
    } finally {
      setIsSavingOrder(false)
    }
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", index.toString())
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  function handleDragLeave() {
    setDragOverIndex(null)
  }

  function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newSpeakers = [...speakers]
    const [draggedSpeaker] = newSpeakers.splice(draggedIndex, 1)
    newSpeakers.splice(dropIndex, 0, draggedSpeaker)

    setSpeakers(newSpeakers)
    saveOrder(newSpeakers)

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  function handleDragEnd() {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Speakers
            {isSavingOrder && (
              <span className="ml-3 text-sm font-normal text-neutral-400">Saving order...</span>
            )}
          </h1>
          <p className="text-sm text-neutral-500">
            Manage conference speakers • Drag cards to reorder
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
          {speakers.map((speaker, index) => (
            <div
              key={speaker.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white border p-6 cursor-grab active:cursor-grabbing transition-all ${
                draggedIndex === index
                  ? "opacity-50 border-neutral-300 scale-[0.98]"
                  : dragOverIndex === index
                    ? "border-black border-2 bg-neutral-50"
                    : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-neutral-300 hover:text-neutral-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                    </svg>
                  </div>
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
                </div>
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
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await onSave(form)
    setIsSaving(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError("")
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "speakers")

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setForm({ ...form, imageUrl: data.url })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-black">
            {isNew ? "Add Speaker" : "Edit Speaker"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 transition-colors rounded-md">
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
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
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
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
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
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
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
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black resize-none rounded-md"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Speaker Image
            </label>
            
            {/* Image Type Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageInputType("url")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  imageInputType === "url"
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setImageInputType("file")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  imageInputType === "file"
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Upload File
              </button>
            </div>

            {imageInputType === "url" ? (
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
              />
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
                        <span className="text-xs text-neutral-500">Uploading...</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-neutral-400">
                  Accepted formats: JPEG, PNG, WebP, GIF. Max size: 5MB
                </p>
                {uploadError && (
                  <p className="text-xs text-red-600">{uploadError}</p>
                )}
              </div>
            )}

            {/* Image Preview */}
            {form.imageUrl && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={form.imageUrl}
                  alt="Speaker preview"
                  className="w-16 h-16 object-cover rounded-md bg-neutral-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 truncate">{form.imageUrl}</p>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: "" })}
                    className="text-xs text-red-600 hover:text-red-700 mt-1"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            )}
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
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
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
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
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
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="flex-1 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors rounded-md"
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

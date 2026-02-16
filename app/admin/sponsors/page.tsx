"use client"

import { useEffect, useState } from "react"

type SponsorEvent = "techday" | "techfuel"
type SponsorCategory = "sponsors" | "community"

interface Sponsor {
  id: string
  name: string
  logoUrl: string
  website: string
}

interface EventSponsors {
  sponsors: Sponsor[]
  community: Sponsor[]
}

interface AllSponsors {
  techday: EventSponsors
  techfuel: EventSponsors
}

const EVENTS: { value: SponsorEvent; label: string }[] = [
  { value: "techday", label: "Tech Day" },
  { value: "techfuel", label: "Tech Fuel" },
]

const CATEGORIES: { value: SponsorCategory; label: string }[] = [
  { value: "sponsors", label: "Sponsors" },
  { value: "community", label: "Community Partners" },
]

const EMPTY_SPONSOR: Sponsor = {
  id: "",
  name: "",
  logoUrl: "",
  website: "",
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<AllSponsors>({
    techday: { sponsors: [], community: [] },
    techfuel: { sponsors: [], community: [] },
  })
  const [activeEvent, setActiveEvent] = useState<SponsorEvent>("techday")
  const [isLoading, setIsLoading] = useState(true)
  const [editingSponsor, setEditingSponsor] = useState<{ sponsor: Sponsor; event: SponsorEvent; category: SponsorCategory } | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [draggedItem, setDraggedItem] = useState<{ category: SponsorCategory; index: number } | null>(null)
  const [dragOverItem, setDragOverItem] = useState<{ category: SponsorCategory; index: number } | null>(null)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)

  useEffect(() => {
    fetchSponsors()
  }, [])

  async function fetchSponsors() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/content/sponsors", {
        credentials: "include",
      })
      const data = await response.json()
      setSponsors(data.sponsors || {
        techday: { sponsors: [], community: [] },
        techfuel: { sponsors: [], community: [] },
      })
    } catch (error) {
      console.error("Failed to fetch sponsors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function saveSponsor(sponsor: Sponsor, event: SponsorEvent, category: SponsorCategory, oldEvent?: SponsorEvent, oldCategory?: SponsorCategory) {
    const isNew = !sponsor.id || isCreating
    const method = isNew ? "POST" : "PUT"

    try {
      const response = await fetch("/api/admin/content/sponsors", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsor,
          event,
          category,
          oldEvent,
          oldCategory,
        }),
        credentials: "include",
      })

      if (response.ok) {
        fetchSponsors()
        setEditingSponsor(null)
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Failed to save sponsor:", error)
    }
  }

  async function deleteSponsor(id: string, event: SponsorEvent, category: SponsorCategory) {
    if (!confirm("Are you sure you want to delete this sponsor?")) return

    try {
      const response = await fetch(`/api/admin/content/sponsors?id=${id}&event=${event}&category=${category}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        fetchSponsors()
      }
    } catch (error) {
      console.error("Failed to delete sponsor:", error)
    }
  }

  async function deleteAllSponsors() {
    if (!confirm("Are you sure you want to delete ALL sponsors? This action cannot be undone.")) return
    if (!confirm("This will permanently remove all sponsor data. Are you absolutely sure?")) return

    setIsDeletingAll(true)
    try {
      const response = await fetch("/api/admin/content/sponsors?id=all", {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        fetchSponsors()
      }
    } catch (error) {
      console.error("Failed to delete all sponsors:", error)
    } finally {
      setIsDeletingAll(false)
    }
  }

  async function saveOrder(event: SponsorEvent, category: SponsorCategory, newSponsors: Sponsor[]) {
    setIsSavingOrder(true)
    try {
      const response = await fetch("/api/admin/content/sponsors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, category, sponsors: newSponsors }),
        credentials: "include",
      })

      if (!response.ok) {
        console.error("Failed to save order")
        fetchSponsors()
      }
    } catch (error) {
      console.error("Failed to save order:", error)
      fetchSponsors()
    } finally {
      setIsSavingOrder(false)
    }
  }

  function handleDragStart(e: React.DragEvent, category: SponsorCategory, index: number) {
    setDraggedItem({ category, index })
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", `${category}:${index}`)
  }

  function handleDragOver(e: React.DragEvent, category: SponsorCategory, index: number) {
    e.preventDefault()
    if (draggedItem?.category !== category) return
    e.dataTransfer.dropEffect = "move"
    setDragOverItem({ category, index })
  }

  function handleDragLeave() {
    setDragOverItem(null)
  }

  function handleDrop(e: React.DragEvent, category: SponsorCategory, dropIndex: number) {
    e.preventDefault()
    if (!draggedItem || draggedItem.category !== category || draggedItem.index === dropIndex) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    const eventSponsors = sponsors[activeEvent]
    const newCategorySponsors = [...eventSponsors[category]]
    const [draggedSponsor] = newCategorySponsors.splice(draggedItem.index, 1)
    newCategorySponsors.splice(dropIndex, 0, draggedSponsor)

    setSponsors({
      ...sponsors,
      [activeEvent]: { ...eventSponsors, [category]: newCategorySponsors },
    })
    saveOrder(activeEvent, category, newCategorySponsors)

    setDraggedItem(null)
    setDragOverItem(null)
  }

  function handleDragEnd() {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const eventSponsors = sponsors[activeEvent]
  const totalSponsors = eventSponsors.sponsors.length + eventSponsors.community.length
  const globalTotal = sponsors.techday.sponsors.length + sponsors.techday.community.length + sponsors.techfuel.sponsors.length + sponsors.techfuel.community.length

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Sponsors
            {isSavingOrder && (
              <span className="ml-3 text-sm font-normal text-neutral-400">Saving order...</span>
            )}
          </h1>
          <p className="text-sm text-neutral-500">
            {totalSponsors} sponsors for {activeEvent === "techday" ? "Tech Day" : "Tech Fuel"} • Drag cards to reorder
          </p>
        </div>
        <div className="flex items-center gap-3">
          {globalTotal > 0 && (
            <button
              onClick={deleteAllSponsors}
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
              setEditingSponsor({ sponsor: { ...EMPTY_SPONSOR }, event: activeEvent, category: "sponsors" })
            }}
            className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 transition-colors"
          >
            Add Sponsor
          </button>
        </div>
      </div>

      {/* Event Tabs */}
      <div className="flex gap-1 mb-8 bg-neutral-100 p-1 rounded-lg w-fit">
        {EVENTS.map((evt) => (
          <button
            key={evt.value}
            onClick={() => setActiveEvent(evt.value)}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
              activeEvent === evt.value
                ? "bg-white text-black shadow-sm"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            {evt.label}
            <span className="ml-2 text-xs text-neutral-400">
              ({(sponsors[evt.value]?.sponsors?.length || 0) + (sponsors[evt.value]?.community?.length || 0)})
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading sponsors...</p>
        </div>
      ) : totalSponsors === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-500 mb-4">No sponsors added for {activeEvent === "techday" ? "Tech Day" : "Tech Fuel"} yet</p>
          <button
            onClick={() => {
              setIsCreating(true)
              setEditingSponsor({ sponsor: { ...EMPTY_SPONSOR }, event: activeEvent, category: "sponsors" })
            }}
            className="text-sm font-medium text-black underline hover:no-underline"
          >
            Add your first sponsor
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.map((cat) => {
            const catSponsors = eventSponsors[cat.value] || []
            if (catSponsors.length === 0) return null

            return (
              <div key={cat.value}>
                <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-4">
                  {cat.label} ({catSponsors.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {catSponsors.map((sponsor, index) => (
                    <div
                      key={sponsor.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, cat.value, index)}
                      onDragOver={(e) => handleDragOver(e, cat.value, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, cat.value, index)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white border p-4 cursor-grab active:cursor-grabbing transition-all ${
                        draggedItem?.category === cat.value && draggedItem?.index === index
                          ? "opacity-50 border-neutral-300 scale-[0.98]"
                          : dragOverItem?.category === cat.value && dragOverItem?.index === index
                            ? "border-black border-2 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-neutral-300 hover:text-neutral-500 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                          </svg>
                        </div>
                        {sponsor.logoUrl ? (
                          <img
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            className="w-12 h-12 object-contain bg-neutral-50"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm font-medium">
                            {sponsor.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-black truncate">
                            {sponsor.name}
                          </h3>
                          {sponsor.website && (
                            <a
                              href={sponsor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-neutral-500 hover:text-black truncate block"
                            >
                              {sponsor.website.replace(/^https?:\/\//, "")}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsCreating(false)
                            setEditingSponsor({ sponsor: { ...sponsor }, event: activeEvent, category: cat.value })
                          }}
                          className="flex-1 py-1.5 text-xs font-medium border border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSponsor(sponsor.id, activeEvent, cat.value)}
                          className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingSponsor && (
        <SponsorModal
          sponsor={editingSponsor.sponsor}
          event={editingSponsor.event}
          category={editingSponsor.category}
          isNew={isCreating}
          onSave={saveSponsor}
          onClose={() => {
            setEditingSponsor(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

function SponsorModal({
  sponsor,
  event: initialEvent,
  category: initialCategory,
  isNew,
  onSave,
  onClose,
}: {
  sponsor: Sponsor
  event: SponsorEvent
  category: SponsorCategory
  isNew: boolean
  onSave: (sponsor: Sponsor, event: SponsorEvent, category: SponsorCategory, oldEvent?: SponsorEvent, oldCategory?: SponsorCategory) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(sponsor)
  const [event, setEvent] = useState(initialEvent)
  const [category, setCategory] = useState(initialCategory)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [logoInputType, setLogoInputType] = useState<"url" | "file">("url")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await onSave(
      form,
      event,
      category,
      isNew ? undefined : initialEvent,
      isNew ? undefined : initialCategory,
    )
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
      formData.append("folder", "sponsors")

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setForm({ ...form, logoUrl: data.url })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-black">
            {isNew ? "Add Sponsor" : "Edit Sponsor"}
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
              Event *
            </label>
            <select
              required
              value={event}
              onChange={(e) => setEvent(e.target.value as SponsorEvent)}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
            >
              {EVENTS.map((evt) => (
                <option key={evt.value} value={evt.value}>
                  {evt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Category *
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as SponsorCategory)}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Logo
            </label>
            
            {/* Logo Input Type Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setLogoInputType("url")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  logoInputType === "url"
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setLogoInputType("file")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  logoInputType === "file"
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Upload File
              </button>
            </div>

            {logoInputType === "url" ? (
              <input
                type="url"
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
              />
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
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
                  Accepted formats: JPEG, PNG, WebP, GIF, SVG. Max size: 5MB
                </p>
                {uploadError && (
                  <p className="text-xs text-red-600">{uploadError}</p>
                )}
              </div>
            )}

            {/* Logo Preview */}
            {form.logoUrl && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={form.logoUrl}
                  alt="Logo preview"
                  className="w-16 h-16 object-contain rounded-md bg-neutral-50 border border-neutral-200 p-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 truncate">{form.logoUrl}</p>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, logoUrl: "" })}
                    className="text-xs text-red-600 hover:text-red-700 mt-1"
                  >
                    Remove logo
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Website
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black rounded-md"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="flex-1 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors rounded-md"
            >
              {isSaving ? "Saving..." : isNew ? "Add Sponsor" : "Save Changes"}
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

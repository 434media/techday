"use client"

import { useEffect, useState } from "react"

interface Partner {
  id: string
  name: string
  logoUrl: string
  website: string
}

const EMPTY_PARTNER: Partner = {
  id: "",
  name: "",
  logoUrl: "",
  website: "",
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchPartners()
  }, [])

  async function fetchPartners() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/content/partners", {
        credentials: "include",
      })
      const data = await response.json()
      setPartners(data.partners || [])
    } catch (error) {
      console.error("Failed to fetch partners:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function savePartner(partner: Partner) {
    const isNew = !partner.id || isCreating
    const method = isNew ? "POST" : "PUT"

    try {
      const response = await fetch("/api/admin/content/partners", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partner),
        credentials: "include",
      })

      if (response.ok) {
        fetchPartners()
        setEditingPartner(null)
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Failed to save partner:", error)
    }
  }

  async function deletePartner(id: string) {
    if (!confirm("Are you sure you want to delete this partner?")) return

    try {
      const response = await fetch(`/api/admin/content/partners?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        fetchPartners()
      }
    } catch (error) {
      console.error("Failed to delete partner:", error)
    }
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Partners
          </h1>
          <p className="text-sm text-neutral-500">
            {partners.length} partners
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true)
            setEditingPartner({ ...EMPTY_PARTNER })
          }}
          className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 transition-colors"
        >
          Add Partner
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading partners...</p>
        </div>
      ) : partners.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-500 mb-4">No partners added yet</p>
          <button
            onClick={() => {
              setIsCreating(true)
              setEditingPartner({ ...EMPTY_PARTNER })
            }}
            className="text-sm font-medium text-black underline hover:no-underline"
          >
            Add your first partner
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white border border-neutral-200 p-4"
            >
              <div className="flex items-center gap-4 mb-3">
                {partner.logoUrl ? (
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="w-12 h-12 object-contain bg-neutral-50"
                  />
                ) : (
                  <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm font-medium">
                    {partner.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-black truncate">
                    {partner.name}
                  </h3>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-500 hover:text-black truncate block"
                    >
                      {partner.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setEditingPartner(partner)
                  }}
                  className="flex-1 py-1.5 text-xs font-medium border border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePartner(partner.id)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingPartner && (
        <PartnerModal
          partner={editingPartner}
          isNew={isCreating}
          onSave={savePartner}
          onClose={() => {
            setEditingPartner(null)
            setIsCreating(false)
          }}
        />
      )}
    </div>
  )
}

function PartnerModal({
  partner,
  isNew,
  onSave,
  onClose,
}: {
  partner: Partner
  isNew: boolean
  onSave: (partner: Partner) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(partner)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [logoInputType, setLogoInputType] = useState<"url" | "file">("url")

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
      formData.append("folder", "partners")

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
            {isNew ? "Add Partner" : "Edit Partner"}
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
              {isSaving ? "Saving..." : isNew ? "Add Partner" : "Save Changes"}
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

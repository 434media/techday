"use client"

import { useEffect, useState } from "react"

type SponsorTier = "platinum" | "gold" | "silver" | "bronze" | "community"

interface Sponsor {
  id: string
  name: string
  logoUrl: string
  website: string
  tier: SponsorTier
}

const TIERS: { value: SponsorTier; label: string }[] = [
  { value: "platinum", label: "Platinum" },
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "bronze", label: "Bronze" },
  { value: "community", label: "Community" },
]

const EMPTY_SPONSOR: Sponsor = {
  id: "",
  name: "",
  logoUrl: "",
  website: "",
  tier: "silver",
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Record<SponsorTier, Sponsor[]>>({
    platinum: [],
    gold: [],
    silver: [],
    bronze: [],
    community: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchSponsors()
  }, [])

  async function fetchSponsors() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/content/sponsors")
      const data = await response.json()
      setSponsors(data.sponsors || {
        platinum: [],
        gold: [],
        silver: [],
        bronze: [],
        community: [],
      })
    } catch (error) {
      console.error("Failed to fetch sponsors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function saveSponsor(sponsor: Sponsor, oldTier?: SponsorTier) {
    const isNew = !sponsor.id || isCreating
    const method = isNew ? "POST" : "PUT"

    try {
      const response = await fetch("/api/admin/content/sponsors", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsor: { ...sponsor, tier: undefined },
          tier: sponsor.tier,
          oldTier: oldTier,
        }),
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

  async function deleteSponsor(id: string, tier: SponsorTier) {
    if (!confirm("Are you sure you want to delete this sponsor?")) return

    try {
      const response = await fetch(`/api/admin/content/sponsors?id=${id}&tier=${tier}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchSponsors()
      }
    } catch (error) {
      console.error("Failed to delete sponsor:", error)
    }
  }

  const totalSponsors = Object.values(sponsors).flat().length

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Sponsors
          </h1>
          <p className="text-sm text-neutral-500">
            {totalSponsors} sponsors
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true)
            setEditingSponsor({ ...EMPTY_SPONSOR })
          }}
          className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 transition-colors"
        >
          Add Sponsor
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading sponsors...</p>
        </div>
      ) : totalSponsors === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-500 mb-4">No sponsors added yet</p>
          <button
            onClick={() => {
              setIsCreating(true)
              setEditingSponsor({ ...EMPTY_SPONSOR })
            }}
            className="text-sm font-medium text-black underline hover:no-underline"
          >
            Add your first sponsor
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {TIERS.map((tier) => {
            const tierSponsors = sponsors[tier.value] || []
            if (tierSponsors.length === 0) return null

            return (
              <div key={tier.value}>
                <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-4">
                  {tier.label} ({tierSponsors.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tierSponsors.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className="bg-white border border-neutral-200 p-4"
                    >
                      <div className="flex items-center gap-4 mb-3">
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
                            setEditingSponsor({ ...sponsor, tier: tier.value })
                          }}
                          className="flex-1 py-1.5 text-xs font-medium border border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSponsor(sponsor.id, tier.value)}
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
          sponsor={editingSponsor}
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
  isNew,
  onSave,
  onClose,
}: {
  sponsor: Sponsor
  isNew: boolean
  onSave: (sponsor: Sponsor, oldTier?: SponsorTier) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(sponsor)
  const [isSaving, setIsSaving] = useState(false)
  const originalTier = sponsor.tier

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await onSave(form, isNew ? undefined : originalTier)
    setIsSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">
            {isNew ? "Add Sponsor" : "Edit Sponsor"}
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
              Tier *
            </label>
            <select
              required
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value as SponsorTier })}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            >
              {TIERS.map((tier) => (
                <option key={tier.value} value={tier.value}>
                  {tier.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            />
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
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors"
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

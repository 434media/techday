"use client"

import { useEffect, useState, useRef } from "react"
import { upload } from "@vercel/blob/client"

interface Finalist {
  id: string
  companyName: string
  founderName: string
  email: string
  phone: string
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
  logoUrl: string
  status: string
  submittedAt: string
  finalDeckUrl: string
}

function MetaItem({ label, value, bold }: { label: string; value?: string; bold?: boolean }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">{label}</span>
      <span className={`text-[12px] ${bold ? "font-semibold text-neutral-900" : "font-medium text-neutral-600"}`}>{value}</span>
    </div>
  )
}

export default function FinalistsPage() {
  const [finalists, setFinalists] = useState<Finalist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFinalist, setSelectedFinalist] = useState<Finalist | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    fetchFinalists()
  }, [])

  async function fetchFinalists() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/data/finalists", { credentials: "include" })
      if (!res.ok) {
        console.error("Failed to fetch finalists:", res.statusText)
        return
      }
      const data = await res.json()
      setFinalists(data.finalists || [])
    } catch (error) {
      console.error("Failed to fetch finalists:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            TechFuel 2026 Finalists
          </h1>
          <p className="text-sm text-neutral-500">
            {finalists.length} companies advancing to finals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium rounded-full">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Finals — April 20, 2026
          </span>
        </div>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-500">Loading finalists...</p>
        </div>
      ) : finalists.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center">
          <p className="text-sm text-neutral-500">No finalists found. Make sure pitch submissions exist for the finalist companies.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {finalists.map((finalist, idx) => (
            <div
              key={finalist.id}
              onClick={() => setSelectedFinalist(finalist)}
              className="bg-white border border-neutral-200 rounded-lg cursor-pointer hover:border-neutral-300 hover:shadow-md transition-all group overflow-hidden"
            >
              {/* Top row — identity */}
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Logo */}
                    <div className="w-11 h-11 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
                      {finalist.logoUrl ? (
                        <img src={finalist.logoUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-base font-semibold text-neutral-400">
                          {finalist.companyName?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-[15px] font-semibold text-black truncate leading-tight">
                          {finalist.companyName}
                        </h3>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold uppercase tracking-wide shrink-0 rounded">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          Finalist
                        </span>
                        {finalist.finalDeckUrl && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-semibold uppercase tracking-wide shrink-0 rounded">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Deck
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] font-medium text-neutral-700 leading-relaxed">
                        {finalist.founderName}
                      </p>
                      <p className="text-[12px] text-neutral-400 mt-0.5 leading-relaxed">
                        {finalist.email}
                      </p>
                    </div>
                  </div>
                  {/* Quick links */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {finalist.website && (
                      <a
                        href={finalist.website.startsWith("http") ? finalist.website : `https://${finalist.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-medium text-neutral-400 hover:text-black transition-colors"
                      >
                        Website ↗
                      </a>
                    )}
                    {finalist.finalDeckUrl ? (
                      <a
                        href={finalist.finalDeckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-semibold text-green-600 hover:text-green-800 transition-colors"
                      >
                        Final Deck ↗
                      </a>
                    ) : finalist.deckUrl ? (
                      <a
                        href={finalist.deckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-medium text-neutral-400 hover:text-black transition-colors"
                      >
                        Deck ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Bottom row — metadata strip */}
              <div className="px-6 py-3 bg-neutral-50/80 border-t border-neutral-100 flex items-center gap-6">
                <MetaItem label="Industry" value={finalist.industry} />
                <MetaItem label="Stage" value={finalist.stage} />
                <MetaItem label="Team" value={finalist.teamSize} />
                {finalist.fundingGoal && <MetaItem label="Goal" value={finalist.fundingGoal} bold />}
                <div className="flex-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedFinalist && (
        <FinalistDetailModal
          finalist={selectedFinalist}
          onClose={() => setSelectedFinalist(null)}
          onUpdate={fetchFinalists}
          showToast={showToast}
        />
      )}
    </div>
  )
}

function FinalistDetailModal({
  finalist,
  onClose,
  onUpdate,
  showToast,
}: {
  finalist: Finalist
  onClose: () => void
  onUpdate: () => void
  showToast: (msg: string, type: "success" | "error") => void
}) {
  const [finalDeckUrl, setFinalDeckUrl] = useState(finalist.finalDeckUrl || "")
  const [isUploadingDeck, setIsUploadingDeck] = useState(false)
  const deckInputRef = useRef<HTMLInputElement>(null)

  const handleDeckUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingDeck(true)
    try {
      const blob = await upload(`finalist-decks/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      })

      // Save to finalist document
      const patchRes = await fetch("/api/admin/data/finalists", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: finalist.id, finalDeckUrl: blob.url }),
        credentials: "include",
      })

      if (patchRes.ok) {
        setFinalDeckUrl(blob.url)
        showToast("Final deck uploaded", "success")
        onUpdate()
      } else {
        showToast("Failed to save deck URL", "error")
      }
    } catch {
      showToast("Upload failed", "error")
    } finally {
      setIsUploadingDeck(false)
    }
  }

  const handleRemoveDeck = async () => {
    try {
      const res = await fetch("/api/admin/data/finalists", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: finalist.id, finalDeckUrl: "" }),
        credentials: "include",
      })
      if (res.ok) {
        setFinalDeckUrl("")
        showToast("Final deck removed", "success")
        onUpdate()
      }
    } catch {
      showToast("Failed to remove deck", "error")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
              {finalist.logoUrl ? (
                <img src={finalist.logoUrl} alt="" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-base font-bold text-neutral-400">
                  {finalist.companyName?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-black leading-tight">{finalist.companyName}</h2>
              <p className="text-sm text-neutral-500 mt-0.5">{finalist.founderName} · {finalist.industry}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black transition-colors rounded-lg hover:bg-neutral-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">Contact</h3>
            <div className="grid grid-cols-3 gap-x-6 gap-y-5">
              <InfoCell label="Email" value={finalist.email} isLink={`mailto:${finalist.email}`} />
              {finalist.phone && <InfoCell label="Phone" value={finalist.phone} />}
              {finalist.website && (
                <InfoCell
                  label="Website"
                  value={finalist.website.replace(/^https?:\/\//, "")}
                  isLink={finalist.website.startsWith("http") ? finalist.website : `https://${finalist.website}`}
                  external
                />
              )}
            </div>
          </div>

          {/* Company Details */}
          <div className="border-t border-neutral-100 pt-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">Company</h3>
            <div className="grid grid-cols-4 gap-x-6 gap-y-5">
              <InfoCell label="Stage" value={finalist.stage || "—"} />
              <InfoCell label="Team Size" value={finalist.teamSize || "—"} />
              <InfoCell label="Funding Raised" value={finalist.fundingRaised || "—"} highlight />
              <InfoCell label="Funding Goal" value={finalist.fundingGoal || "—"} highlight />
            </div>
          </div>

          {/* Pitch / Problem / Solution / Traction — stacked columns */}
          <div className="border-t border-neutral-100 pt-6 space-y-6">
            <ContentBlock label="Elevator Pitch" content={finalist.pitch} accent />
            <div className="space-y-5">
              <ContentBlock label="Problem" content={finalist.problem} />
              <ContentBlock label="Solution" content={finalist.solution} />
              <ContentBlock label="Traction" content={finalist.traction} />
            </div>
          </div>

          {/* Pitch Decks */}
          <div className="border-t border-neutral-100 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Pitch Decks</h3>

            <div className="space-y-3">
              {/* Original Deck */}
              {finalist.deckUrl && (
                <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Original Submission Deck</p>
                      <p className="text-xs text-neutral-400">Submitted with application</p>
                    </div>
                  </div>
                  <a
                    href={finalist.deckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-black hover:underline font-medium"
                  >
                    View ↗
                  </a>
                </div>
              )}

              {/* Final Deck */}
              {finalDeckUrl ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800">Final Presentation Deck</p>
                      <p className="text-xs text-green-600">Updated for finals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={finalDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-800 hover:underline font-medium"
                    >
                      View ↗
                    </a>
                    <button
                      onClick={handleRemoveDeck}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-4">
                  <input
                    ref={deckInputRef}
                    type="file"
                    accept=".pdf,.ppt,.pptx,.key"
                    onChange={handleDeckUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => deckInputRef.current?.click()}
                    disabled={isUploadingDeck}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-neutral-500 hover:text-black transition-colors disabled:opacity-50"
                  >
                    {isUploadingDeck ? (
                      <>
                        <div className="w-4 h-4 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload Final Deck
                      </>
                    )}
                  </button>
                  <p className="text-xs text-neutral-400 text-center mt-1">PDF, PPT, PPTX, or Keynote</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCell({
  label,
  value,
  isLink,
  external,
  highlight,
}: {
  label: string
  value: string
  isLink?: string
  external?: boolean
  highlight?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5 leading-none">{label}</p>
      {isLink ? (
        <a
          href={isLink}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-[13px] font-medium text-black hover:underline leading-relaxed break-all"
        >
          {value}
        </a>
      ) : (
        <p className={`text-[13px] leading-relaxed ${highlight ? "font-semibold text-black" : "font-medium text-neutral-800"}`}>{value}</p>
      )}
    </div>
  )
}

function ContentBlock({ label, content, accent }: { label: string; content: string; accent?: boolean }) {
  if (!content) return null
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-3 leading-none">{label}</h3>
      <p className={`whitespace-pre-wrap ${
        accent
          ? "text-[15px] font-medium text-neutral-900 leading-[1.75]"
          : "text-[13px] font-normal text-neutral-600 leading-[1.8]"
      }`}>{content}</p>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

interface Vote {
  id: string
  email: string
  finalist: string
  isRegistered: boolean
  registrationId: string | null
  createdAt: string | null
}

const FINALIST_NAMES = [
  "ComeBack Mobility",
  "Freyya",
  "Openlane",
  "Bytewhisper Security",
  "RentBamboo",
]

export default function VotesPage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [tally, setTally] = useState<Record<string, number>>({})
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [deleting, setDeleting] = useState<Set<string>>(new Set())
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)

  useEffect(() => {
    fetchVotes()
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchVotes, 10000)
    return () => clearInterval(interval)
  }, [])

  async function fetchVotes() {
    try {
      const res = await fetch("/api/admin/data/votes", { credentials: "include" })
      if (!res.ok) return
      const data = await res.json()
      setVotes(data.votes || [])
      setTally(data.tally || {})
      setTotal(data.total || 0)
    } catch (error) {
      console.error("Failed to fetch votes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteVote(id: string) {
    setDeleting((prev) => new Set(prev).add(id))
    try {
      const res = await fetch("/api/admin/data/votes", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      })
      if (res.ok) fetchVotes()
    } catch (error) {
      console.error("Failed to delete vote:", error)
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  async function deleteAllVotes() {
    const allIds = votes.map((v) => v.id)
    setDeleting(new Set(allIds))
    try {
      const res = await fetch("/api/admin/data/votes", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: allIds }),
      })
      if (res.ok) fetchVotes()
    } catch (error) {
      console.error("Failed to delete all votes:", error)
    } finally {
      setDeleting(new Set())
      setConfirmDeleteAll(false)
    }
  }

  // Sort finalists by vote count descending
  const ranked = [...FINALIST_NAMES].sort(
    (a, b) => (tally[b] || 0) - (tally[a] || 0)
  )

  const maxVotes = Math.max(...FINALIST_NAMES.map((n) => tally[n] || 0), 1)

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">Live Audience Vote</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Real-time results · {total} total vote{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {votes.length > 0 && (
            confirmDeleteAll ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">Delete all {votes.length} votes?</span>
                <button
                  onClick={deleteAllVotes}
                  className="px-3 py-2 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDeleteAll(false)}
                  className="px-3 py-2 text-xs font-medium text-neutral-600 border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
              >
                Delete All
              </button>
            )
          )}
          <button
            onClick={() => {
              setIsLoading(true)
              fetchVotes()
            }}
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-black border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading && votes.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Results Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {ranked.map((name, i) => {
              const count = tally[name] || 0
              const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0"
              return (
                <div
                  key={name}
                  className={`relative p-5 rounded-xl border ${
                    i === 0 && count > 0
                      ? "border-[#dc2626]/30 bg-[#dc2626]/5"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  {i === 0 && count > 0 && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-[#dc2626]">
                      Leading
                    </span>
                  )}
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">
                    #{i + 1}
                  </p>
                  <h3 className="text-sm font-bold text-black mb-3 leading-tight">
                    {name}
                  </h3>
                  <p className="text-3xl font-bold text-black tabular-nums">
                    {count}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {pct}% of votes
                  </p>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        i === 0 && count > 0 ? "bg-[#dc2626]" : "bg-neutral-400"
                      }`}
                      style={{ width: `${(count / maxVotes) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Vote Log Table */}
          <div>
            <h2 className="text-lg font-bold text-black mb-4">
              Vote Log
              <span className="ml-2 text-sm font-normal text-neutral-400">
                ({votes.length})
              </span>
            </h2>
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="text-left px-4 py-3 font-medium text-neutral-500 text-xs uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500 text-xs uppercase tracking-wider">
                      Voted For
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500 text-xs uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-500 text-xs uppercase tracking-wider">
                      Time
                    </th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {votes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-neutral-400"
                      >
                        No votes yet
                      </td>
                    </tr>
                  ) : (
                    votes.map((vote) => (
                      <tr
                        key={vote.id}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-neutral-700 font-medium">
                          {vote.email}
                        </td>
                        <td className="px-4 py-3 text-neutral-900 font-semibold">
                          {vote.finalist}
                        </td>
                        <td className="px-4 py-3">
                          {vote.isRegistered ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-500">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-neutral-400 text-xs">
                          {vote.createdAt
                            ? new Date(vote.createdAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-2 py-3">
                          <button
                            onClick={() => deleteVote(vote.id)}
                            disabled={deleting.has(vote.id)}
                            className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors disabled:opacity-40"
                            title="Delete vote"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

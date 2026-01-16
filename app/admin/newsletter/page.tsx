"use client"

import { useEffect, useState } from "react"

interface Subscriber {
  id: string
  email: string
  source: string
  status: string
  subscribedAt: string
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("active")

  useEffect(() => {
    fetchSubscribers()
  }, [status])

  async function fetchSubscribers() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (status) params.set("status", status)

      const response = await fetch(`/api/admin/data/newsletter?${params}`)
      const data = await response.json()
      setSubscribers(data.subscribers || [])
    } catch (error) {
      console.error("Failed to fetch subscribers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSubscribers = subscribers.filter((sub) => {
    if (!search) return true
    return sub.email?.toLowerCase().includes(search.toLowerCase())
  })

  const exportToCSV = () => {
    const headers = ["Email", "Source", "Status", "Subscribed Date"]
    const rows = filteredSubscribers.map((sub) => [
      sub.email,
      sub.source,
      sub.status,
      sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : "",
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Newsletter
          </h1>
          <p className="text-sm text-neutral-500">
            {filteredSubscribers.length} subscribers
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-800 transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email..."
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
            />
          </div>
          <div className="w-40">
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-neutral-200 text-sm text-black focus:outline-none focus:border-black"
            >
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-neutral-500">Loading subscribers...</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-neutral-500">No subscribers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Subscribed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-black">
                      {sub.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 capitalize">
                      {sub.source}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${
                          sub.status === "active"
                            ? "bg-black text-white"
                            : "bg-neutral-200 text-neutral-500"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">
                      {sub.subscribedAt
                        ? new Date(sub.subscribedAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

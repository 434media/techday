"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"

// Mock data - will be fetched from Firestore
const mockRegistrations = [
  {
    id: "TD26-A1B2C3",
    name: "John Smith",
    email: "john@techstartup.com",
    category: "founder",
    company: "TechStartup Inc",
    registeredAt: "2026-10-15T10:30:00Z",
    events: ["techday", "techfuel", "networking"],
  },
  {
    id: "TD26-D4E5F6",
    name: "Sarah Johnson",
    email: "sarah@vcfirm.com",
    category: "investor",
    company: "SA Ventures",
    registeredAt: "2026-10-15T14:22:00Z",
    events: ["techday", "networking"],
  },
  {
    id: "TD26-G7H8I9",
    name: "Mike Chen",
    email: "mike@utsa.edu",
    category: "student",
    company: "UTSA",
    registeredAt: "2026-10-16T09:15:00Z",
    events: ["techday", "techfuel"],
  },
  {
    id: "TD26-J1K2L3",
    name: "Emily Davis",
    email: "emily@cityofsa.gov",
    category: "government",
    company: "City of San Antonio",
    registeredAt: "2026-10-16T11:45:00Z",
    events: ["techday"],
  },
  {
    id: "TD26-M4N5O6",
    name: "Carlos Rodriguez",
    email: "carlos@enterprise.com",
    category: "attendee",
    company: "Enterprise Solutions",
    registeredAt: "2026-10-17T08:30:00Z",
    events: ["techday", "networking"],
  },
]

const mockPitchSubmissions = [
  {
    id: "TF26-001",
    companyName: "NeuralPath AI",
    founderName: "Dr. Lisa Wang",
    email: "lisa@neuralpath.ai",
    stage: "Seed",
    industry: "AI / Machine Learning",
    submittedAt: "2026-10-10T15:20:00Z",
    status: "under_review",
  },
  {
    id: "TF26-002",
    companyName: "SecureStack",
    founderName: "James Miller",
    email: "james@securestack.io",
    stage: "Pre-seed / Idea Stage",
    industry: "Cybersecurity",
    submittedAt: "2026-10-11T09:45:00Z",
    status: "finalist",
  },
  {
    id: "TF26-003",
    companyName: "GreenGrid",
    founderName: "Maria Garcia",
    email: "maria@greengrid.co",
    stage: "Seed",
    industry: "Clean Energy / Sustainability",
    submittedAt: "2026-10-12T14:30:00Z",
    status: "pending",
  },
  {
    id: "TF26-004",
    companyName: "MedFlow",
    founderName: "Dr. Robert Kim",
    email: "robert@medflow.health",
    stage: "Series A",
    industry: "Healthcare / BioTech",
    submittedAt: "2026-10-13T10:00:00Z",
    status: "finalist",
  },
  {
    id: "TF26-005",
    companyName: "EduTech Pro",
    founderName: "Amanda Brooks",
    email: "amanda@edutechpro.com",
    stage: "Pre-seed / Idea Stage",
    industry: "EdTech",
    submittedAt: "2026-10-14T16:15:00Z",
    status: "rejected",
  },
]

type Tab = "overview" | "registrations" | "pitches"
type StatusFilter = "all" | "pending" | "under_review" | "finalist" | "rejected"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  under_review: "bg-blue-500/20 text-blue-400",
  finalist: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Calculate stats
  const totalRegistrations = mockRegistrations.length
  const categoryBreakdown = mockRegistrations.reduce(
    (acc, reg) => {
      acc[reg.category] = (acc[reg.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalPitches = mockPitchSubmissions.length
  const finalists = mockPitchSubmissions.filter((p) => p.status === "finalist").length
  const pendingReview = mockPitchSubmissions.filter((p) => p.status === "pending" || p.status === "under_review").length

  // Filter functions
  const filteredRegistrations = mockRegistrations.filter(
    (reg) =>
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPitches = mockPitchSubmissions.filter((pitch) => {
    const matchesSearch =
      pitch.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pitch.founderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pitch.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || pitch.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportToCSV = (data: typeof mockRegistrations | typeof mockPitchSubmissions, filename: string) => {
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((item) => Object.values(item).join(","))
    const csv = [headers, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-mono text-sm text-primary hover:underline">
                ← Back to Site
              </Link>
              <span className="text-border">|</span>
              <h1 className="font-bold text-foreground">Tech Day Admin</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tech Bloc Admin</span>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-mono text-sm">
                TB
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {(["overview", "registrations", "pitches"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-card border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Registrations</p>
                <p className="text-4xl font-bold text-primary">{totalRegistrations}</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Pitch Submissions</p>
                <p className="text-4xl font-bold text-secondary">{totalPitches}</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Tech Fuel Finalists</p>
                <p className="text-4xl font-bold text-green-400">{finalists}</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                <p className="text-4xl font-bold text-yellow-400">{pendingReview}</p>
              </div>
            </div>

            {/* Registration Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-4">Registration by Category</h3>
                <div className="space-y-3">
                  {Object.entries(categoryBreakdown).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground capitalize">{category}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(count / totalRegistrations) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-foreground w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-4">Pitch Status Overview</h3>
                <div className="space-y-3">
                  {(["pending", "under_review", "finalist", "rejected"] as const).map((status) => {
                    const count = mockPitchSubmissions.filter((p) => p.status === status).length
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className={`text-sm px-2 py-0.5 rounded ${statusColors[status]} capitalize`}>
                          {status.replace("_", " ")}
                        </span>
                        <span className="text-sm font-mono text-foreground">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => exportToCSV(mockRegistrations, "registrations.csv")}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                >
                  Export Registrations
                </button>
                <button
                  onClick={() => exportToCSV(mockPitchSubmissions, "pitch-submissions.csv")}
                  className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Export Pitch Submissions
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Search & Export */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 max-w-md px-4 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => exportToCSV(filteredRegistrations, "registrations.csv")}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Export CSV
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ticket ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm text-primary">{reg.id}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{reg.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{reg.email}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 bg-muted rounded capitalize">{reg.category}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{reg.company}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(reg.registeredAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-muted-foreground">
              Showing {filteredRegistrations.length} of {mockRegistrations.length} registrations
            </p>
          </motion.div>
        )}

        {/* Pitches Tab */}
        {activeTab === "pitches" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search companies or founders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="px-4 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="finalist">Finalist</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <button
                onClick={() => exportToCSV(filteredPitches, "pitch-submissions.csv")}
                className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/90 transition-colors whitespace-nowrap"
              >
                Export CSV
              </button>
            </div>

            {/* Cards View */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPitches.map((pitch) => (
                <div key={pitch.id} className="p-6 bg-card border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{pitch.id}</p>
                      <h3 className="font-bold text-foreground">{pitch.companyName}</h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[pitch.status]}`}>
                      {pitch.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Founder</span>
                      <span className="text-foreground">{pitch.founderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry</span>
                      <span className="text-foreground">{pitch.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stage</span>
                      <span className="text-foreground">{pitch.stage}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex gap-2">
                    <button className="flex-1 px-3 py-2 text-xs font-medium bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 px-3 py-2 text-xs font-medium bg-muted text-foreground rounded hover:bg-muted/80 transition-colors">
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Showing {filteredPitches.length} of {mockPitchSubmissions.length} submissions
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export interface Session {
  id: string
  title: string
  description: string
  time: string
  duration: string
  speakers: string[]
  track: "emerging" | "founders" | "general"
}

const schedule: Session[] = [
  {
    id: "1",
    title: "Doors Open & Registration",
    description: "Check in, grab your badge, and network with fellow attendees.",
    time: "11:00 AM",
    duration: "1 hour",
    speakers: [],
    track: "general",
  },
  {
    id: "2",
    title: "Opening Keynote: The Future is Invented Here",
    description: "Welcome to Tech Day 2026 and a look at San Antonio's tech renaissance.",
    time: "12:00 PM",
    duration: "45 min",
    speakers: ["Mayor Ron Nirenberg"],
    track: "general",
  },
  {
    id: "3",
    title: "Leveraging Funding from Hyperscalers",
    description: "How to secure support and resources from major cloud providers for your startup.",
    time: "1:00 PM",
    duration: "45 min",
    speakers: ["Sarah Chen", "Michael Rodriguez"],
    track: "founders",
  },
  {
    id: "4",
    title: "AI & Healthcare Innovation in SA",
    description: "Exploring the intersection of artificial intelligence and healthcare in our region.",
    time: "1:00 PM",
    duration: "45 min",
    speakers: ["Dr. Amanda Foster"],
    track: "emerging",
  },
  {
    id: "5",
    title: "Panel: Building in Public",
    description: "Founders share their journeys of transparency, community building, and growth.",
    time: "2:00 PM",
    duration: "1 hour",
    speakers: ["Alex Kim", "Jordan Martinez", "Casey Wong"],
    track: "founders",
  },
  {
    id: "6",
    title: "Cybersecurity: The New Frontier",
    description: "San Antonio's growing role as a cybersecurity hub and emerging opportunities.",
    time: "2:00 PM",
    duration: "1 hour",
    speakers: ["Col. James Patterson (Ret.)"],
    track: "emerging",
  },
  {
    id: "7",
    title: "Coffee Break & Networking",
    description: "Fuel up and make connections in the sponsor pavilion.",
    time: "3:00 PM",
    duration: "30 min",
    speakers: [],
    track: "general",
  },
  {
    id: "8",
    title: "Pitch Competition: Tech Fuel Finals",
    description: "Watch SA's hottest startups compete for prizes and bragging rights.",
    time: "3:30 PM",
    duration: "1.5 hours",
    speakers: ["Tech Fuel Finalists"],
    track: "general",
  },
  {
    id: "9",
    title: "Closing Remarks & Networking Reception",
    description: "Wrap up the day with awards and an evening of networking.",
    time: "5:00 PM",
    duration: "2 hours",
    speakers: [],
    track: "general",
  },
]

type TrackFilter = "all" | "emerging" | "founders" | "general"

export function Schedule() {
  const [filter, setFilter] = useState<TrackFilter>("all")

  const filteredSchedule =
    filter === "all" ? schedule : schedule.filter((s) => s.track === filter || s.track === "general")

  const filters: { value: TrackFilter; label: string }[] = [
    { value: "all", label: "All Sessions" },
    { value: "emerging", label: "Emerging Industries" },
    { value: "founders", label: "Founders & Investors" },
  ]

  return (
    <section className="py-24 bg-muted">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">NOVEMBER 14, 2026</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">Event Schedule</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A full day of panels, keynotes, networking, and the Tech Fuel pitch competition.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Schedule Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-24 top-0 bottom-0 w-px bg-border" />

          <AnimatePresence mode="wait">
            <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {filteredSchedule.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex flex-col md:flex-row gap-4 md:gap-8 pb-8 last:pb-0"
                >
                  {/* Time - styled as ticket stub */}
                  <div className="md:w-24 shrink-0">
                    <div className="inline-flex md:flex-col items-center md:items-end gap-1">
                      <span className="font-mono text-sm text-primary font-bold">{session.time}</span>
                      <span className="hidden md:block font-mono text-[10px] text-muted-foreground tracking-wider">{session.duration}</span>
                    </div>
                  </div>

                  {/* Timeline dot - enhanced */}
                  <div
                    className={`absolute left-0 md:left-24 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background shadow-md ${
                      session.track === "emerging"
                        ? "bg-primary"
                        : session.track === "founders"
                          ? "bg-foreground"
                          : "bg-muted-foreground"
                    }`}
                  />

                  {/* Content Card - ticket style */}
                  <div
                    className={`flex-1 ml-6 md:ml-0 rounded-lg border-2 overflow-hidden transition-all shadow-sm hover:shadow-md ${
                      session.track === "general"
                        ? "bg-white border-border"
                        : session.track === "emerging"
                          ? "bg-white border-primary/30 hover:border-primary/60"
                          : "bg-white border-foreground/30 hover:border-foreground/60"
                    }`}
                  >
                    {/* Ticket header band */}
                    <div className={`h-1 ${
                      session.track === "emerging"
                        ? "bg-gradient-to-r from-primary to-primary/50"
                        : session.track === "founders"
                          ? "bg-gradient-to-r from-foreground to-foreground/50"
                          : "bg-gradient-to-r from-muted-foreground to-muted-foreground/50"
                    }`} />
                    
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-foreground leading-snug">{session.title}</h3>
                        <span className="md:hidden text-xs font-mono text-muted-foreground font-medium bg-muted px-2 py-1 rounded">{session.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{session.description}</p>
                      
                      {session.speakers.length > 0 && (
                        <>
                          {/* Perforated divider */}
                          <div className="my-3 border-t border-dashed border-border" />
                          <div className="flex flex-wrap gap-2">
                            {session.speakers.map((speaker) => (
                              <span key={speaker} className="text-xs px-3 py-1.5 bg-muted rounded-full text-foreground font-medium border border-border">
                                {speaker}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

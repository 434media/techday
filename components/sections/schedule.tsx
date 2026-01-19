"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

interface Session {
  id: string
  title: string
  description: string
  time: string
  duration: number
  room: string
  speakerId?: string
  type: "keynote" | "talk" | "workshop" | "panel" | "break" | "networking"
}

type TrackFilter = "all" | "keynote" | "talk" | "workshop" | "panel"

export function Schedule() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<TrackFilter>("all")

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await fetch("/api/content/schedule")
        const data = await response.json()
        setSessions(data.sessions || [])
      } catch (error) {
        console.error("Failed to fetch schedule:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  const filteredSessions =
    filter === "all" ? sessions : sessions.filter((s) => s.type === filter || s.type === "break" || s.type === "networking")

  const filters: { value: TrackFilter; label: string }[] = [
    { value: "all", label: "All Sessions" },
    { value: "keynote", label: "Keynotes" },
    { value: "talk", label: "Talks" },
    { value: "workshop", label: "Workshops" },
    { value: "panel", label: "Panels" },
  ]

  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDuration = (duration: number) => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60)
      const mins = duration % 60
      return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? "s" : ""}`
    }
    return `${duration} min`
  }

  const getTypeColor = (type: Session["type"]) => {
    switch (type) {
      case "keynote":
        return "bg-primary"
      case "talk":
        return "bg-chart-4"
      case "workshop":
        return "bg-amber-500"
      case "panel":
        return "bg-foreground"
      case "break":
      case "networking":
        return "bg-muted-foreground"
      default:
        return "bg-muted-foreground"
    }
  }

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
          <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">APRIL 9, 2026</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">Event Schedule</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A full day of panels, keynotes, networking, and the Tech Fuel pitch competition.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading schedule...</p>
          </div>
        )}

        {/* No Sessions Message */}
        {!isLoading && sessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Schedule coming soon...</p>
          </div>
        )}

        {/* Filter Tabs */}
        {!isLoading && sessions.length > 0 && (
          <>
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
                  {filteredSessions.map((session, index) => (
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
                          <span className="font-mono text-sm text-primary font-bold">{formatTime(session.time)}</span>
                          <span className="hidden md:block font-mono text-[10px] text-muted-foreground tracking-wider">{formatDuration(session.duration)}</span>
                        </div>
                      </div>

                      {/* Timeline dot - enhanced */}
                      <div
                        className={`absolute left-0 md:left-24 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background shadow-md ${getTypeColor(session.type)}`}
                      />

                      {/* Content Card - ticket style */}
                      <div
                        className={`flex-1 ml-6 md:ml-0 rounded-lg border-2 overflow-hidden transition-all shadow-sm hover:shadow-md ${
                          session.type === "break" || session.type === "networking"
                            ? "bg-white border-border"
                            : session.type === "keynote"
                              ? "bg-white border-primary/30 hover:border-primary/60"
                              : "bg-white border-foreground/20 hover:border-foreground/40"
                        }`}
                      >
                        {/* Ticket header band */}
                        <div className={`h-1 ${
                          session.type === "keynote"
                            ? "bg-linear-to-r from-primary to-primary/50"
                            : session.type === "talk"
                              ? "bg-linear-to-r from-chart-4 to-chart-4/50"
                              : session.type === "workshop"
                                ? "bg-linear-to-r from-amber-500 to-amber-500/50"
                                : session.type === "panel"
                                  ? "bg-linear-to-r from-foreground to-foreground/50"
                                  : "bg-linear-to-r from-muted-foreground to-muted-foreground/50"
                        }`} />
                        
                        <div className="p-5">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg font-bold text-foreground leading-snug">{session.title}</h3>
                            <span className="text-xs font-mono text-muted-foreground font-medium bg-muted px-2 py-1 rounded capitalize">{session.type}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{session.description}</p>
                          
                          {session.room && (
                            <>
                              <div className="my-3 border-t border-dashed border-border" />
                              <div className="flex flex-wrap gap-2">
                                <span className="text-xs px-3 py-1.5 bg-muted rounded-full text-foreground font-medium border border-border">
                                  📍 {session.room}
                                </span>
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
          </>
        )}
      </div>
    </section>
  )
}

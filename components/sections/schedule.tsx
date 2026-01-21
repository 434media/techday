"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

interface Speaker {
  id: string
  name: string
  title: string
  company: string
  imageUrl: string
}

interface Session {
  id: string
  title: string
  description: string
  time: string
  duration: number
  room: string
  speakerIds?: string[]
  type: "keynote" | "talk" | "workshop" | "panel" | "break" | "networking"
  track?: "emerging" | "founders" | "ai" | ""
}

type TrackFilter = "all" | "emerging" | "founders" | "ai"

interface ScheduleProps {
  variant?: "light" | "dark"
}

// Track colors matching the about section design
const TRACK_COLORS = {
  emerging: {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    borderHover: "hover:border-emerald-400",
    text: "text-emerald-700",
    gradient: "from-emerald-500 to-emerald-400",
    dot: "bg-emerald-500",
  },
  founders: {
    bg: "bg-violet-500",
    bgLight: "bg-violet-50",
    border: "border-violet-200",
    borderHover: "hover:border-violet-400",
    text: "text-violet-700",
    gradient: "from-violet-500 to-violet-400",
    dot: "bg-violet-500",
  },
  ai: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    borderHover: "hover:border-blue-400",
    text: "text-blue-700",
    gradient: "from-blue-500 to-blue-400",
    dot: "bg-blue-500",
  },
}

export function Schedule({ variant = "light" }: ScheduleProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<TrackFilter>("all")
  
  const isDark = variant === "dark"

  useEffect(() => {
    async function fetchData() {
      try {
        const [scheduleRes, speakersRes] = await Promise.all([
          fetch("/api/content/schedule"),
          fetch("/api/content/speakers"),
        ])
        const scheduleData = await scheduleRes.json()
        const speakersData = await speakersRes.json()
        setSessions(scheduleData.sessions || [])
        setSpeakers(speakersData.speakers || [])
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Only show breaks when "All Sessions" is selected
  const filteredSessions =
    filter === "all" 
      ? sessions 
      : sessions.filter((s) => s.track === filter || s.type === "keynote")

  const filters: { value: TrackFilter; label: string; color?: string }[] = [
    { value: "all", label: "All Sessions" },
    { value: "emerging", label: "Emerging Industries", color: "emerald" },
    { value: "founders", label: "Founders & Investors", color: "violet" },
    { value: "ai", label: "AI", color: "blue" },
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

  const getSessionSpeakers = (session: Session): Speaker[] => {
    if (!session.speakerIds || session.speakerIds.length === 0) return []
    return speakers.filter((s) => session.speakerIds?.includes(s.id))
  }

  const getTrackStyle = (track?: string) => {
    if (!track || track === "") return null
    return TRACK_COLORS[track as keyof typeof TRACK_COLORS]
  }

  return (
    <section className={`py-24 md:py-32 ${isDark ? "bg-white/5" : "bg-muted"}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">April 10, 2026</p>
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[0.95] tracking-tight ${isDark ? "text-white" : "text-foreground"}`}>
            Event Schedule
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? "text-white/60" : "text-muted-foreground"}`}>
            A full day of panels, keynotes, networking, and the Tech Fuel pitch competition.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className={isDark ? "text-white/60" : "text-muted-foreground"}>Loading schedule...</p>
          </div>
        )}

        {/* No Sessions Message */}
        {!isLoading && sessions.length === 0 && (
          <div className="text-center py-12">
            <p className={isDark ? "text-white/60" : "text-muted-foreground"}>Schedule coming soon...</p>
          </div>
        )}

        {/* Filter Tabs */}
        {!isLoading && sessions.length > 0 && (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {filters.map((f) => {
                const isActive = filter === f.value
                const colorClass = f.color === "emerald" ? "bg-emerald-500" 
                  : f.color === "violet" ? "bg-violet-500" 
                  : f.color === "blue" ? "bg-blue-500" 
                  : null
                
                return (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                      isActive
                        ? f.color 
                          ? `${f.color === "emerald" ? "bg-emerald-500" : f.color === "violet" ? "bg-violet-500" : "bg-blue-500"} text-white`
                          : "bg-primary text-primary-foreground"
                        : isDark
                          ? "bg-white/10 text-white/70 hover:text-white border border-white/10"
                          : "bg-white text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    {colorClass && !isActive && (
                      <span className={`w-2 h-2 rounded-full ${colorClass}`} />
                    )}
                    {f.label}
                  </button>
                )
              })}
            </div>

            {/* Schedule Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className={`absolute left-0 md:left-24 top-0 bottom-0 w-px ${isDark ? "bg-white/10" : "bg-border"}`} />

              <AnimatePresence mode="wait">
                <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {filteredSessions.map((session, index) => {
                    const trackStyle = getTrackStyle(session.track)
                    const sessionSpeakers = getSessionSpeakers(session)
                    const isBreakOrNetworking = session.type === "break" || session.type === "networking"
                    
                    return (
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

                        {/* Timeline dot - colored by track */}
                        <div
                          className={`absolute left-0 md:left-24 -translate-x-1/2 w-4 h-4 rounded-full border-4 shadow-md ${isDark ? "border-foreground" : "border-background"} ${
                            trackStyle ? trackStyle.dot : isBreakOrNetworking ? "bg-muted-foreground" : session.type === "keynote" ? "bg-primary" : "bg-foreground"
                          }`}
                        />

                        {/* Content Card - styled by track */}
                        <div
                          className={`flex-1 ml-6 md:ml-0 rounded-xl border-2 overflow-hidden transition-all shadow-sm hover:shadow-md ${
                            isDark
                              ? isBreakOrNetworking
                                ? "bg-white/5 border-white/10"
                                : trackStyle
                                  ? "bg-white/5 border-white/20 hover:border-white/40"
                                  : session.type === "keynote"
                                    ? "bg-white/5 border-primary/30 hover:border-primary/60"
                                    : "bg-white/5 border-white/20 hover:border-white/40"
                              : isBreakOrNetworking
                                ? "bg-white border-border"
                                : trackStyle
                                  ? `bg-white ${trackStyle.border} ${trackStyle.borderHover}`
                                  : session.type === "keynote"
                                    ? "bg-white border-primary/30 hover:border-primary/60"
                                    : "bg-white border-foreground/20 hover:border-foreground/40"
                          }`}
                        >
                          {/* Ticket header band - colored by track */}
                          <div className={`h-1.5 ${
                            trackStyle
                              ? `bg-linear-to-r ${trackStyle.gradient}`
                              : session.type === "keynote"
                                ? "bg-linear-to-r from-primary to-primary/50"
                                : isBreakOrNetworking
                                  ? "bg-linear-to-r from-muted-foreground to-muted-foreground/50"
                                  : isDark ? "bg-linear-to-r from-white to-white/50" : "bg-linear-to-r from-foreground to-foreground/50"
                          }`} />
                          
                          <div className="p-5 md:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                              <h3 className={`text-lg font-bold leading-tight ${isDark ? "text-white" : "text-foreground"}`}>{session.title}</h3>
                              <div className="flex items-center gap-2">
                                {/* Track Badge */}
                                {trackStyle && (
                                  <span className={`text-xs font-mono font-semibold px-2.5 py-1 rounded ${trackStyle.bgLight} ${trackStyle.text}`}>
                                    {session.track === "emerging" ? "Emerging Industries" : session.track === "founders" ? "Founders & Investors" : "AI"}
                                  </span>
                                )}
                                {/* Type Badge */}
                                <span className={`text-xs font-mono font-medium px-2 py-1 rounded capitalize ${isDark ? "bg-white/10 text-white/70" : "bg-muted text-muted-foreground"}`}>{session.type}</span>
                              </div>
                            </div>
                            <p className={`text-sm mb-4 leading-relaxed ${isDark ? "text-white/60" : "text-muted-foreground"}`}>{session.description}</p>
                            
                            {/* Speakers Section */}
                            {sessionSpeakers.length > 0 && (
                              <div className={`mb-4 ${isDark ? "" : ""}`}>
                                <p className={`text-xs font-mono uppercase tracking-wider mb-2 ${isDark ? "text-white/40" : "text-muted-foreground"}`}>
                                  {sessionSpeakers.length === 1 ? "Speaker" : "Speakers"}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  {sessionSpeakers.map((speaker) => (
                                    <div key={speaker.id} className="flex items-center gap-2">
                                      {speaker.imageUrl ? (
                                        <img
                                          src={speaker.imageUrl}
                                          alt={speaker.name}
                                          className="w-8 h-8 rounded-md object-cover bg-muted grayscale"
                                        />
                                      ) : (
                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium ${isDark ? "bg-white/10 text-white/70" : "bg-muted text-muted-foreground"}`}>
                                          {speaker.name.charAt(0)}
                                        </div>
                                      )}
                                      <div>
                                        <p className={`text-sm font-medium ${isDark ? "text-white" : "text-foreground"}`}>{speaker.name}</p>
                                        <p className={`text-xs ${isDark ? "text-white/50" : "text-muted-foreground"}`}>
                                          {speaker.company}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {session.room && (
                              <>
                                <div className={`my-4 border-t border-dashed ${isDark ? "border-white/10" : "border-border"}`} />
                                <div className="flex flex-wrap gap-2">
                                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${isDark ? "bg-white/10 text-white/80 border-white/10" : "bg-muted text-foreground border-border"}`}>
                                    📍 {session.room}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

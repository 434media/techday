"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, Calendar, Image as ImageIcon } from "lucide-react"
import { Editable } from "@/components/editable"

interface Speaker {
  id: string
  name: string
  title: string
  company: string
  imageUrl: string
  bio?: string
}

interface Session {
  id: string
  title: string
  description: string
  time: string
  duration: number
  room: string
  moderatorIds?: string[]
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

// ICS calendar helpers
const EVENT_DATE = "2026-04-21"
const EVENT_LOCATION = "Boeing Center at Tech Port, San Antonio, TX"

function toICSDate(date: string, time: string): string {
  const [hours, minutes] = time.split(":")
  // CDT (April) = UTC-5, format: 20260421T130000Z
  const utcHour = parseInt(hours) + 5
  return `${date.replace(/-/g, "")}T${String(utcHour).padStart(2, "0")}${minutes}00Z`
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number)
  const totalMin = h * 60 + m + minutes
  return `${String(Math.floor(totalMin / 60)).padStart(2, "0")}:${String(totalMin % 60).padStart(2, "0")}`
}

function generateICS(events: { title: string; description: string; time: string; duration: number; room: string }[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TechDay SA//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ]
  for (const event of events) {
    const dtStart = toICSDate(EVENT_DATE, event.time)
    const endTime = addMinutes(event.time, event.duration)
    const dtEnd = toICSDate(EVENT_DATE, endTime)
    const desc = event.description.replace(/\n/g, "\\n").replace(/,/g, "\\,")
    lines.push(
      "BEGIN:VEVENT",
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${event.room ? `${event.room} - ${EVENT_LOCATION}` : EVENT_LOCATION}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT"
    )
  }
  lines.push("END:VCALENDAR")
  return lines.join("\r\n")
}

function downloadICS(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function googleCalendarUrl(events: { title: string; description: string; time: string; duration: number; room: string }[], trackLabel?: string): string {
  if (events.length === 1) {
    const e = events[0]
    const dtStart = toICSDate(EVENT_DATE, e.time)
    const dtEnd = toICSDate(EVENT_DATE, addMinutes(e.time, e.duration))
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: e.title,
      dates: `${dtStart}/${dtEnd}`,
      details: e.description,
      location: e.room ? `${e.room} - ${EVENT_LOCATION}` : EVENT_LOCATION,
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }
  // Multiple events: create a single block spanning all sessions
  const sorted = [...events].sort((a, b) => a.time.localeCompare(b.time))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const dtStart = toICSDate(EVENT_DATE, first.time)
  const dtEnd = toICSDate(EVENT_DATE, addMinutes(last.time, last.duration))
  const details = sorted.map(e => `${e.time} — ${e.title}${e.room ? ` (${e.room})` : ""}`).join("\n")
  const eventName = trackLabel ? `Tech Day 2026 — ${trackLabel}` : `Tech Day 2026 — All Sessions`
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventName,
    dates: `${dtStart}/${dtEnd}`,
    details,
    location: EVENT_LOCATION,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function outlookCalendarUrl(events: { title: string; description: string; time: string; duration: number; room: string }[], trackLabel?: string): string {
  if (events.length === 1) {
    const e = events[0]
    const start = `${EVENT_DATE}T${e.time}:00`
    const endTime = addMinutes(e.time, e.duration)
    const end = `${EVENT_DATE}T${endTime}:00`
    const params = new URLSearchParams({
      path: "/calendar/action/compose",
      rru: "addevent",
      subject: e.title,
      startdt: start,
      enddt: end,
      body: e.description,
      location: e.room ? `${e.room} - ${EVENT_LOCATION}` : EVENT_LOCATION,
    })
    return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`
  }
  // Multiple events: create a single block spanning all sessions
  const sorted = [...events].sort((a, b) => a.time.localeCompare(b.time))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const start = `${EVENT_DATE}T${first.time}:00`
  const end = `${EVENT_DATE}T${addMinutes(last.time, last.duration)}:00`
  const body = sorted.map(e => `${e.time} — ${e.title}${e.room ? ` (${e.room})` : ""}`).join("\n")
  const eventName = trackLabel ? `Tech Day 2026 — ${trackLabel}` : `Tech Day 2026 — All Sessions`
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: eventName,
    startdt: start,
    enddt: end,
    body,
    location: EVENT_LOCATION,
  })
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`
}

const TRACK_LABELS: Record<string, string> = {
  emerging: "Emerging Industries Sessions",
  founders: "Founders & Investors Sessions",
  ai: "AI Sessions",
}

function CalendarDropdown({
  events,
  filename,
  isDark,
  label,
  portal = false,
  trackFilter,
}: {
  events: { title: string; description: string; time: string; duration: number; room: string }[]
  filename: string
  isDark: boolean
  label?: string
  portal?: boolean
  trackFilter?: string
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && 
          btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const calTrackLabel = trackFilter && trackFilter !== "all" ? TRACK_LABELS[trackFilter] : undefined

  const items = [
    {
      label: "Google Calendar",
      onClick: () => {
        window.open(googleCalendarUrl(events, calTrackLabel), "_blank", "noopener,noreferrer")
        setOpen(false)
      },
    },
    {
      label: "Apple Calendar",
      onClick: () => {
        downloadICS(filename, generateICS(events))
        setOpen(false)
      },
    },
    {
      label: "Outlook",
      onClick: () => {
        window.open(outlookCalendarUrl(events, calTrackLabel), "_blank", "noopener,noreferrer")
        setOpen(false)
      },
    },
  ]

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    if (!open && portal && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    }
    setOpen(!open)
  }

  const dropdownMenu = (
    <div
      ref={dropdownRef}
      className={`${portal ? "fixed" : "absolute right-0 top-full mt-1"} z-9999 min-w-45 rounded-lg border shadow-lg ${
        isDark
          ? "bg-foreground border-white/15 shadow-black/40"
          : "bg-white border-border shadow-black/10"
      }`}
      style={portal && pos ? { top: pos.top, right: pos.right } : undefined}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={(e) => {
            e.stopPropagation()
            item.onClick()
          }}
          className={`w-full flex items-center px-3 py-2.5 text-xs font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
            isDark
              ? "text-white/70 hover:text-white hover:bg-white/8"
              : "text-foreground/70 hover:text-foreground hover:bg-muted"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
          isDark
            ? "text-white/50 hover:text-white hover:bg-white/6"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <Calendar className="w-3.5 h-3.5" />
        {label ?? <span className="hidden md:inline">Add to Calendar</span>}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (portal ? createPortal(dropdownMenu, document.body) : dropdownMenu)}
    </div>
  )
}

// Social card constants
const CARD_W = 1080
const CARD_H = 1350

const TRACK_META: Record<string, { label: string; color: string; colorLight: string; description: string }> = {
  emerging: {
    label: "Emerging Industries",
    color: "#10b981",
    colorLight: "rgba(16,185,129,0.12)",
    description: "Explore cutting-edge technologies transforming San Antonio: cybersecurity, healthcare innovation, aerospace, and clean energy.",
  },
  founders: {
    label: "Founders & Investors",
    color: "#8b5cf6",
    colorLight: "rgba(139,92,246,0.12)",
    description: "Learn from successful founders and connect with investors. Fundraising strategies, building in public, and scaling your startup.",
  },
  ai: {
    label: "AI",
    color: "#3b82f6",
    colorLight: "rgba(59,130,246,0.12)",
    description: "Dive into the future of artificial intelligence. From LLMs to computer vision, discover how AI is reshaping industries.",
  },
}

async function loadArrowSvgImage(): Promise<HTMLImageElement | null> {
  try {
    const res = await fetch("/api/svg")
    if (!res.ok) return null
    const svgText = await res.text()
    const blob = new Blob([svgText], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
      img.src = url
    })
  } catch {
    return null
  }
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

function formatTimeShort(time: string) {
  if (!time) return ""
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

async function generateTrackCard(
  track: string,
  sessions: Session[],
  speakers: Speaker[],
  arrowImg: HTMLImageElement | null,
): Promise<void> {
  const meta = TRACK_META[track]
  if (!meta) return

  const trackSessions = sessions.filter(
    (s) => s.track === track || (s.type === "keynote" && s.track === "")
  )

  const canvas = document.createElement("canvas")
  canvas.width = CARD_W
  canvas.height = CARD_H
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Helper to resolve speaker names for a session
  const getSpeakerNames = (session: Session): string[] => {
    const ids = [...(session.moderatorIds || []), ...(session.speakerIds || [])]
    return speakers.filter(s => ids.includes(s.id)).map(s => s.name)
  }

  // --- Background ---
  ctx.fillStyle = "#0a0a0a"
  ctx.fillRect(0, 0, CARD_W, CARD_H)

  // Subtle gradient overlay at top
  const topGrad = ctx.createLinearGradient(0, 0, 0, 500)
  topGrad.addColorStop(0, meta.colorLight)
  topGrad.addColorStop(1, "transparent")
  ctx.fillStyle = topGrad
  ctx.fillRect(0, 0, CARD_W, 500)

  // Bottom vignette
  const botGrad = ctx.createLinearGradient(0, CARD_H - 200, 0, CARD_H)
  botGrad.addColorStop(0, "transparent")
  botGrad.addColorStop(1, "rgba(0,0,0,0.4)")
  ctx.fillStyle = botGrad
  ctx.fillRect(0, CARD_H - 200, CARD_W, 200)

  // Arrow SVG — top-right corner (hero-style placement), prominent
  if (arrowImg) {
    ctx.save()
    ctx.globalAlpha = 0.25
    const arrowSize = 360
    ctx.drawImage(arrowImg, CARD_W - arrowSize - 24, -40, arrowSize, arrowSize)
    ctx.restore()
  }

  // Track color accent bar at top
  ctx.fillStyle = meta.color
  ctx.fillRect(0, 0, CARD_W, 6)

  // --- Layout constants (8px grid rhythm) ---
  const px = 72 // horizontal padding
  const contentW = CARD_W - px * 2
  const footerH = 80

  // =============================================
  // HEADER BLOCK — event identity
  // =============================================
  let py = 64 // top safe margin

  // "TECH DAY 2026"
  ctx.fillStyle = "#ffffff"
  ctx.font = "700 26px system-ui, -apple-system, sans-serif"
  ctx.letterSpacing = "5px"
  ctx.fillText("TECH DAY", px, py)
  const tdWidth = ctx.measureText("TECH DAY").width
  ctx.fillStyle = meta.color
  ctx.fillText(" 2026", px + tdWidth, py)
  ctx.letterSpacing = "0px"

  py += 32 // 26px font + 6px gap

  // Date + venue
  ctx.fillStyle = "rgba(255,255,255,0.4)"
  ctx.font = "400 17px system-ui, -apple-system, sans-serif"
  ctx.fillText("April 21, 2026  ·  Boeing Center at Tech Port", px, py)

  py += 32 // space before divider

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.10)"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(CARD_W - px, py)
  ctx.stroke()

  // =============================================
  // TRACK BLOCK — name + description
  // Canvas fillText uses BASELINE, not top.
  // For a 56px font, ascent ~42px. We need py + ascent
  // to clear the divider with breathing room.
  // =============================================
  py += 64 // generous gap: divider → track title baseline

  ctx.fillStyle = meta.color
  ctx.font = "800 56px system-ui, -apple-system, sans-serif"
  const trackLines = wrapText(ctx, meta.label.toUpperCase(), contentW)
  for (const line of trackLines) {
    ctx.fillText(line, px, py)
    py += 64 // 56px font + 8px leading
  }

  py += 4 // small optical gap before description

  // Track description
  ctx.fillStyle = "rgba(255,255,255,0.45)"
  ctx.font = "400 19px system-ui, -apple-system, sans-serif"
  const descParaLines = wrapText(ctx, meta.description, contentW)
  for (const line of descParaLines) {
    ctx.fillText(line, px, py)
    py += 26 // 19px font + 7px leading
  }

  py += 32 // breathing room before session cards

  // =============================================
  // SESSION CARDS
  // =============================================
  const sessionAreaEnd = CARD_H - footerH
  const availableH = sessionAreaEnd - py
  const sessionCount = trackSessions.length
  const sessionGap = 12
  const totalGaps = Math.max(0, sessionCount - 1) * sessionGap
  const maxCardH = sessionCount > 0
    ? Math.floor((availableH - totalGaps) / sessionCount)
    : 140
  const sessionCardH = Math.max(80, Math.min(maxCardH, 180))

  for (const session of trackSessions) {
    if (py + sessionCardH > sessionAreaEnd) break

    const timeStr = formatTimeShort(session.time)
    const isKeynote = session.type === "keynote"
    const speakerNames = getSpeakerNames(session)

    // Card background
    drawRoundedRect(ctx, px, py, contentW, sessionCardH, 12)
    ctx.fillStyle = isKeynote ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.035)"
    ctx.fill()
    ctx.strokeStyle = isKeynote ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.07)"
    ctx.lineWidth = 1
    ctx.stroke()

    // Left accent bar
    const accentColor = isKeynote ? "#dc2626" : meta.color
    drawRoundedRect(ctx, px, py, 4, sessionCardH, 2)
    ctx.fillStyle = accentColor
    ctx.fill()

    // Internal padding
    const cardPx = 24 // horizontal padding inside card
    const textX = px + cardPx
    const textMaxW = contentW - cardPx * 2
    let textY = py + 24 // top padding inside card (baseline)

    // Time + Room
    ctx.fillStyle = accentColor
    ctx.font = "600 14px ui-monospace, monospace"
    const timeText = timeStr
    ctx.fillText(timeText, textX, textY)
    if (session.room) {
      const timeW = ctx.measureText(timeText).width
      ctx.fillStyle = "rgba(255,255,255,0.3)"
      ctx.font = "400 13px ui-monospace, monospace"
      ctx.fillText(`  ·  ${session.room}`, textX + timeW, textY)
    }

    // Type badge (top-right of card)
    const badge = isKeynote ? "KEYNOTE" : session.type.toUpperCase()
    ctx.font = "600 10px ui-monospace, monospace"
    const badgeW = ctx.measureText(badge).width + 16
    const badgeX = px + contentW - badgeW - cardPx
    const badgeY = py + 12
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, 20, 4)
    ctx.fillStyle = isKeynote ? "rgba(220,38,38,0.10)" : "rgba(255,255,255,0.05)"
    ctx.fill()
    ctx.fillStyle = isKeynote ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.35)"
    ctx.fillText(badge, badgeX + 8, badgeY + 14)

    textY += 24 // gap after time row

    // Title
    ctx.fillStyle = "#ffffff"
    ctx.font = `${isKeynote ? "700" : "600"} 20px system-ui, -apple-system, sans-serif`
    const titleLines = wrapText(ctx, session.title, textMaxW)
    ctx.fillText(titleLines[0], textX, textY)
    if (titleLines.length > 1) {
      textY += 24
      ctx.fillText(titleLines[1], textX, textY)
    }

    // Speaker names
    if (speakerNames.length > 0) {
      textY += 22
      ctx.fillStyle = "rgba(255,255,255,0.50)"
      ctx.font = "500 14px system-ui, -apple-system, sans-serif"
      const speakerStr = speakerNames.join(", ")
      const speakerLines = wrapText(ctx, speakerStr, textMaxW)
      ctx.fillText(speakerLines[0], textX, textY)
      if (speakerLines.length > 1) {
        textY += 18
        ctx.fillText(speakerLines[1], textX, textY)
      }
    }

    // Description (only if room)
    const usedH = textY - py + 16
    if (session.description && sessionCardH - usedH > 28) {
      textY += 18
      ctx.fillStyle = "rgba(255,255,255,0.30)"
      ctx.font = "400 14px system-ui, -apple-system, sans-serif"
      const remainingH = sessionCardH - (textY - py) - 12
      const descLines = wrapText(ctx, session.description, textMaxW)
      const maxDescLines = Math.max(1, Math.floor(remainingH / 18))
      for (let i = 0; i < Math.min(descLines.length, maxDescLines); i++) {
        let line = descLines[i]
        if (i === maxDescLines - 1 && i < descLines.length - 1) {
          line = line.replace(/\s*\S*$/, "…")
        }
        ctx.fillText(line, textX, textY)
        textY += 18
      }
    }

    py += sessionCardH + sessionGap
  }

  // =============================================
  // FOOTER
  // =============================================
  const footerDividerY = CARD_H - footerH
  ctx.strokeStyle = "rgba(255,255,255,0.08)"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(px, footerDividerY)
  ctx.lineTo(CARD_W - px, footerDividerY)
  ctx.stroke()

  const footerTextY = CARD_H - 32 // centered in footer area

  ctx.fillStyle = "rgba(255,255,255,0.35)"
  ctx.font = "400 17px system-ui, -apple-system, sans-serif"
  ctx.textAlign = "left"
  ctx.fillText("sanantoniotechday.com", px, footerTextY)

  ctx.fillStyle = meta.color
  ctx.font = "700 17px system-ui, -apple-system, sans-serif"
  ctx.textAlign = "right"
  ctx.fillText("#TechDay2026", CARD_W - px, footerTextY)
  ctx.textAlign = "left"

  // Download
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `techday-2026-${track}-schedule.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, "image/png")
}

export function Schedule({ variant = "light" }: ScheduleProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<TrackFilter>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const arrowImgRef = useRef<HTMLImageElement | null>(null)
  
  const isDark = variant === "dark"

  const toggleAccordion = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

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
        // Default-open the Opening Remarks accordion
        const opening = (scheduleData.sessions || []).find(
          (s: Session) => s.title?.toLowerCase().includes("opening")
        )
        if (opening) setExpandedId(opening.id)
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

  const getSessionModerators = (session: Session): Speaker[] => {
    if (!session.moderatorIds || session.moderatorIds.length === 0) return []
    return speakers.filter((s) => session.moderatorIds?.includes(s.id))
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
          <Editable 
            id="schedule.label" 
            as="p" 
            className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
            page="techday"
            section="schedule"
          >
            April 21, 2026
          </Editable>
          <Editable 
            id="schedule.title" 
            as="h2" 
            className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[0.95] tracking-tight ${isDark ? "text-white" : "text-foreground"}`}
            page="techday"
            section="schedule"
          >
            Event Schedule
          </Editable>
          <Editable 
            id="schedule.description" 
            as="p" 
            className={`text-lg md:text-xl max-w-2xl mx-auto leading-[1.7] font-normal ${isDark ? "text-white/60" : "text-muted-foreground"}`}
            page="techday"
            section="schedule"
          >
            A full day of panels, keynotes, and networking. Three tracks—one mission: shaping the future of San Antonio.
          </Editable>
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
            {/* Filter + Actions Toolbar */}
            <div className={`rounded-xl border p-2 mb-12 ${
              isDark ? "bg-white/3 border-white/10" : "bg-white border-border"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-1.5">
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
                        className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                          isActive
                            ? f.color 
                              ? `${f.color === "emerald" ? "bg-emerald-500" : f.color === "violet" ? "bg-violet-500" : "bg-blue-500"} text-white shadow-sm`
                              : "bg-primary text-primary-foreground shadow-sm"
                            : isDark
                              ? "text-white/50 hover:text-white hover:bg-white/6"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
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

                {/* Actions — right-aligned */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`actions-${filter}`}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l pt-2 sm:pt-0 sm:pl-3 ${
                      isDark ? "border-white/10" : "border-border"
                    }`}
                  >
                    <button
                      disabled={isGenerating}
                      onClick={async () => {
                        setIsGenerating(true)
                        try {
                          if (!arrowImgRef.current) {
                            arrowImgRef.current = await loadArrowSvgImage()
                          }
                          if (filter === "all") {
                            for (const track of ["emerging", "founders", "ai"] as const) {
                          await generateTrackCard(track, sessions, speakers, arrowImgRef.current)
                              await new Promise(r => setTimeout(r, 400))
                            }
                          } else {
                            await generateTrackCard(filter, sessions, speakers, arrowImgRef.current)
                          }
                        } finally {
                          setIsGenerating(false)
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                        isDark
                          ? "text-white/50 hover:text-white hover:bg-white/6"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      } ${isGenerating ? "opacity-50 cursor-wait" : ""}`}
                      title={filter === "all" ? "Download all 3 track cards" : "Download track schedule card"}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">{isGenerating ? "Generating…" : "Download"}</span>
                    </button>
                    <CalendarDropdown
                      events={(filter === "all" 
                        ? sessions 
                        : sessions.filter(s => s.track === filter || (s.type === "keynote" && s.track === ""))
                      )
                        .filter(s => s.type !== "break")
                        .map(s => ({ title: s.title, description: s.description || "", time: s.time, duration: s.duration, room: s.room }))}
                      filename={filter === "all" ? "techday-2026-schedule.ics" : `techday-2026-${filter}.ics`}
                      isDark={isDark}
                      trackFilter={filter}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Schedule Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className={`absolute left-0 md:left-28 top-0 bottom-0 w-px ${isDark ? "bg-white/10" : "bg-border"}`} />

              <AnimatePresence mode="wait">
                <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {filteredSessions.map((session, index) => {
                    const trackStyle = getTrackStyle(session.track)
                    const sessionModerators = getSessionModerators(session)
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
                        <div className="pl-6 md:pl-0 md:w-28 shrink-0">
                          <div className="inline-flex md:flex-col items-center md:items-end gap-1.5">
                            <span className="font-mono text-sm text-primary font-bold tracking-tight leading-none">{formatTime(session.time)}</span>
                            <span className="font-mono text-[10px] text-muted-foreground/70 tracking-wider font-semibold leading-none">{formatDuration(session.duration)}</span>
                          </div>
                        </div>

                        {/* Timeline dot - colored by track */}
                        <div
                          className={`absolute left-0 md:left-28 top-1 md:top-0 -translate-x-1/2 w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full border-2 md:border-[3px] ${isDark ? "border-foreground" : "border-background"} ${
                            trackStyle ? trackStyle.dot : isBreakOrNetworking ? "bg-muted-foreground" : session.type === "keynote" ? "bg-primary" : "bg-foreground"
                          }`}
                        />

                        {/* Content Card - styled by track */}
                        <div
                          className={`flex-1 md:ml-0 rounded-lg border overflow-hidden transition-all hover:shadow-sm ${
                            isDark
                              ? isBreakOrNetworking
                                ? "bg-white/5 border-white/10"
                                : trackStyle
                                  ? "bg-white/5 border-white/15 hover:border-white/30"
                                  : session.type === "keynote"
                                    ? "bg-white/5 border-primary/30 hover:border-primary/50"
                                    : "bg-white/5 border-white/15 hover:border-white/30"
                              : isBreakOrNetworking
                                ? "bg-white border-border"
                                : trackStyle
                                  ? `bg-white ${trackStyle.border} ${trackStyle.borderHover}`
                                  : session.type === "keynote"
                                    ? "bg-white border-primary/30 hover:border-primary/50"
                                    : "bg-white border-foreground/15 hover:border-foreground/30"
                          }`}
                        >
                          {/* Ticket header band - colored by track */}
                          <div className={`h-1 ${
                            trackStyle
                              ? `bg-linear-to-r ${trackStyle.gradient}`
                              : session.type === "keynote"
                                ? "bg-linear-to-r from-primary to-primary/50"
                                : isBreakOrNetworking
                                  ? "bg-linear-to-r from-muted-foreground to-muted-foreground/50"
                                  : isDark ? "bg-linear-to-r from-white to-white/50" : "bg-linear-to-r from-foreground to-foreground/50"
                          }`} />
                          
                          <div className="px-5 py-4 md:px-6 md:py-5">
                            {/* Title row - clickable accordion */}
                            <button
                              type="button"
                              className="w-full text-left flex items-start justify-between gap-2"
                              onClick={() => !isBreakOrNetworking && toggleAccordion(session.id)}
                            >
                              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                                <h3 className={`text-[17px] font-extrabold leading-snug tracking-tight ${isDark ? "text-white" : "text-foreground"}`}>{session.title}</h3>
                                <div className="flex items-center gap-2">
                                  {trackStyle && (
                                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${trackStyle.bgLight} ${trackStyle.text}`}>
                                      {session.track === "emerging" ? "Emerging" : session.track === "founders" ? "Founders" : "AI"}
                                    </span>
                                  )}
                                  <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded capitalize ${isDark ? "bg-white/10 text-white/60" : "bg-muted text-muted-foreground"}`}>{session.type}</span>
                                </div>
                              </div>
                              {!isBreakOrNetworking && (session.description || sessionModerators.length > 0 || sessionSpeakers.length > 0) && (
                                <ChevronDown className={`w-4 h-4 mt-1 shrink-0 transition-transform duration-300 ${isDark ? "text-white/40" : "text-muted-foreground"} ${expandedId === session.id ? "rotate-180" : ""}`} />
                              )}
                            </button>

                            {/* Truncated description - visible when collapsed */}
                            {session.description && expandedId !== session.id && !isBreakOrNetworking && (
                              <p className={`text-sm leading-[1.7] font-normal mt-2 line-clamp-2 ${isDark ? "text-white/55" : "text-muted-foreground"}`}>{session.description}</p>
                            )}

                            {/* Accordion body */}
                            <AnimatePresence initial={false}>
                              {expandedId === session.id && (
                                <motion.div
                                  className="overflow-hidden"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                >
                                  {/* Full description */}
                                  {session.description && (
                                    <p className={`text-sm leading-[1.7] font-normal mt-2 mb-4 ${isDark ? "text-white/55" : "text-muted-foreground"}`}>{session.description}</p>
                                  )}

                                  {/* Moderators + Speakers */}
                                  {(sessionModerators.length > 0 || sessionSpeakers.length > 0) && (
                                    <div className={`flex flex-wrap gap-x-6 gap-y-3 ${session.room ? "mb-3" : ""}`}>
                                      {sessionModerators.length > 0 && (
                                        <div>
                                          <p className={`text-[10px] font-mono uppercase tracking-widest mb-2 font-bold ${isDark ? "text-amber-400/80" : "text-amber-600"}`}>
                                            {sessionModerators.length === 1 ? "Moderator" : "Moderators"}
                                          </p>
                                          <div className="flex flex-wrap gap-3">
                                            {sessionModerators.map((speaker) => (
                                              <div key={speaker.id} className="flex items-center gap-2.5">
                                                {speaker.imageUrl ? (
                                                  <img src={speaker.imageUrl} alt={speaker.name} className="w-7 h-7 rounded object-cover bg-muted" />
                                                ) : (
                                                  <div className={`w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold ${isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700"}`}>
                                                    {speaker.name.charAt(0)}
                                                  </div>
                                                )}
                                                <div>
                                                  <p className={`text-sm font-bold leading-tight ${isDark ? "text-amber-300" : "text-amber-900"}`}>{speaker.name}</p>
                                                  <p className={`text-xs leading-tight mt-0.5 font-medium ${isDark ? "text-amber-400/50" : "text-amber-700/60"}`}>{speaker.company}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      {sessionSpeakers.length > 0 && (
                                        <div>
                                          <p className={`text-[10px] font-mono uppercase tracking-widest mb-2 font-bold ${isDark ? "text-white/35" : "text-muted-foreground"}`}>
                                            {sessionSpeakers.length === 1 ? "Speaker" : "Speakers"}
                                          </p>
                                          <div className="flex flex-wrap gap-3">
                                            {sessionSpeakers.map((speaker) => (
                                              <div key={speaker.id} className="flex items-center gap-2.5">
                                                {speaker.imageUrl ? (
                                                  <img src={speaker.imageUrl} alt={speaker.name} className="w-7 h-7 rounded object-cover bg-muted grayscale" />
                                                ) : (
                                                  <div className={`w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold ${isDark ? "bg-white/10 text-white/60" : "bg-muted text-muted-foreground"}`}>
                                                    {speaker.name.charAt(0)}
                                                  </div>
                                                )}
                                                <div>
                                                  <p className={`text-sm font-bold leading-tight ${isDark ? "text-white" : "text-foreground"}`}>{speaker.name}</p>
                                                  <p className={`text-xs leading-tight mt-0.5 font-medium ${isDark ? "text-white/45" : "text-muted-foreground"}`}>{speaker.company}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Room + Add to Calendar row */}
                                  <div className={`flex items-center justify-between gap-3 pt-3 mt-3 border-t border-dashed ${isDark ? "border-white/8" : "border-border"}`}>
                                    {session.room && (
                                      <span className={`text-xs font-semibold ${isDark ? "text-white/50" : "text-muted-foreground"}`}>
                                        📍 {session.room}
                                      </span>
                                    )}
                                    <CalendarDropdown
                                      events={[{ title: session.title, description: session.description || "", time: session.time, duration: session.duration, room: session.room }]}
                                      filename={`techday-${session.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`}
                                      isDark={isDark}
                                      label="Add to Calendar"
                                      portal
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
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

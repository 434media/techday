"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "motion/react"

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  category: string
  company: string
  title: string
  events: string[]
  ecosystemTours: boolean
  dietaryRestrictions: string
  agreeToTerms: boolean
}

const categories = [
  { value: "founder", label: "Founder / Entrepreneur" },
  { value: "investor", label: "Investor / VC" },
  { value: "attendee", label: "General Attendee" },
  { value: "student", label: "Student" },
  { value: "government", label: "Government / Public Sector" },
]

const events = [
  { id: "techfuel", label: "Tech Fuel Pitch Competition", date: "April 20", price: "Free" },
  { id: "techday", label: "Tech Day Conference", date: "April 21", price: "Free" },
]

// Registration limits per event
const REGISTRATION_LIMITS = {
  techfuel: 200,
  techday: 300,
} as const

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    category: "",
    company: "",
    title: "",
    events: ["techday"],
    ecosystemTours: false,
    dietaryRestrictions: "none",
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState("")
  const [capacityInfo, setCapacityInfo] = useState<Record<string, { count: number; limit: number }> | null>(null)

  // Fetch remaining capacity on mount
  useState(() => {
    fetch("/api/register?capacity=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.capacity) setCapacityInfo(data.capacity)
      })
      .catch(() => {})
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleEventToggle = (eventId: string) => {
    setFormData((prev) => {
      const newEvents = prev.events.includes(eventId)
        ? prev.events.filter((e) => e !== eventId)
        : [...prev.events, eventId]
      // Reset ecosystemTours if Tech Fuel is deselected
      const ecosystemTours = eventId === "techfuel" && prev.events.includes("techfuel")
        ? false
        : prev.ecosystemTours
      return { ...prev, events: newEvents, ecosystemTours }
    })
  }

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register")
      }

      setTicketId(data.ticketId)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 sm:p-12 bg-card border border-primary/30 rounded-lg"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">You&apos;re Registered!</h3>
        <p className="text-muted-foreground mb-6">Check your email for confirmation and your digital ticket.</p>

        {/* E-Ticket Preview */}
        <div className="max-w-sm mx-auto p-6 bg-background border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-dashed border-border">
            <div>
              <p className="font-mono text-xs text-primary">TECH DAY 2026</p>
              <p className="font-bold text-foreground">E-Ticket</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-muted-foreground">TICKET ID</p>
              <p className="font-mono text-lg text-primary">{ticketId}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="text-foreground">
                {formData.firstName} {formData.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="text-foreground capitalize">{formData.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="text-foreground">April 20–21, 2026</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-border">
            <p className="text-xs text-muted-foreground text-center">Present this ticket at check-in</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Personal Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Personal Information</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Elton"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="John"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="elton@rocketman.com"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
            I am a... *
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
              Company / Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Rocketman Inc."
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Software Engineer"
            />
          </div>
        </div>
      </div>

      {/* Event Selection */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Select Events</h3>
        {formData.events.length === 2 && (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg text-sm text-primary font-medium">
            ✓ 2-Day Registration — You&apos;re signed up for both days!
          </div>
        )}
        <div className="space-y-4">
          {events.map((event) => {
            const cap = capacityInfo?.[event.id]
            const remaining = cap ? cap.limit - cap.count : null
            const isFull = remaining !== null && remaining <= 0

            return (
              <div key={event.id}>
                <label
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border cursor-pointer transition-colors ${
                    isFull && !formData.events.includes(event.id)
                      ? "border-border bg-muted/50 opacity-60 cursor-not-allowed"
                      : formData.events.includes(event.id)
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-muted-foreground"
                  } ${event.id === "techfuel" && formData.events.includes("techfuel") ? "rounded-b-none border-b-0" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.events.includes(event.id)}
                    onChange={() => !isFull && handleEventToggle(event.id)}
                    disabled={isFull && !formData.events.includes(event.id)}
                    className="w-5 h-5 shrink-0 rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-[15px] leading-snug">{event.label}</p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{event.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-sm text-primary">{event.price}</span>
                    {remaining !== null && (
                      <p className={`text-xs mt-1 ${isFull ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                        {isFull ? "SOLD OUT" : `${remaining} spots left`}
                      </p>
                    )}
                  </div>
                </label>

                {/* Ecosystem Tours Accordion — only visible when Tech Fuel is selected */}
                {event.id === "techfuel" && (
                  <motion.div
                    initial={false}
                    animate={{
                      height: formData.events.includes("techfuel") ? "auto" : 0,
                      opacity: formData.events.includes("techfuel") ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border border-t-0 border-primary/30 bg-primary/5 rounded-b-lg px-3 py-3 sm:px-5 sm:py-4">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.ecosystemTours}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, ecosystemTours: e.target.checked }))
                          }
                          className="mt-0.5 w-5 h-5 shrink-0 rounded border-border text-primary focus:ring-primary"
                        />
                        <div className="min-w-0">
                          <p className="text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                            Ecosystem Tours
                          </p>
                          <p className="text-[13px] leading-relaxed text-muted-foreground mt-0.5">
                            Included with your Tech Fuel registration &bull; Running throughout the day
                          </p>
                        </div>
                      </label>

                      {formData.ecosystemTours && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 ml-0 sm:ml-8 p-4 bg-background/70 border border-border/60 rounded-lg space-y-3"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base" aria-hidden="true">🚐</span>
                            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                              Tour Stops
                            </span>
                          </div>
                          <p className="text-[13px] sm:text-sm leading-[1.7] font-normal text-muted-foreground">
                            This year, we&apos;re placing attendees directly inside the environments shaping San Antonio
                            and South Texas&apos; emerging industry clusters. Our ecosystem tours will begin at{" "}
                            <strong className="font-semibold text-foreground">Port San Antonio</strong>—a 20-year
                            industrial redevelopment now serving as one of the nation&apos;s leading hubs for cyber,
                            aerospace, and advanced manufacturing—followed by a visit to{" "}
                            <strong className="font-semibold text-foreground">VelocityTX</strong>, an internationally
                            recognized bioscience innovation campus purpose-built to accelerate translational research
                            and commercialization.
                          </p>
                          <p className="text-[13px] sm:text-sm leading-[1.7] font-normal text-muted-foreground">
                            Together, these redeveloped assets reflect a coordinated regional strategy to advance
                            innovation across both industrial and life sciences domains—spanning cyber, aerospace,
                            advanced manufacturing, and bioscience. This integrated approach positions San Antonio as
                            one of the few U.S. markets capable of supporting the development and dual-use
                            commercialization of technologies across both defense and civilian applications.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Additional Information</h3>
        <div>
          <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-foreground mb-2">
            Dietary Restrictions
          </label>
          <select
            id="dietaryRestrictions"
            name="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="none">None</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
      </div>

      {/* Agreement */}
      <div className="p-6 bg-muted/30 border border-border rounded-lg">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
            className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">
            I agree to receive communications about Tech Day 2026 and related events. I understand that my registration
            information may be shared with event sponsors.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !formData.agreeToTerms || formData.events.length === 0}
        className="w-full py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-primary"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Registering...
          </span>
        ) : (
          "Complete Registration"
        )}
      </button>

      <p className="text-center text-sm text-muted-foreground">Free admission • Limited capacity • Register early</p>
    </form>
  )
}

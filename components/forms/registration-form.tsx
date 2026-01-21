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
  { id: "techfuel", label: "Tech Fuel Pitch Competition", date: "April 9", price: "Free" },
  { id: "techday", label: "Tech Day Conference", date: "April 10", price: "Free" },
  { id: "2day", label: "2-Day Registration", date: "April 9-10", price: "Free" },
]

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    category: "",
    company: "",
    title: "",
    events: ["techday"],
    dietaryRestrictions: "none",
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleEventToggle = (eventId: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.includes(eventId) ? prev.events.filter((e) => e !== eventId) : [...prev.events, eventId],
    }))
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
              <span className="text-foreground">April 9–10, 2026</span>
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
              placeholder="John"
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
              placeholder="Doe"
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
            placeholder="john@company.com"
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
              placeholder="Acme Corp"
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
        <div className="space-y-4">
          {events.map((event) => (
            <label
              key={event.id}
              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                formData.events.includes(event.id)
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-muted-foreground"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.events.includes(event.id)}
                onChange={() => handleEventToggle(event.id)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">{event.label}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
              <span className="font-mono text-sm text-primary">{event.price}</span>
            </label>
          ))}
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

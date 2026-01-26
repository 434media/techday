"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "motion/react"

interface PitchFormData {
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
  agreeToRules: boolean
}

const stages = ["Pre-seed / Idea Stage", "Seed", "Series A", "Series B+"]

const industries = [
  "AI / Machine Learning",
  "Cybersecurity",
  "Healthcare / BioTech",
  "FinTech",
  "EdTech",
  "Clean Energy / Sustainability",
  "Aerospace / Defense",
  "SaaS / Enterprise Software",
  "Consumer Tech",
  "Other",
]

export function PitchSubmissionForm() {
  const [formData, setFormData] = useState<PitchFormData>({
    companyName: "",
    founderName: "",
    email: "",
    phone: "",
    website: "",
    stage: "",
    industry: "",
    pitch: "",
    problem: "",
    solution: "",
    traction: "",
    teamSize: "",
    fundingRaised: "",
    fundingGoal: "",
    deckUrl: "",
    agreeToRules: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/pitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit pitch")
      }

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
        className="text-center p-12 bg-card border border-primary/30 rounded-lg"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">Application Submitted!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you for applying to Tech Fuel. Our team will review your submission and get back to you within 2 weeks.
        </p>
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

      {/* Company Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Company Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Your startup name"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-foreground mb-2">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://yourcompany.com"
            />
          </div>
          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-foreground mb-2">
              Stage *
            </label>
            <select
              id="stage"
              name="stage"
              required
              value={formData.stage}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select stage</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-foreground mb-2">
              Industry *
            </label>
            <select
              id="industry"
              name="industry"
              required
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select industry</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Founder Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Founder Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="founderName" className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="founderName"
              name="founderName"
              required
              value={formData.founderName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="founder@company.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="(210) 555-0123"
            />
          </div>
          <div>
            <label htmlFor="teamSize" className="block text-sm font-medium text-foreground mb-2">
              Team Size *
            </label>
            <input
              type="text"
              id="teamSize"
              name="teamSize"
              required
              value={formData.teamSize}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 3 full-time, 2 part-time"
            />
          </div>
        </div>
      </div>

      {/* Pitch Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Your Pitch</h3>
        <div>
          <label htmlFor="pitch" className="block text-sm font-medium text-foreground mb-2">
            Elevator Pitch (50 words min) *
          </label>
          <textarea
            id="pitch"
            name="pitch"
            required
            rows={2}
            maxLength={300}
            value={formData.pitch}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Describe your company in one sentence..."
          />
        </div>
        <div>
          <label htmlFor="problem" className="block text-sm font-medium text-foreground mb-2">
            Problem You&apos;re Solving *
          </label>
          <textarea
            id="problem"
            name="problem"
            required
            rows={3}
            value={formData.problem}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="What problem does your product/service solve?"
          />
        </div>
        <div>
          <label htmlFor="solution" className="block text-sm font-medium text-foreground mb-2">
            Your Solution *
          </label>
          <textarea
            id="solution"
            name="solution"
            required
            rows={3}
            value={formData.solution}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="How does your product/service solve this problem?"
          />
        </div>
        <div>
          <label htmlFor="traction" className="block text-sm font-medium text-foreground mb-2">
            Traction / Milestones
          </label>
          <textarea
            id="traction"
            name="traction"
            rows={2}
            value={formData.traction}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Revenue, users, partnerships, awards..."
          />
        </div>
      </div>

      {/* Funding */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Funding</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fundingRaised" className="block text-sm font-medium text-foreground mb-2">
              Funding Raised to Date
            </label>
            <input
              type="text"
              id="fundingRaised"
              name="fundingRaised"
              value={formData.fundingRaised}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="$0 / Bootstrapped"
            />
          </div>
          <div>
            <label htmlFor="fundingGoal" className="block text-sm font-medium text-foreground mb-2">
              Current Funding Goal
            </label>
            <input
              type="text"
              id="fundingGoal"
              name="fundingGoal"
              value={formData.fundingGoal}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., $500K Seed Round"
            />
          </div>
        </div>
        <div>
          <label htmlFor="deckUrl" className="block text-sm font-medium text-foreground mb-2">
            Pitch Deck URL
          </label>
          <input
            type="url"
            id="deckUrl"
            name="deckUrl"
            value={formData.deckUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Link to your pitch deck (Google Drive, Docsend, etc.)"
          />
        </div>
      </div>

      {/* Agreement */}
      <div className="p-6 bg-muted/30 border border-border rounded-lg">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToRules"
            checked={formData.agreeToRules}
            onChange={handleChange}
            required
            className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">
            I agree to the Tech Fuel competition rules and understand that selected companies will be featured in event
            marketing. I confirm that the information provided is accurate.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !formData.agreeToRules}
        className="w-full py-4 bg-secondary text-secondary-foreground font-semibold text-lg rounded-md hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-secondary"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </span>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  )
}

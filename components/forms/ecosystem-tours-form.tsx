"use client"

import { useState } from "react"

export function EcosystemToursForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/ecosystem-tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up")
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
      <div className="text-center p-8 sm:p-10 bg-card border border-primary/30 rounded-lg">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-primary/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">You&apos;re Signed Up!</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your registration has been updated to include ecosystem tours. See you on April 20th!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          Already registered for Tech Fuel? Enter the same name and email you used to register and we&apos;ll add ecosystem tours to your registration.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
          {error.includes("/register") ? (
            <>
              No registration found with this email. Please{" "}
              <a href="/register" className="underline font-semibold hover:text-red-400 transition-colors">
                register first
              </a>.
            </>
          ) : (
            error
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="eco-firstName" className="block text-sm font-medium text-foreground mb-1.5">
            First Name *
          </label>
          <input
            type="text"
            id="eco-firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            placeholder="Elton"
          />
        </div>
        <div>
          <label htmlFor="eco-lastName" className="block text-sm font-medium text-foreground mb-1.5">
            Last Name *
          </label>
          <input
            type="text"
            id="eco-lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            placeholder="John"
          />
        </div>
      </div>

      <div>
        <label htmlFor="eco-email" className="block text-sm font-medium text-foreground mb-1.5">
          Email Address *
        </label>
        <input
          type="email"
          id="eco-email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          placeholder="elton@rocketman.com"
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Use the same email you registered with
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-primary text-primary-foreground font-semibold text-sm rounded-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Updating Registration...
          </span>
        ) : (
          "Sign Up for Ecosystem Tours"
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Not registered yet?{" "}
        <a href="/register" className="text-primary hover:underline font-medium">
          Register for Tech Fuel first
        </a>
      </p>
    </form>
  )
}

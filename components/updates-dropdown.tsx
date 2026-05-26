"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown } from "lucide-react"

interface UpdatesDropdownProps {
  variant?: "desktop" | "mobile"
  onSubscribed?: () => void
  /** Where the popup opens relative to the trigger. Default: "bottom". */
  placement?: "bottom" | "top"
  /** Which edge of the trigger the popup anchors to. Default: "right". */
  align?: "left" | "right"
  /** Visual style of the trigger button. Default: "primary". */
  triggerStyle?: "primary" | "muted"
}

export function UpdatesDropdown({
  variant = "desktop",
  onSubscribed,
  placement = "bottom",
  align = "right",
  triggerStyle = "primary",
}: UpdatesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (variant !== "desktop" || !isOpen) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [isOpen, variant])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "2027-updates" }),
      })

      const data = await response.json()

      if (response.ok) {
        setEmail("")
        setIsSubmitted(true)
        setTimeout(() => {
          setIsSubmitted(false)
          setIsOpen(false)
          onSubscribed?.()
        }, 2500)
      } else {
        throw new Error(data.error || "Subscription failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formContent = (
    <>
      <div className="mb-3">
        <p className="font-mono text-[10px] text-primary tracking-widest uppercase mb-1.5">
          2027 Updates
        </p>
        <p className="text-sm text-foreground/80 leading-snug">
          Be the first to know when Tech Day &amp; Tech Fuel 2027 details drop.
        </p>
      </div>
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-md bg-primary/10 px-3 py-2.5 text-center"
        >
          <p className="text-sm font-medium text-primary">You're on the list. See you in 2027.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address for 2027 updates"
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {isSubmitting ? "Subscribing…" : "Notify me"}
          </button>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-primary bg-primary/5 rounded px-2 py-1"
            >
              {error}
            </motion.p>
          )}
        </form>
      )}
    </>
  )

  if (variant === "mobile") {
    return (
      <div className="px-4 py-3 mt-2 rounded-md bg-muted border border-border">
        {formContent}
      </div>
    )
  }

  const popupPositionClasses = [
    placement === "top" ? "bottom-full mb-2" : "top-full mt-2",
    align === "left" ? "left-0" : "right-0",
  ].join(" ")

  const popupAnimateFrom = placement === "top" ? 6 : -6

  const triggerClasses =
    triggerStyle === "muted"
      ? "inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-medium text-left"
      : "inline-flex items-center gap-1.5 px-5 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-md hover:bg-primary/90 transition-colors"

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={triggerClasses}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        2027 Updates
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: popupAnimateFrom, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: popupAnimateFrom, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-label="Subscribe to 2027 updates"
            className={`absolute ${popupPositionClasses} w-80 max-w-[calc(100vw-2rem)] rounded-lg bg-white border border-border shadow-xl p-4 z-50`}
          >
            {formContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

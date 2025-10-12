"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, X } from "lucide-react"
import Image from "next/image"

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => string
      getResponse: (widgetId: string) => string | null
      reset: (widgetId: string) => void
    }
  }
}

const isDevelopment = process.env.NODE_ENV === "development"

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const [turnstileWidget, setTurnstileWidget] = useState<string | null>(null)

  useEffect(() => {
    if (!isDevelopment && isOpen && !window.turnstile) {
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      document.body.appendChild(script)

      script.onload = () => {
        if (window.turnstile && turnstileRef.current && !turnstileWidget) {
          const widgetId = window.turnstile.render(turnstileRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
            callback: (token: string) => {
              console.log("[v0] Turnstile token received")
            },
          })
          setTurnstileWidget(widgetId)
        }
      }

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [isOpen, turnstileWidget])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let turnstileResponse = undefined

      if (!isDevelopment) {
        if (!window.turnstile || !turnstileWidget) {
          throw new Error("Turnstile is not initialized")
        }

        turnstileResponse = window.turnstile.getResponse(turnstileWidget)
        if (!turnstileResponse) {
          throw new Error("Please complete the verification")
        }
      }

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(turnstileResponse && { "cf-turnstile-response": turnstileResponse }),
        },
        body: JSON.stringify({ email }),
      })

      const responseData = await response.json()

      if (response.ok) {
        setEmail("")
        setIsSubmitted(true)
        if (!isDevelopment && turnstileWidget && window.turnstile) {
          window.turnstile.reset(turnstileWidget)
        }
        // Close popup after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setIsOpen(false)
        }, 3000)
      } else {
        throw new Error(responseData.error || "Newsletter subscription failed")
      }
    } catch (error) {
      console.error("[v0] Error subscribing to newsletter:", error)
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Circle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 left-70 md:bottom-20 md:left-300 z-40 overflow-hidden transition-transform rotate-2 hover:scale-105 active:scale-95"
        whileHover={{ rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open newsletter signup"
      >
        <Image
          src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/MadeinSA.svg"
          alt="Get Notified"
          width={120}
          height={80}
          className="h-24 md:h-24 w-auto"
        />
      </motion.button>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Popup Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 100, y: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 100, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-auto md:top-auto md:bottom-24 md:right-8 md:translate-x-0 md:translate-y-0 z-50 w-[85vw] max-w-sm"
              style={{ aspectRatio: "4/5" }}
            >
              <div className="rounded-lg bg-white shadow-2xl h-full flex flex-col overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-10 rounded-full p-1 text-white bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="relative h-2/5 flex-shrink-0 overflow-hidden">
                  <Image
                    src="https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td3.jpg"
                    alt="Tech Day Conference"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col p-6">
                  <div className="mb-4 flex-shrink-0">
                    <h2 className="mb-2 font-mono text-xl font-bold text-red-600 md:text-2xl">Get Notified</h2>
                    <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                      Be the first to know when tracks and session information becomes available
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-md bg-red-50 p-4 text-center"
                      >
                        <p className="font-medium text-red-600">
                          Thanks! We'll notify you when sessions are announced.
                        </p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <motion.input
                          type="email"
                          name="email"
                          id="email"
                          autoComplete="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          aria-label="Email address"
                          whileFocus={{ scale: 1.01 }}
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        />
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="group flex w-full items-center justify-center rounded-md bg-red-600 px-6 py-3 font-mono text-base font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            "Submitting..."
                          ) : (
                            <>
                              Notify Me
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </motion.button>
                        {!isDevelopment && <div ref={turnstileRef} data-size="flexible" className="w-full" />}
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600 bg-red-50 rounded px-2 py-1"
                          >
                            {error}
                          </motion.p>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

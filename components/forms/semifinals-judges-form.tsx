"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"

const JUDGES = [
  { name: "Alfonso Garcia", email: "ponchog@gmail.com" },
  { name: "Alfred Breuer", email: "Alfred.breuer@sanantonio.gov" },
  { name: "Andrea Casillas", email: "andreacasillasf@gmail.com" },
  { name: "Areli Fontecha", email: "afontecha@kw.com" },
  { name: "Beto Gomez", email: "beto@irystechnologies.com" },
  { name: "Carmen Aramanda", email: "caramand@trinity.edu" },
  { name: "Chris Burney", email: "chris@espada.capital" },
  { name: "Chris Packham", email: "Chris.packham@utsa.edu" },
  { name: "Cliff Zintgraff", email: "cliff.zintgraff@samsat.org" },
  { name: "Elizabeth Eichhorn", email: "elizabeth@scroobious.com" },
  { name: "Enrique Pavlioglou", email: "enrique@checkups.us" },
  { name: "Heidi Leach", email: "heidi.leach@jpmorgan.com" },
  { name: "Joe Broschak", email: "joseph.broschak@utsa.edu" },
  { name: "Lawrence Coffee", email: "lawrence@lawrence.coffee" },
  { name: "Lina Rugova", email: "lina@emergeandrise.org" },
  { name: "Marcos Resendez", email: "marcos@vemosvamos.com" },
  { name: "Mayra Delgado", email: "mayra.e.delgado@nasa.gov" },
  { name: "Melissa Chalfant", email: "Melissa@InVentures.team" },
  { name: "Melissa Unsell-Smith", email: "melissa@catalyticicon.com" },
  { name: "Rhia Pape", email: "rhia@sadigitalconnects.com" },
  { name: "Robert Miggins", email: "robert@bigsunsolar.com" },
  { name: "Shirley Frobish", email: "shirley@greatersatx.com" },
  { name: "Travis Runty", email: "trunty@gmail.com" },
  { name: "Victor Reyna", email: "victor.reyna@amegybank.com" },
  { name: "Walt Ugalde", email: "walter.g.ugalde@nasa.gov" },
]

const DATES = [
  { value: "2026-04-02", label: "Thursday, April 2, 2026" },
  { value: "2026-04-03", label: "Friday, April 3, 2026" },
]

const TIME_SLOTS: Record<string, string[]> = {
  "2026-04-02": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "1:00 PM - 2:30 PM"],
  "2026-04-03": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM"],
}

type Availability = Record<string, Record<string, { total: number; remaining: number }>>

export function JudgeSchedulingForm() {
  const [selectedJudge, setSelectedJudge] = useState("")
  const [isCustomName, setIsCustomName] = useState(false)
  const [customName, setCustomName] = useState("")
  const [customEmail, setCustomEmail] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/semifinals-judges")
      .then((res) => res.json())
      .then((data) => {
        if (data.availability) setAvailability(data.availability)
      })
      .catch(() => {})
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset slot when date changes
  useEffect(() => {
    setSelectedSlot("")
  }, [selectedDate])

  const handleJudgeChange = (value: string) => {
    if (value === "__custom__") {
      setIsCustomName(true)
      setSelectedJudge("")
    } else {
      setIsCustomName(false)
      setCustomName("")
      setCustomEmail("")
      setSelectedJudge(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const judgeName = isCustomName ? customName.trim() : selectedJudge
    if (!judgeName) {
      setError("Please select or enter your name")
      return
    }

    if (!selectedDate) {
      setError("Please select a date")
      return
    }
    if (!selectedSlot) {
      setError("Please select a time slot")
      return
    }

    if (isCustomName && !customEmail.trim()) {
      setError("Please enter your email address")
      return
    }

    setIsSubmitting(true)

    try {
      // Get the judge email from the list if not custom
      const judgeEmail = isCustomName
        ? customEmail.trim()
        : JUDGES.find((j) => j.name === selectedJudge)?.email || ""

      const res = await fetch("/api/semifinals-judges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judgeName,
          email: judgeEmail,
          isCustomName,
          date: selectedDate,
          timeSlot: selectedSlot,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        return
      }

      setSubmitted(true)
    } catch {
      setError("Failed to submit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    const dateLabel = DATES.find((d) => d.value === selectedDate)?.label
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-neutral-200 p-8 md:p-12 max-w-lg mx-auto text-center"
      >
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-black mb-3">You&apos;re All Set!</h2>
        <p className="text-neutral-600 mb-2">
          Your judging session has been confirmed for:
        </p>
        <p className="text-lg font-medium text-black mb-1">{dateLabel}</p>
        <p className="text-lg text-red-600 font-mono">{selectedSlot}</p>
        <p className="text-sm text-neutral-500 mt-6">
          A confirmation email with Zoom details has been sent. Check your inbox for the calendar invite link.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto text-[15px] leading-relaxed">
      {/* Judge Selection */}
      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-2 tracking-wide">
          Select Your Name <span className="text-red-500">*</span>
        </label>
        {!isCustomName ? (
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`w-full px-4 py-3 border rounded-md bg-white text-left text-[15px] leading-6 transition-colors flex items-center justify-between ${
                dropdownOpen
                  ? "border-red-500 ring-2 ring-red-500"
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
            >
              <span className={selectedJudge ? "text-black" : "text-neutral-400"}>
                {selectedJudge || "Choose your name..."}
              </span>
              <svg
                className={`w-4 h-4 text-neutral-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {JUDGES.map((judge) => (
                  <button
                    key={judge.name}
                    type="button"
                    onClick={() => {
                      handleJudgeChange(judge.name)
                      setDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-[14px] leading-5 transition-colors ${
                      selectedJudge === judge.name
                        ? "bg-red-50 text-red-700 font-medium"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {judge.name}
                  </button>
                ))}
                <div className="border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => {
                      handleJudgeChange("__custom__")
                      setDropdownOpen(false)
                    }}
                    className="w-full px-4 py-2.5 text-left text-[14px] leading-5 text-neutral-500 hover:bg-neutral-50 italic"
                  >
                    — Enter a different name —
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter your full name"
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-md bg-white text-black text-[15px] leading-6 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => {
                  setIsCustomName(false)
                  setCustomName("")
                  setCustomEmail("")
                }}
                className="px-3 py-3 border border-neutral-300 text-neutral-500 hover:text-black hover:border-neutral-400 transition-colors text-sm"
              >
                Back
              </button>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-2 tracking-wide">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-neutral-300 rounded-md bg-white text-black text-[15px] leading-6 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-3 tracking-wide">
          Select a Date <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DATES.map((date) => (
            <button
              key={date.value}
              type="button"
              onClick={() => setSelectedDate(date.value)}
              className={`p-4 border text-left transition-all ${
                selectedDate === date.value
                  ? "border-red-500 bg-red-50 ring-2 ring-red-500"
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
            >
              <p className="font-semibold text-black text-sm leading-5">{date.label}</p>
              <p className="text-xs text-neutral-500 mt-1.5 leading-4">
                {TIME_SLOTS[date.value].length} time slots available
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slot Selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <label className="block text-sm font-semibold text-neutral-800 mb-3 tracking-wide">
            Select a Time Slot <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {TIME_SLOTS[selectedDate].map((slot) => {
              const remaining = availability?.[selectedDate]?.[slot]?.remaining ?? 5
              const isFull = remaining <= 0

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isFull}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full p-4 border text-left transition-all flex items-center justify-between ${
                    isFull
                      ? "border-neutral-200 bg-neutral-50 opacity-60 cursor-not-allowed"
                      : selectedSlot === slot
                        ? "border-red-500 bg-red-50 ring-2 ring-red-500"
                        : "border-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  <div>
                    <p className="font-mono font-semibold text-black text-[15px] leading-5">{slot}</p>
                    <p className="text-xs text-neutral-500 mt-1.5 leading-4">
                      Judge Prep → Startup Pitches → Deliberation
                    </p>
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded ${
                    isFull
                      ? "bg-neutral-200 text-neutral-500"
                      : remaining <= 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                  }`}>
                    {isFull ? "Full" : `${remaining} spots`}
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-black text-white font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Confirming...
          </span>
        ) : (
          "Confirm My Judging Session"
        )}
      </button>
    </form>
  )
}

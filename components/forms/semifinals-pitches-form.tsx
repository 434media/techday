"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"

interface ApprovedPitch {
  id: string
  companyName: string
  founderName: string
  email: string
}

const DATES = [
  { value: "2026-04-02", label: "Thursday, April 2, 2026" },
  { value: "2026-04-03", label: "Friday, April 3, 2026" },
]

const JUDGE_BLOCKS: Record<string, string[]> = {
  "2026-04-02": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "1:00 PM - 2:30 PM"],
  "2026-04-03": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM"],
}

const PITCH_SLOTS: Record<string, string[]> = {
  "9:00 AM - 10:30 AM": [
    "9:05 AM - 9:15 AM",
    "9:20 AM - 9:30 AM",
    "9:35 AM - 9:45 AM",
    "9:50 AM - 10:00 AM",
    "10:05 AM - 10:15 AM",
  ],
  "11:00 AM - 12:30 PM": [
    "11:05 AM - 11:15 AM",
    "11:20 AM - 11:30 AM",
    "11:35 AM - 11:45 AM",
    "11:50 AM - 12:00 PM",
    "12:05 PM - 12:15 PM",
  ],
  "1:00 PM - 2:30 PM": [
    "1:05 PM - 1:15 PM",
    "1:20 PM - 1:30 PM",
    "1:35 PM - 1:45 PM",
    "1:50 PM - 2:00 PM",
    "2:05 PM - 2:15 PM",
  ],
}

// availability[date][block][slot] = true if open
type Availability = Record<string, Record<string, Record<string, boolean>>>

export function PitchSchedulingForm() {
  const [approvedPitches, setApprovedPitches] = useState<ApprovedPitch[]>([])
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedBlock, setSelectedBlock] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/semifinals-pitches")
      .then((res) => res.json())
      .then((data) => {
        if (data.availability) setAvailability(data.availability)
        if (data.approvedPitches) setApprovedPitches(data.approvedPitches)
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

  // Reset block and slot when date changes
  useEffect(() => {
    setSelectedBlock("")
    setSelectedSlot("")
  }, [selectedDate])

  // Reset slot when block changes
  useEffect(() => {
    setSelectedSlot("")
  }, [selectedBlock])

  const selectedPitch = approvedPitches.find((p) => p.companyName === selectedCompany)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedCompany || !selectedPitch) {
      setError("Please select your company")
      return
    }
    if (!selectedDate) {
      setError("Please select a date")
      return
    }
    if (!selectedBlock) {
      setError("Please select a block")
      return
    }
    if (!selectedSlot) {
      setError("Please select a pitch time")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/semifinals-pitches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: selectedPitch.companyName,
          founderName: selectedPitch.founderName,
          email: selectedPitch.email,
          date: selectedDate,
          judgeBlock: selectedBlock,
          pitchSlot: selectedSlot,
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
        <h2 className="text-2xl font-bold text-black mb-3 leading-tight">You&apos;re Scheduled!</h2>
        <p className="text-neutral-600 mb-2 leading-relaxed">
          Your pitch time for <span className="font-semibold text-black">{selectedCompany}</span> has been confirmed:
        </p>
        <p className="text-lg font-semibold text-black mb-1 leading-tight">{dateLabel}</p>
        <p className="text-lg text-red-600 font-mono font-bold">{selectedSlot}</p>
        <p className="text-sm text-neutral-500 mt-1 leading-5">
          Judge Block: {selectedBlock}
        </p>
        <p className="text-sm text-neutral-500 mt-6 leading-relaxed">
          A confirmation email with Zoom details has been sent to <span className="font-medium">{selectedPitch?.email}</span>. Check your inbox for the calendar invite link.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto text-[15px] leading-relaxed">
      {/* Company Selection */}
      <div>
        <label className="block text-sm font-semibold text-neutral-800 mb-2 tracking-wide">
          Select Your Company <span className="text-red-500">*</span>
        </label>
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
            <span className={selectedCompany ? "text-black font-medium" : "text-neutral-400"}>
              {selectedCompany || "Choose your company..."}
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
              {approvedPitches.length === 0 ? (
                <div className="px-4 py-3 text-sm text-neutral-400 italic leading-5">
                  No approved pitches available
                </div>
              ) : (
                approvedPitches.map((pitch) => (
                  <button
                    key={pitch.id}
                    type="button"
                    onClick={() => {
                      setSelectedCompany(pitch.companyName)
                      setDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left transition-colors ${
                      selectedCompany === pitch.companyName
                        ? "bg-red-50 text-red-700"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <p className={`text-[14px] leading-5 ${
                      selectedCompany === pitch.companyName ? "font-semibold" : "font-medium"
                    }`}>
                      {pitch.companyName}
                    </p>
                    <p className="text-[12px] text-neutral-400 leading-4 mt-0.5">
                      {pitch.founderName}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {selectedPitch && (
          <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200 rounded-md">
            <p className="text-[13px] text-neutral-500 leading-5">
              <span className="font-semibold text-neutral-700">{selectedPitch.founderName}</span> — {selectedPitch.email}
            </p>
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
              className={`p-4 border text-left transition-all rounded-md ${
                selectedDate === date.value
                  ? "border-red-500 bg-red-50 ring-2 ring-red-500"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <p className={`text-[15px] font-semibold leading-tight ${
                selectedDate === date.value ? "text-red-700" : "text-black"
              }`}>
                {date.label.split(",")[0]}
              </p>
              <p className={`text-[13px] mt-1 leading-5 ${
                selectedDate === date.value ? "text-red-600" : "text-neutral-500"
              }`}>
                {date.label.split(",").slice(1).join(",").trim()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Block & Pitch Time Selection (Accordion) */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-semibold text-neutral-800 mb-3 tracking-wide">
            Select a Block <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {JUDGE_BLOCKS[selectedDate]?.map((block) => {
              const slots = PITCH_SLOTS[block] || []
              const availableCount = slots.filter(
                (s) => availability?.[selectedDate]?.[block]?.[s] !== false
              ).length
              const isExpanded = selectedBlock === block

              return (
                <div key={block} className="border rounded-md overflow-hidden transition-all">
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => setSelectedBlock(isExpanded ? "" : block)}
                    disabled={availableCount === 0}
                    className={`w-full p-4 text-left transition-all flex items-center justify-between ${
                      isExpanded
                        ? "bg-red-50 border-b border-red-200"
                        : availableCount === 0
                          ? "bg-neutral-50 opacity-50 cursor-not-allowed"
                          : "hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90 text-red-600" : "text-neutral-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <p className={`font-mono text-[15px] font-bold leading-5 ${
                        isExpanded ? "text-red-700" : "text-black"
                      }`}>
                        {block}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full leading-4 ${
                      availableCount === 0
                        ? "bg-red-100 text-red-700"
                        : availableCount <= 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                    }`}>
                      {availableCount}/{slots.length} open
                    </span>
                  </button>

                  {/* Accordion Content — Pitch Slots */}
                  {isExpanded && (
                    <div className="p-3 space-y-2 bg-white">
                      {slots.map((slot) => {
                        const isAvailable = availability?.[selectedDate]?.[block]?.[slot] !== false

                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => isAvailable && setSelectedSlot(slot)}
                            disabled={!isAvailable}
                            className={`w-full p-3.5 border text-left transition-all rounded-md flex items-center justify-between ${
                              selectedSlot === slot
                                ? "border-red-500 bg-red-50 ring-2 ring-red-500"
                                : !isAvailable
                                  ? "border-neutral-100 bg-neutral-50 cursor-not-allowed"
                                  : "border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <p className={`font-mono text-[14px] font-semibold leading-5 ${
                              selectedSlot === slot
                                ? "text-red-700"
                                : !isAvailable
                                  ? "text-neutral-400 line-through"
                                  : "text-black"
                            }`}>
                              {slot}
                            </p>
                            {!isAvailable ? (
                              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full leading-4">
                                Taken
                              </span>
                            ) : selectedSlot === slot ? (
                              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full leading-4">
                                Open
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-[14px] text-red-700 font-medium leading-5">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !selectedCompany || !selectedDate || !selectedBlock || !selectedSlot}
        className="w-full py-4 bg-black text-white font-bold text-[15px] leading-5 rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"
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
          "Confirm Pitch Time"
        )}
      </button>
    </form>
  )
}

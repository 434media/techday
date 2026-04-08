"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Check } from "lucide-react"
import { PixelArrow } from "@/components/pixel-arrow"

const finalists = [
  {
    name: "ComeBack Mobility",
    description:
      "Rehabilitation, redefined. Using real-time biomechanical data to guide safer, faster recovery.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Fcomback.png?alt=media",
  },
  {
    name: "Freyya",
    description:
      "Advancing women's health with real-time, data-driven pelvic care.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Ffreyya.png?alt=media",
  },
  {
    name: "Openlane",
    description:
      "An open-source, AI-native platform helping companies get compliant faster.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Fopenlane.png?alt=media",
  },
  {
    name: "Bytewhisper Security",
    description:
      "Turning security policies into actionable intelligence — analyzed and improved in hours, not weeks.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Fbytewhisper.png?alt=media",
  },
  {
    name: "RentBamboo",
    description:
      "Automating the leasing process — from first inquiry to signed lease — so teams can scale without added headcount.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Frentbamboo.png?alt=media",
  },
]

type VoteState = "select" | "confirm" | "submitting" | "success" | "error"

export default function VotePage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [voteState, setVoteState] = useState<VoteState>("select")
  const [message, setMessage] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !email) return

    setVoteState("submitting")
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, finalist: selected }),
      })
      const data = await res.json()
      if (data.success) {
        setVoteState("success")
        setMessage(data.message)
        setIsRegistered(data.isRegistered)
      } else {
        setVoteState("error")
        setMessage(data.message)
      }
    } catch {
      setVoteState("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <main className="h-dvh flex flex-col bg-white overflow-hidden relative">
      {/* PixelArrow — matches Tech Fuel page */}
      <PixelArrow position="top-right" size="xl" variant="light" type="anniversary" />

      {/* Header — compact on mobile, larger on desktop */}
      <div className="pt-20 pb-2 sm:pb-3 px-4 text-center shrink-0 relative z-10">
        <p className="font-mono text-xs lg:text-sm text-[#0a0a0a]/50 tracking-widest uppercase">
          Tech Fuel 2026
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mt-1 leading-tight">
          Live Audience Vote
        </h1>
        <p className="text-[#0a0a0a]/50 text-base mt-1 max-w-lg mx-auto">
          Tap a finalist, enter your email, and cast your vote. <span className="md:block font-semibold">One vote per person.</span>
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 pb-4 sm:pb-6 min-h-0 relative z-10">
        <AnimatePresence mode="wait">
          {voteState === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-sm"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Check className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0a0a0a] mb-2">
                Vote Submitted!
              </h2>
              <p className="text-[#0a0a0a]/60 text-sm mb-1">
                Your vote for{" "}
                <span className="font-semibold text-[#0a0a0a]/80">
                  {selected}
                </span>{" "}
                has been recorded.
              </p>
              <p className="text-[#0a0a0a]/40 text-xs mb-5 sm:mb-6">
                Results will be announced live. Thanks for participating!
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#dc2626] text-white font-semibold rounded-md hover:bg-[#0a0a0a] transition-colors text-sm"
              >
                Register for Tech Day
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-6xl flex flex-col items-center gap-3 sm:gap-5"
            >
              {/* Finalist Cards — scrollable row on mobile, grid on desktop */}
              <div className="w-full overflow-x-auto sm:overflow-visible -mx-3 px-3 sm:mx-0 sm:px-0">
                <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5 w-max sm:w-full">
                  {finalists.map((finalist) => {
                    const isSelected = selected === finalist.name
                    return (
                      <button
                        key={finalist.name}
                        onClick={() => {
                          setSelected(finalist.name)
                          if (voteState === "error") setVoteState("select")
                        }}
                        className={`relative shrink-0 w-32 sm:w-auto aspect-3/4 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-[#dc2626] ring-2 ring-[#dc2626]/30 scale-[1.02]"
                            : "border-[#0a0a0a]/10 active:border-[#0a0a0a]/30"
                        }`}
                      >
                        <img
                          src={finalist.image}
                          alt={finalist.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Bottom gradient with name */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
                          <p className="text-[10px] sm:text-xs lg:text-sm text-white/80 leading-snug line-clamp-2">
                            {finalist.description}
                          </p>
                        </div>
                        {/* Selected checkmark */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#dc2626] flex items-center justify-center"
                          >
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                          </motion.div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Selected indicator on mobile */}
              {selected && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="sm:hidden text-xs text-[#0a0a0a]/50 font-medium"
                >
                  Selected: <span className="text-[#dc2626] font-semibold">{selected}</span>
                </motion.p>
              )}

              {/* Email + Submit — stacked on mobile for easy thumb reach */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-md"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email to vote"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 sm:py-3 border border-[#0a0a0a]/15 rounded-md text-base sm:text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/35 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626]/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!selected || !email || voteState === "submitting"}
                  className="px-6 py-3.5 sm:py-3 bg-[#dc2626] text-white font-semibold text-base sm:text-sm rounded-md hover:bg-[#0a0a0a] active:bg-[#0a0a0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {voteState === "submitting" ? "Submitting…" : "Cast Vote"}
                </button>
              </form>

              {/* Error message */}
              {voteState === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#dc2626] text-xs font-medium"
                >
                  {message}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

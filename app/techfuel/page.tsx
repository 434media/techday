"use client"

import { useState, useEffect } from "react"
import { Sponsors } from "@/components/sections/sponsors"
import { PixelArrow } from "@/components/pixel-arrow"
import { Editable } from "@/components/editable"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { PitchSubmissionForm } from "@/components/forms/pitch-submission-form"

const qualifications = [
  {
    title: "Live Product",
    description:
      "Have a product or service that has been live for more than 6 months with measurable performance metrics such as revenue and customers.",
  },
  {
    title: "ARR",
    description:
      "Generate less than $2.0M in annualized recurring revenue.",
  },
  {
    title: "Funding",
    description:
      "Have received less than $1M from third-party investors.",
  },
  {
    title: "Structure",
    description:
      "Be a properly registered C-corp in the United States.",
  },
  {
    title: "Bexar County Presence",
    description:
      "Maintain a company presence (office or remote employee) within Bexar County for a minimum of 12 months after prize money award date.",
  },
]

const screeningCriteria = [
  {
    title: "Leadership",
    description: "Does the team have the ability to reach the next level of success?",
  },
  {
    title: "Business Model",
    description: "Is the revenue model realistic and sustainable?",
  },
  {
    title: "Execution",
    description: "Are there strong growth metrics or measurable traction?",
  },
  {
    title: "Job Creation",
    description: "Will the startup create more jobs in San Antonio?",
  },
  {
    title: "Impact to San Antonio",
    description: "What makes the startup standout from a San Antonio impact standpoint?",
  },
]

const processSteps = [
  {
    step: "01",
    title: "Application Review",
    description: "Screening committee reviews all applications based on leadership, business model, execution, job creation, and San Antonio impact.",
  },
  {
    step: "02",
    title: "Semi-Finals",
    description: "25 semi-finalists are randomly placed into 5 groups (A–E) for private Zoom pitch sessions with 4–5 judges. Each startup delivers a 5-minute pitch followed by 5-minute Q&A.",
  },
  {
    step: "03",
    title: "Finalist Selection",
    description: "One finalist from each group advances to the final round, selected by their group's judging panel.",
  },
  {
    step: "04",
    title: "Final Competition",
    description: "5 finalists compete in-person with 5-minute pitches and 10-minute Q&A sessions before a panel of 5 judges.",
  },
]

const impactStats = [
  { value: "8", label: "Years" },
  { value: "$700K+", label: "Invested" },
  { value: "349+", label: "Applicants" },
  { value: "$100K", label: "Prize Pool" },
]

const pastWinners = [
  {
    year: "2024",
    applicants: 54,
    finalists: [
      { place: "1st", name: "Axicle", status: "alive" as const },
      { place: "2nd", name: "Balam", status: "alive" as const },
      { place: "3rd", name: "Wild Forge", status: "alive" as const },
      { place: "4th", name: "Just-in-Traps", status: "dead" as const },
      { place: "5th", name: "BobiHealth", status: "alive" as const },
    ],
  },
  {
    year: "2023",
    applicants: 59,
    finalists: [
      { place: "1st", name: "M Aerospace RTC", status: "dead" as const },
      { place: "2nd", name: "Kaleido", status: "dead" as const },
      { place: "3rd", name: "MedCognition", status: "alive" as const },
      { place: "4th", name: "Texas Contrast Coverage", status: "dead" as const },
      { place: "5th", name: "Hover City", status: "alive" as const },
    ],
  },
  {
    year: "2022",
    applicants: 82,
    finalists: [
      { place: "1st", name: "Sensytec", status: "alive" as const },
      { place: "2nd", name: "Developmate", status: "alive" as const },
      { place: "3rd", name: "Kiro Auction", status: "dead" as const },
      { place: "4th", name: "Grackle", status: "dead" as const },
      { place: "5th", name: "Social Mining AI", status: "dead" as const },
    ],
  },
  {
    year: "2021",
    applicants: 55,
    finalists: [
      { place: "1st", name: "Betty's Co", status: "alive" as const },
      { place: "2nd", name: "Alt-Bionics", status: "alive" as const },
      { place: "3rd", name: "EmGenisys", status: "alive" as const },
      { place: "4th", name: "IncentiFind", status: "alive" as const },
      { place: "5th", name: "Astroport", status: "alive" as const },
    ],
  },
  {
    year: "2020",
    applicants: 42,
    finalists: [
      { place: "1st", name: "Grain4Grain", status: "dead" as const },
      { place: "2nd", name: "Allosense", status: "alive" as const },
      { place: "3rd", name: "Fast Visa", status: "alive" as const },
      { place: "4th", name: "Mineral Analytics", status: "exited" as const },
      { place: "5th", name: "Ava Propulsion", status: "dead" as const },
    ],
  },
  {
    year: "2019",
    applicants: 57,
    finalists: [
      { place: "1st", name: "Rectify", status: "alive" as const },
      { place: "2nd", name: "Checkups", status: "dead" as const },
      { place: "3rd", name: "Train the Mind", status: "dead" as const },
      { place: "4th", name: "Sendspark", status: "exited" as const },
      { place: "5th", name: "Tuuk", status: "dead" as const },
    ],
  },
]

const timeline = [
  { date: "Feb 16", event: "Applications Open" },
  { date: "Mar 22", event: "Applications Close" },
  { date: "Mar 27", event: "Semi-Finalists Announced" },
  { date: "Apr 2-3", event: "Semi-Finals Judging" },
  { date: "Apr 3", event: "Finalists Announced" },
  { date: "Apr 10-12", event: "Geekdom 3-Day Bootcamp" },
  { date: "Apr 20", event: "Tech Fuel Event @ UTSA SP1" },
]

function PitchCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    function update() {
      const now = Date.now()
      const diff = target - now

      if (diff <= 0) {
        setIsOpen(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (isOpen) {
    return (
      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center p-8 sm:p-12 bg-white border border-primary/30 rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Applications Are Open!</h3>
              <p className="text-muted-foreground mb-6">Submit your pitch now. Applications close March 22, 2026.</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all text-lg"
              >
                Apply Now
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white border border-border rounded-2xl p-6 sm:p-10 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-foreground">Pitch Application</h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
                    aria-label="Close form"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <PitchSubmissionForm />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <div className="space-y-8">
      {/* Countdown Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
        {units.map((unit) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white border border-border rounded-xl p-4 sm:p-6 text-center shadow-sm">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tabular-nums leading-none">
                {String(unit.value).padStart(2, "0")}
              </span>
              <p className="font-mono text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase mt-2">
                {unit.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Red Arrow Divider */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <div className="relative w-8 h-8">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-primary animate-bounce">
            <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border border-border rounded-2xl p-6 sm:p-8 text-center shadow-sm"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-mono text-xs tracking-wider uppercase mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          February 16, 2026
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 tracking-tight">
          Applications Open Soon
        </h3>
        <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
          Pitch registration opens on February 16th. Prepare your 5-minute pitch deck and get ready to compete for $100K in non-dilutive cash prizes.
        </p>
      </motion.div>
    </div>
  )
}

function QualificationsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {qualifications.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full group"
          >
            <div className={`flex items-center justify-between p-5 bg-muted border rounded-xl transition-all duration-200 ${
              openIndex === index 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            }`}>
              <div className="flex items-center gap-4">
                <span className={`font-mono text-sm font-semibold transition-colors ${
                  openIndex === index ? "text-primary" : "text-muted-foreground"
                }`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Editable
                  id={`techfuel.qualifications.item.${index}.title`}
                  as="span"
                  className="text-base font-semibold text-foreground tracking-tight text-left"
                  page="techfuel"
                  section="qualifications"
                >
                  {item.title}
                </Editable>
              </div>
              <motion.div
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                  openIndex === index 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-border text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="stroke-current">
                  <path d="M6 2.5V9.5M2.5 6H9.5" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.div>
            </div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 py-4 ml-9">
                  <Editable
                    id={`techfuel.qualifications.item.${index}.description`}
                    as="p"
                    className="text-muted-foreground leading-relaxed text-base"
                    page="techfuel"
                    section="qualifications"
                  >
                    {item.description}
                  </Editable>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

function ScreeningAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {screeningCriteria.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full group"
          >
            <div className={`flex items-center justify-between p-5 bg-white border rounded-xl transition-all duration-200 ${
              openIndex === index 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            }`}>
              <div className="flex items-center gap-4">
                <span className={`font-mono text-sm font-semibold transition-colors ${
                  openIndex === index ? "text-primary" : "text-muted-foreground"
                }`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Editable
                  id={`techfuel.screening.item.${index}.title`}
                  as="span"
                  className="text-base font-semibold text-foreground tracking-tight text-left"
                  page="techfuel"
                  section="screening"
                >
                  {item.title}
                </Editable>
              </div>
              <motion.div
                animate={{ rotate: openIndex === index ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                  openIndex === index 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-border text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="stroke-current">
                  <path d="M6 2.5V9.5M2.5 6H9.5" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.div>
            </div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 py-4 ml-9">
                  <Editable
                    id={`techfuel.screening.item.${index}.description`}
                    as="p"
                    className="text-muted-foreground leading-relaxed text-base"
                    page="techfuel"
                    section="screening"
                  >
                    {item.description}
                  </Editable>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

function PastWinnersAccordion() {
  const [openYear, setOpenYear] = useState<string | null>("2024")

  return (
    <div className="space-y-3">
      {pastWinners.map((yearData, yearIndex) => {
        const isOpen = openYear === yearData.year
        return (
          <motion.div
            key={yearData.year}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: yearIndex * 0.05 }}
          >
            <button
              onClick={() => setOpenYear(isOpen ? null : yearData.year)}
              className="w-full group"
            >
              <div className={`flex items-center justify-between px-6 py-5 border rounded-xl transition-all duration-200 ${
                isOpen
                  ? "border-primary bg-primary/5 rounded-b-none"
                  : "border-border bg-white hover:border-primary/50"
              }`}>
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-2xl font-bold transition-colors ${
                    isOpen ? "text-primary" : "text-foreground"
                  }`}>
                    {yearData.year}
                  </span>
                  <span className="text-sm text-muted-foreground hidden sm:inline">Tech Fuel</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-muted-foreground">
                    {yearData.applicants} applicants
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                      isOpen
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                      <path d="M3.5 5.25L7 8.75L10.5 5.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border border-t-0 border-primary rounded-b-xl bg-muted divide-y divide-border">
                    {yearData.finalists.map((finalist) => (
                      <div
                        key={finalist.name}
                        className="flex items-center justify-between px-6 py-3.5 hover:bg-white/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className={`font-mono text-sm font-semibold w-8 ${
                            finalist.place === "1st" ? "text-primary" : "text-muted-foreground"
                          }`}>
                            {finalist.place}
                          </span>
                          <span className={`font-semibold text-foreground ${
                            finalist.place === "1st" ? "text-base" : "text-sm"
                          }`}>
                            {finalist.name}
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          finalist.status === "alive"
                            ? "bg-emerald-100 text-emerald-700"
                            : finalist.status === "exited"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            finalist.status === "alive"
                              ? "bg-emerald-500"
                              : finalist.status === "exited"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                          }`} />
                          {finalist.status === "alive" ? "Active" : finalist.status === "exited" ? "Exited" : "Inactive"}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function TechFuelPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero - Light Theme with dvh */}
      <section className="relative min-h-dvh flex items-center justify-center px-4 bg-white overflow-hidden">
        {/* Pixel Arrow - Top Right */}
        <PixelArrow position="top-right" size="xl" variant="light" type="anniversary" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Editable 
              id="techfuel.hero.subtitle" 
              as="p" 
              className="font-mono text-sm text-primary mb-6 tracking-widest uppercase"
              page="techfuel"
              section="hero"
            >
              April 20, 2026 • UTSA SP1
            </Editable>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 leading-[0.95] tracking-tight">
              <Editable 
                id="techfuel.hero.title" 
                as="span" 
                className="text-foreground"
                page="techfuel"
                section="hero"
              >
                TECH FUEL
              </Editable>{" "}
              <span className="text-primary">2026</span>
            </h1>
            <Editable 
              id="techfuel.hero.prize" 
              as="p" 
              className="font-mono text-xl sm:text-2xl md:text-3xl text-primary font-bold mb-8 tracking-tight"
              page="techfuel"
              section="hero"
            >
              $100K Pitch Competition
            </Editable>
            <Editable 
              id="techfuel.hero.description" 
              as="p" 
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-normal"
              page="techfuel"
              section="hero"
            >
              Greater San Antonio's largest cash prize pitch competition with $100,000 in non-dilutive cash prizes along with resources and support, sponsored by Bexar County.
            </Editable>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#submit"
                className="px-10 py-5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all text-lg"
              >
                Submit Your Pitch
              </a>
              <Link
                href="/register"
                className="px-10 py-5 bg-transparent border-2 border-foreground/30 text-foreground font-semibold rounded-md hover:bg-foreground hover:text-white transition-all text-lg"
              >
                Attend as Spectator
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Tech Fuel - Light Theme */}
      <section className="py-24 md:py-32 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Editable 
                id="techfuel.about.label" 
                as="p" 
                className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
                page="techfuel"
                section="about"
              >
                About Tech Fuel
              </Editable>
              <Editable 
                id="techfuel.about.title" 
                as="h2" 
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8 leading-[0.95] tracking-tight"
                page="techfuel"
                section="about"
              >
                Fuel Your Growth
              </Editable>
              <Editable 
                id="techfuel.about.description" 
                as="p" 
                className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
                page="techfuel"
                section="about"
              >
                TechFuel is greater San Antonio's largest cash prize pitch competition. With $100,000 available in non-dilutive cash prize money along with resources and support, this is your opportunity to showcase innovation to investors, gain exposure, and accelerate your startup's journey.
              </Editable>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </span>
                  <span className="text-foreground leading-relaxed text-base">
                    <Editable 
                      id="techfuel.about.bullet1" 
                      as="span" 
                      className="text-foreground leading-relaxed text-base"
                      page="techfuel"
                      section="about"
                    >
                      Non-Dilutive Capital: Keep your equity while receiving cash prizes
                    </Editable>
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </span>
                  <span className="text-foreground leading-relaxed text-base">
                    <Editable 
                      id="techfuel.about.bullet2" 
                      as="span" 
                      className="text-foreground leading-relaxed text-base"
                      page="techfuel"
                      section="about"
                    >
                      Expert Judges: VCs, successful founders, and industry leaders
                    </Editable>
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </span>
                  <span className="text-foreground leading-relaxed text-base">
                    <Editable 
                      id="techfuel.about.bullet3" 
                      as="span" 
                      className="text-foreground leading-relaxed text-base"
                      page="techfuel"
                      section="about"
                    >
                      Bexar County Backed: Sponsored by Bexar County to drive local innovation
                    </Editable>
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-10 rounded-xl border border-border"
            >
              <Editable 
                id="techfuel.timeline.title" 
                as="h3" 
                className="text-xl md:text-2xl font-bold text-foreground mb-8 tracking-tight"
                page="techfuel"
                section="about"
              >
                Timeline
              </Editable>
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={item.date} className="flex items-center gap-5">
                    <div className="w-20 shrink-0">
                      <Editable 
                        id={`techfuel.timeline.item.${index}.date`} 
                        as="span" 
                        className="font-mono text-sm text-primary font-semibold"
                        page="techfuel"
                        section="about"
                      >
                        {item.date}
                      </Editable>
                    </div>
                    <div className="relative flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${index === timeline.length - 1 ? "bg-primary border-primary" : "bg-white border-primary/40"}`} />
                      {index < timeline.length - 1 && <div className="absolute top-4 left-1.75 w-0.5 h-12 bg-primary/20" />}
                    </div>
                    <Editable 
                      id={`techfuel.timeline.item.${index}.event`} 
                      as="span" 
                      className="text-foreground font-medium text-base"
                      page="techfuel"
                      section="about"
                    >
                      {item.event}
                    </Editable>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Qualifications - Light Theme */}
      <section className="relative py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Editable
              id="techfuel.qualifications.label"
              as="p"
              className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
              page="techfuel"
              section="qualifications"
            >
              How It Works
            </Editable>
            <Editable
              id="techfuel.qualifications.title"
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight"
              page="techfuel"
              section="qualifications"
            >
              Qualifications
            </Editable>
            <Editable
              id="techfuel.qualifications.description"
              as="p"
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              page="techfuel"
              section="qualifications"
            >
              Prospective startups should have a well-defined startup with innovative potential, showcasing the capacity to disrupt and reshape the tech landscape.
            </Editable>
          </motion.div>

          <QualificationsAccordion />
        </div>
      </section>

      {/* Screening Criteria - Light Theme */}
      <section className="py-24 md:py-32 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Editable
              id="techfuel.screening.label"
              as="p"
              className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
              page="techfuel"
              section="screening"
            >
              Selection Criteria
            </Editable>
            <Editable
              id="techfuel.screening.title"
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight"
              page="techfuel"
              section="screening"
            >
              How We Evaluate
            </Editable>
            <Editable
              id="techfuel.screening.description"
              as="p"
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              page="techfuel"
              section="screening"
            >
              The screening committee determines which applicants advance to the semi-final round based on these criteria.
            </Editable>
          </motion.div>

          <ScreeningAccordion />
        </div>
      </section>

      {/* Qualification Process - Light Theme */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Editable
              id="techfuel.process.label"
              as="p"
              className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
              page="techfuel"
              section="process"
            >
              The Journey
            </Editable>
            <Editable
              id="techfuel.process.title"
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight"
              page="techfuel"
              section="process"
            >
              Qualification Process
            </Editable>
            <Editable
              id="techfuel.process.description"
              as="p"
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              page="techfuel"
              section="process"
            >
              From application to the final stage, here&apos;s how the competition unfolds.
            </Editable>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="p-8 bg-muted border border-border rounded-xl h-full">
                  <Editable
                    id={`techfuel.process.step.${index}.number`}
                    as="span"
                    className="font-mono text-5xl font-bold text-primary/20 mb-4 block leading-none"
                    page="techfuel"
                    section="process"
                  >
                    {step.step}
                  </Editable>
                  <Editable
                    id={`techfuel.process.step.${index}.title`}
                    as="h3"
                    className="text-xl font-bold text-foreground mb-3 leading-tight tracking-tight"
                    page="techfuel"
                    section="process"
                  >
                    {step.title}
                  </Editable>
                  <Editable
                    id={`techfuel.process.step.${index}.description`}
                    as="p"
                    className="text-muted-foreground leading-relaxed text-sm"
                    page="techfuel"
                    section="process"
                  >
                    {step.description}
                  </Editable>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section - Light Theme */}
      <section className="py-24 md:py-32 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Editable
                id="techfuel.impact.label"
                as="p"
                className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
                page="techfuel"
                section="impact"
              >
                Our Track Record
              </Editable>
              <Editable
                id="techfuel.impact.title"
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8 leading-[0.95] tracking-tight"
                page="techfuel"
                section="impact"
              >
                The Impact Throughout the Years
              </Editable>
              <Editable
                id="techfuel.impact.description"
                as="p"
                className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
                page="techfuel"
                section="impact"
              >
                Since its founding in 2015, Tech Fuel has grown into San Antonio&apos;s largest cash prize pitch competition. Now entering its 8th competition and 11th year, Tech Fuel has invested over $700K in non-dilutive cash prizes, reviewed 349+ startup applications, and championed innovation across Bexar County — underscoring Tech Bloc&apos;s commitment to economic development and job creation.
              </Editable>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {impactStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="p-8 bg-white border border-border rounded-xl text-center"
                >
                  <Editable
                    id={`techfuel.impact.stat.${index}.value`}
                    as="span"
                    className="block font-mono text-4xl md:text-5xl font-bold text-primary mb-2 leading-none"
                    page="techfuel"
                    section="impact"
                  >
                    {stat.value}
                  </Editable>
                  <Editable
                    id={`techfuel.impact.stat.${index}.label`}
                    as="span"
                    className="text-muted-foreground text-sm font-medium uppercase tracking-wide"
                    page="techfuel"
                    section="impact"
                  >
                    {stat.label}
                  </Editable>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pitch Submission - Coming Soon with Countdown */}
      <section id="submit" className="py-24 md:py-32 bg-muted relative overflow-hidden">
        {/* Pixel Arrow Background */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12 opacity-[0.06] pointer-events-none">
          <PixelArrow position="top-right" size="xl" variant="light" type="static" interactive={false} />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Editable
              id="techfuel.submit.label"
              as="p"
              className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
              page="techfuel"
              section="submit"
            >
              Ready to Compete?
            </Editable>
            <Editable
              id="techfuel.submit.title"
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight"
              page="techfuel"
              section="submit"
            >
              Submit Your Pitch
            </Editable>
            <Editable
              id="techfuel.submit.description"
              as="p"
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              page="techfuel"
              section="submit"
            >
              Applications open February 16, 2026. Get ready to pitch your startup.
            </Editable>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <PitchCountdown targetDate="2026-02-16T00:00:00" />
          </motion.div>
        </div>
      </section>

      {/* Past Winners - Real Data */}
      <section className="relative py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Editable
              id="techfuel.featured.label"
              as="p"
              className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
              page="techfuel"
              section="featured"
            >
              Past Winners
            </Editable>
            <Editable
              id="techfuel.featured.title"
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight"
              page="techfuel"
              section="featured"
            >
              Tech Fuel Alumni
            </Editable>
            <Editable
              id="techfuel.featured.description"
              as="p"
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              page="techfuel"
              section="featured"
            >
              6 years of finalists — from first pitch to exit. Here&apos;s every startup that competed on the Tech Fuel stage.
            </Editable>
          </motion.div>

          <PastWinnersAccordion />
        </div>
      </section>

      {/* Sponsors */}
      <Sponsors variant="light" event="techfuel" />
    </main>
  )
}

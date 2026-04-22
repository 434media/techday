"use client"

import { useState, useRef } from "react"
import { Sponsors } from "@/components/sections/sponsors"
import { PixelArrow } from "@/components/pixel-arrow"
import { Editable } from "@/components/editable"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"

const finalists2026 = [
  {
    name: "ComeBack Mobility",
    description: "Rehabilitation, redefined. Using real-time biomechanical data to guide safer, faster recovery.",
    image: "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Fcomback.png?alt=media",
    website: "https://www.comebackmobility.com",
  },
  {
    name: "Freyya",
    description: "Advancing women's health with real-time, data-driven pelvic care.",
    image: "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Ffreyya.png?alt=media",
    website: "https://www.freyya.com",
    winner: true,
  },
  {
    name: "Openlane",
    description: "An open-source, AI-native platform helping companies get compliant faster.",
    image: "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Fopenlane.png?alt=media",
    website: "https://www.theopenlane.io",
  },
  {
    name: "Bytewhisper Security",
    description: "Turning security policies into actionable intelligence — analyzed and improved in hours, not weeks.",
    image: "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Fbytewhisper.png?alt=media",
    website: "https://www.bytewhispersecurity.com",
  },
  {
    name: "RentBamboo",
    description: "Automating the leasing process — from first inquiry to signed lease — so teams can scale without added headcount.",
    image: "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Frentbamboo.png?alt=media",
    website: "https://www.rentbamboo.com",
  },
]

const processSteps = [
  {
    step: "01",
    title: "75+ Applications",
    description: "Startups across Bexar County submitted pitches showcasing innovative products with real traction and revenue.",
  },
  {
    step: "02",
    title: "25 Semi-Finalists",
    description: "Placed into 5 groups for private Zoom pitch sessions with 4–5 judges. Each delivered a 5-minute pitch followed by 5-minute Q&A.",
  },
  {
    step: "03",
    title: "5 Finalists Selected",
    description: "One finalist from each group was selected by their judging panel to advance to the final round.",
  },
  {
    step: "04",
    title: "Finals — April 20",
    description: "5 finalists compete in-person at UTSA SP1 with 5-minute pitches and 10-minute Q&A sessions before a panel of 5 judges.",
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
    year: "2026",
    applicants: 75,
    finalists: [
      { place: "1st", name: "Freyya", status: "alive" as const },
      { place: "Finalist", name: "ComeBack Mobility", status: "alive" as const },
      { place: "Finalist", name: "Openlane", status: "alive" as const },
      { place: "Finalist", name: "Bytewhisper Security", status: "alive" as const },
      { place: "Finalist", name: "RentBamboo", status: "alive" as const },
    ],
  },
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
  { date: "Feb 16", event: "Applications Open", completed: true },
  { date: "Mar 22", event: "Applications Close", completed: true },
  { date: "Mar 27", event: "Semi-Finalists Announced", completed: true },
  { date: "Apr 2-3", event: "Semi-Finals Judging", completed: true },
  { date: "Apr 3", event: "Finalists Announced", completed: true },
  { date: "Apr 10-12", event: "Geekdom 3-Day Bootcamp", completed: false },
  { date: "Apr 20", event: "Tech Fuel Finals @ UTSA SP1", completed: false },
]



function FinalistsSection() {
  const marqueeRef = useRef<HTMLDivElement>(null)
  // Duplicate array for seamless marquee loop
  const marqueeItems = [...finalists2026, ...finalists2026]

  const handleMouseEnter = () => {
    const el = marqueeRef.current
    if (!el) return
    // Grab the current computed transform so we can freeze at this position
    const computedStyle = window.getComputedStyle(el)
    const transform = computedStyle.getPropertyValue("transform")
    // Pause the CSS animation
    el.style.animationPlayState = "paused"
    // Apply the current transform as an inline style via a CSS transition for smooth deceleration
    el.style.transform = transform
    el.style.transition = "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)"
  }

  const handleMouseLeave = () => {
    const el = marqueeRef.current
    if (!el) return
    // Clear inlines and let the CSS animation resume
    el.style.transition = ""
    el.style.transform = ""
    el.style.animationPlayState = ""
  }

  return (
    <section id="finalists" className="py-10 md:py-16 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-mono text-sm text-white/50 tracking-widest uppercase"
        >
          2026 Finalists &middot; Congratulations to All Who Applied
        </motion.p>
      </div>

      {/* Marquee */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={marqueeRef} className="flex gap-5 animate-scroll-finalists w-max">
          {marqueeItems.map((finalist, index) => (
            <div
              key={`${finalist.name}-${index}`}
              className="shrink-0 w-64 sm:w-72 md:w-80 group/card"
            >
              <a
                href={finalist.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-4/5 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                {/* Full-card image */}
                <img
                  src={finalist.image}
                  alt={finalist.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                />

                {/* Default bottom gradient with name */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover/card:opacity-0" />
                <div className="absolute bottom-0 left-0 right-0 p-5 transition-opacity duration-300 group-hover/card:opacity-0">
                  <h3 className="text-lg font-bold text-white tracking-tight leading-none">
                    {finalist.name}
                  </h3>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                  <h3 className="text-lg font-bold text-white tracking-tight leading-none mb-3">
                    {finalist.name}
                  </h3>
                  <p className="text-[13px] text-white/70 leading-relaxed mb-4">
                    {finalist.description}
                  </p>
                  {finalist.winner && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-yellow-400 tracking-tight mb-2">
                      🏆 2026 Winner
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary tracking-tight">
                    Visit Website
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="stroke-current">
                      <path d="M3.5 10.5L10.5 3.5M10.5 3.5H5.25M10.5 3.5V8.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 md:mt-10"
        >
          <Link
            href="/techfuel"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all text-lg"
          >
            Congratulations to Our 2026 Finalists
          </Link>
        </motion.div>
      </div>
    </section>
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
                            {finalist.name === "Freyya" ? (
                              <a href="https://www.freyya.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                {finalist.name}
                              </a>
                            ) : (
                              finalist.name
                            )}
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
      {/* Hero */}
      <section className="relative min-h-dvh flex items-center justify-center px-4 bg-white overflow-hidden">
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
            <Editable 
              id="techfuel.hero.time" 
              as="p" 
              className="font-mono text-sm text-muted-foreground mb-6 tracking-widest uppercase font-medium leading-none"
              page="techfuel"
              section="hero"
            >
              2:00 PM – 6:00 PM
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
              Congratulations to{" "}
              <a href="https://www.freyya.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                Freyya
              </a>
              , the 2026 Tech Fuel winner, and to all the finalists and companies that applied. Thank you, San Antonio!
            </Editable>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/techfuel"
                className="px-10 py-5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all text-lg"
              >
                Thanks for Attending!
              </Link>
              <a
                href="#finalists"
                className="px-10 py-5 bg-muted border border-border text-foreground font-semibold rounded-md hover:border-primary/50 transition-all text-lg"
              >
                Meet the Finalists
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meet the Finalists */}
      <FinalistsSection />

      {/* Sponsors — elevated placement */}
      <Sponsors variant="light" event="techfuel" />

      {/* How It Works — The Journey */}
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
              How It Works
            </Editable>
            <Editable
              id="techfuel.process.title"
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight"
              page="techfuel"
              section="process"
            >
              The Journey to the Stage
            </Editable>
            <Editable
              id="techfuel.process.description"
              as="p"
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              page="techfuel"
              section="process"
            >
              From application to the final stage — here&apos;s how our 5 finalists earned their spot.
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

      {/* About Tech Fuel + Timeline */}
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
                San Antonio&apos;s Largest Cash Prize Pitch Competition
              </Editable>
              <Editable 
                id="techfuel.about.description" 
                as="p" 
                className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
                page="techfuel"
                section="about"
              >
                Tech Fuel awards $100,000 in non-dilutive cash prizes to early-stage startups building in Bexar County. No equity taken — just capital, resources, and exposure to accelerate growth.
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
                2026 Timeline
              </Editable>
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={item.date} className="flex items-center gap-5">
                    <div className="w-20 shrink-0">
                      <Editable 
                        id={`techfuel.timeline.item.${index}.date`} 
                        as="span" 
                        className={`font-mono text-sm font-semibold ${item.completed ? "text-muted-foreground" : "text-primary"}`}
                        page="techfuel"
                        section="about"
                      >
                        {item.date}
                      </Editable>
                    </div>
                    <div className="relative flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        item.completed 
                          ? "bg-primary border-primary" 
                          : index === timeline.length - 1 
                            ? "bg-white border-primary ring-4 ring-primary/10" 
                            : "bg-white border-primary/40"
                      }`}>
                        {item.completed && (
                          <svg className="w-2.5 h-2.5 text-primary-foreground absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {index < timeline.length - 1 && <div className="absolute top-4 left-1.75 w-0.5 h-12 bg-primary/20" />}
                    </div>
                    <Editable 
                      id={`techfuel.timeline.item.${index}.event`} 
                      as="span" 
                      className={`font-medium text-base ${item.completed ? "text-muted-foreground" : "text-foreground"}`}
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

      {/* Impact Section */}
      <section className="py-24 md:py-32 bg-white">
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
                  className="p-8 bg-muted border border-border rounded-xl text-center"
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

      {/* Past Winners */}
      <section className="relative py-24 md:py-32 bg-muted">
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

      {/* Register CTA */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center p-8 sm:p-12 bg-muted border border-primary/30 rounded-2xl">
              <Editable
                id="techfuel.cta.label"
                as="p"
                className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
                page="techfuel"
                section="cta"
              >
                April 20, 2026
              </Editable>
              <Editable
                id="techfuel.cta.title"
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight"
                page="techfuel"
                section="cta"
              >
                Thank You for Attending Tech Fuel 2026!
              </Editable>
              <Editable
                id="techfuel.cta.description"
                as="p"
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed"
                page="techfuel"
                section="cta"
              >
                Congratulations to{" "}
                <a href="https://www.freyya.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                  Freyya
                </a>
                , our 2026 winner, and to all the incredible finalists and companies that applied to be part of Tech Fuel. See you next year!
              </Editable>
              <Link
                href="/techfuel"
                className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all text-lg"
              >
                Thanks for Attending!
              </Link>
            </div>
          </motion.div>
        </div>

        <PixelArrow position="bottom-left" size="lg" variant="light" type="anniversary" />
      </section>
    </main>
  )
}

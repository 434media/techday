"use client"

import { useState } from "react"
import { PitchSubmissionForm } from "@/components/forms/pitch-submission-form"
import { Sponsors } from "@/components/sections/sponsors"
import { PixelArrow } from "@/components/pixel-arrow"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"

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
  { value: "6", label: "Years" },
  { value: "$550K+", label: "Invested" },
  { value: "28", label: "Startups Funded" },
  { value: "$100K", label: "Prize Pool" },
]

const timeline = [
  { date: "Feb 1", event: "Applications Open" },
  { date: "Mar 1", event: "Applications Close" },
  { date: "Mar 7", event: "Semi-Finalists Announced" },
  { date: "Mar 14", event: "Semi-Final Pitch Sessions" },
  { date: "Mar 21", event: "Finalists Announced" },
  { date: "Apr 9", event: "Final Competition @ Stable Hall" },
]

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
                <span className="text-base font-semibold text-foreground tracking-tight text-left">
                  {item.title}
                </span>
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
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {item.description}
                  </p>
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
                <span className="text-base font-semibold text-foreground tracking-tight text-left">
                  {item.title}
                </span>
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
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
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
            <p className="font-mono text-sm text-primary mb-6 tracking-widest uppercase">
              April 9, 2026 • Stable Hall
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 leading-[0.95] tracking-tight">
              TECH FUEL <span className="text-primary">2026</span>
            </h1>
            <p className="font-mono text-xl sm:text-2xl md:text-3xl text-primary font-bold mb-8 tracking-tight">
              $100K Pitch Competition
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-normal">
              Greater San Antonio&apos;s largest cash prize pitch competition with $100,000 in non-dilutive 
              cash prizes along with resources and support, sponsored by Bexar County.
            </p>
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
              <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">About Tech Fuel</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8 leading-[0.95] tracking-tight">
                Fuel Your Growth
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                TechFuel is greater San Antonio&apos;s largest cash prize pitch competition. With $100,000 available 
                in non-dilutive cash prize money along with resources and support, this is your opportunity to 
                showcase innovation to investors, gain exposure, and accelerate your startup&apos;s journey.
              </p>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </span>
                  <span className="text-foreground leading-relaxed text-base">
                    <strong className="font-semibold">Non-Dilutive Capital:</strong> Keep your equity while receiving cash prizes
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </span>
                  <span className="text-foreground leading-relaxed text-base">
                    <strong className="font-semibold">Expert Judges:</strong> VCs, successful founders, and industry leaders
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </span>
                  <span className="text-foreground leading-relaxed text-base">
                    <strong className="font-semibold">Bexar County Backed:</strong> Sponsored by Bexar County to drive local innovation
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
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-8 tracking-tight">Timeline</h3>
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={item.date} className="flex items-center gap-5">
                    <div className="w-20 shrink-0">
                      <span className="font-mono text-sm text-primary font-semibold">{item.date}</span>
                    </div>
                    <div className="relative flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${index === timeline.length - 1 ? "bg-primary border-primary" : "bg-white border-primary/40"}`} />
                      {index < timeline.length - 1 && <div className="absolute top-4 left-1.75 w-0.5 h-12 bg-primary/20" />}
                    </div>
                    <span className="text-foreground font-medium text-base">{item.event}</span>
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
            <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">How It Works</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight">
              Qualifications
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Prospective startups should have a well-defined startup with innovative potential, showcasing the capacity to disrupt and reshape the tech landscape.
            </p>
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
            <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">Selection Criteria</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight">
              How We Evaluate
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The screening committee determines which applicants advance to the semi-final round based on these criteria.
            </p>
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
            <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">The Journey</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight">
              Qualification Process
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From application to the final stage, here&apos;s how the competition unfolds.
            </p>
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
                  <span className="font-mono text-5xl font-bold text-primary/20 mb-4 block leading-none">{step.step}</span>
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-tight tracking-tight">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
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
              <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">Our Track Record</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8 leading-[0.95] tracking-tight">
                The Impact Throughout the Years
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                In its 6 years of existence, through strategic investments totaling over $550K, Tech Fuel has 
                propelled the growth and success of 28 diverse startups across the state. This financial backing 
                not only signifies a commitment from Bexar County to innovation but also underscores Tech Bloc&apos;s 
                role in fostering economic development and job creation.
              </p>
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
                  <span className="block font-mono text-4xl md:text-5xl font-bold text-primary mb-2 leading-none">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pitch Submission Form - Light Theme */}
      <section id="submit" className="py-24 md:py-32 bg-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">Apply Now</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight">
              Submit Your Pitch
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Applications close March 1, 2026. Finalists will be notified by March 7.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <PitchSubmissionForm />
          </motion.div>
        </div>
      </section>

      {/* Previous Winners / Featured Companies - Light Theme */}
      <section className="relative py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">Success Stories</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight">
              Featured Companies
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Past Tech Fuel participants who&apos;ve gone on to raise funding, scale their teams, and make an impact.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "NeuralPath AI",
                raised: "$2.5M",
                description: "AI-powered healthcare diagnostics",
                year: "2025",
              },
              {
                name: "SecureStack",
                raised: "$1.8M",
                description: "Cybersecurity for SMBs",
                year: "2025",
              },
              {
                name: "GreenGrid",
                raised: "$3.2M",
                description: "Smart energy management",
                year: "2024",
              },
            ].map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 md:p-8 bg-muted border border-border rounded-xl"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight">{company.name}</h3>
                    <p className="text-muted-foreground text-sm md:text-base">{company.description}</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground font-medium bg-white px-2 py-1 rounded">{company.year}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Raised:</span>
                  <span className="font-mono text-primary font-bold text-lg">{company.raised}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <Sponsors variant="light" />
    </main>
  )
}

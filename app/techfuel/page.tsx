"use client"

import { PitchSubmissionForm } from "@/components/forms/pitch-submission-form"
import { Sponsors } from "@/components/sections/sponsors"
import { EasterEggArrow } from "@/components/easter-eggs"
import { motion } from "motion/react"
import Link from "next/link"

const rules = [
  {
    title: "Eligibility",
    description:
      "Must be a San Antonio-based company or have a strong SA connection. All stages welcome, from idea to Series A.",
  },
  {
    title: "Pitch Format",
    description: "5 minutes to pitch, followed by 3 minutes of Q&A from our panel of judges.",
  },
  {
    title: "Selection",
    description:
      "10 finalists will be selected to pitch live at Tech Day. Selection based on innovation, market potential, and team.",
  },
  {
    title: "Prizes",
    description:
      "Cash prizes, mentorship, office space, and cloud credits. People's Champ award decided by audience vote.",
  },
]

const timeline = [
  { date: "Feb 1", event: "Applications Open" },
  { date: "Mar 1", event: "Applications Close" },
  { date: "Mar 7", event: "Finalists Announced" },
  { date: "Apr 10", event: "Pitch Competition @ Stable Hall" },
]

export default function TechFuelPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 bg-white overflow-hidden">
        {/* Easter Egg Arrow - Top Right */}
        <EasterEggArrow type="anniversary" position="top-6 right-4 md:right-8 lg:right-12 z-20" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">APRIL 10, 2026 • STABLE HALL • SAN ANTONIO</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[1.1]">
              Tech <span className="text-primary">Fuel</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
              San Antonio&apos;s premier startup pitch competition. Showcase your innovation to investors, win prizes,
              and fuel your startup&apos;s growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#submit"
                className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all"
              >
                Submit Your Pitch
              </a>
              <Link
                href="/register"
                className="px-8 py-4 bg-transparent border-2 border-foreground text-foreground font-semibold rounded-md hover:bg-foreground hover:text-white transition-all"
              >
                Attend as Spectator
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Tech Fuel */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">ABOUT TECH FUEL</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">Launch Your Vision</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Tech Fuel is more than a pitch competition—it&apos;s a launchpad for San Antonio&apos;s most promising
                startups. Whether you&apos;re pre-revenue or scaling, this is your chance to gain exposure, connect with
                investors, and join SA&apos;s thriving tech ecosystem.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  </span>
                  <span className="text-foreground leading-relaxed">
                    <strong>Expert Judges:</strong> VCs, successful founders, and industry leaders
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  </span>
                  <span className="text-foreground leading-relaxed">
                    <strong>Live Audience:</strong> 500+ tech enthusiasts, investors, and potential partners
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  </span>
                  <span className="text-foreground leading-relaxed">
                    <strong>Real Prizes:</strong> Cash, cloud credits, mentorship, and more
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg border border-border shadow-sm"
            >
              <h3 className="text-xl font-bold text-foreground mb-6">Timeline</h3>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={item.date} className="flex items-center gap-4">
                    <div className="w-20 shrink-0">
                      <span className="font-mono text-sm text-primary font-semibold">{item.date}</span>
                    </div>
                    <div className="relative flex items-center">
                      <div className={`w-3 h-3 rounded-full ${index === 0 ? "bg-primary" : "bg-muted"}`} />
                      {index < timeline.length - 1 && <div className="absolute top-3 left-1.5 w-px h-12 bg-border" />}
                    </div>
                    <span className="text-foreground font-medium">{item.event}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rules of the Road */}
      <section className="relative py-24 bg-white">
        {/* Easter Egg Arrow - Top Right */}
        <EasterEggArrow type="video" position="top-6 right-4 md:right-8 lg:right-12 z-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">HOW IT WORKS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">Rules of the Road</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-muted border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <span className="font-mono text-primary font-bold">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">{rule.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{rule.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pitch Submission Form */}
      <section id="submit" className="py-24 bg-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">APPLY NOW</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">Submit Your Pitch</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Applications close November 1, 2026. Finalists will be notified by November 7.
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

      {/* Previous Winners / Featured Companies */}
      <section className="relative py-24 bg-white">
        {/* Easter Egg Arrow - Top Right */}
        <EasterEggArrow type="anniversary" position="top-6 right-4 md:right-8 lg:right-12 z-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">SUCCESS STORIES</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">Featured Companies</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Past Tech Fuel participants who&apos;ve gone on to raise funding, scale their teams, and make an impact.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="p-6 bg-muted border border-border rounded-lg shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{company.name}</h3>
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground font-medium">{company.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Raised:</span>
                  <span className="font-mono text-primary font-bold">{company.raised}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Sponsors />
    </main>
  )
}

"use client"

import { PitchSubmissionForm } from "@/components/forms/pitch-submission-form"
import { Sponsors } from "@/components/sections/sponsors"
import { PixelArrow } from "@/components/pixel-arrow"
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
    <main className="min-h-screen bg-white">
      {/* Hero - Light Theme with dvh */}
      <section className="relative min-h-dvh flex items-center justify-center px-4 bg-white overflow-hidden">
        {/* Pixel Arrow - Top Right */}
        <PixelArrow position="top-right" size="xl" variant="light" type="anniversary" />
        {/* Pixel Arrow - Bottom Left */}
        <PixelArrow position="bottom-left" size="lg" variant="light" type="video" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="font-mono text-sm text-primary mb-6 tracking-widest uppercase">
              April 10, 2026 • Stable Hall • San Antonio
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-[0.95] tracking-tight">
              TECH <span className="text-primary">FUEL</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-normal">
              San Antonio&apos;s premier startup pitch competition. Showcase your innovation to investors, 
              win prizes, and fuel your startup&apos;s growth.
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
                Launch Your Vision
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Tech Fuel is more than a pitch competition—it&apos;s a launchpad for San Antonio&apos;s most promising
                startups. Whether you&apos;re pre-revenue or scaling, this is your chance to gain exposure, connect with
                investors, and join SA&apos;s thriving tech ecosystem.
              </p>
              <ul className="space-y-5">
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
                    <strong className="font-semibold">Live Audience:</strong> 500+ tech enthusiasts, investors, and potential partners
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                  </span>
                  <span className="text-foreground leading-relaxed text-base">
                    <strong className="font-semibold">Real Prizes:</strong> Cash, cloud credits, mentorship, and more
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

      {/* Rules of the Road - Light Theme */}
      <section className="relative py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">How It Works</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[0.95] tracking-tight">
              Rules of the Road
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {rules.map((rule, index) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 md:p-8 bg-muted border border-border rounded-xl hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="font-mono text-primary font-bold text-lg">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 leading-tight tracking-tight">{rule.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{rule.description}</p>
              </motion.div>
            ))}
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

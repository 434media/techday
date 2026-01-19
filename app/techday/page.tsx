"use client"

import { useState, useEffect } from "react"
import { SpeakerCard, type Speaker } from "@/components/sections/speaker-card"
import { Schedule } from "@/components/sections/schedule"
import { Sponsors } from "@/components/sections/sponsors"
import { EasterEggArrow } from "@/components/easter-eggs"
import { motion } from "motion/react"
import Link from "next/link"

export default function TechDayPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [isLoadingSpeakers, setIsLoadingSpeakers] = useState(true)

  useEffect(() => {
    async function fetchSpeakers() {
      try {
        const response = await fetch("/api/content/speakers")
        const data = await response.json()
        setSpeakers(data.speakers || [])
      } catch (error) {
        console.error("Failed to fetch speakers:", error)
      } finally {
        setIsLoadingSpeakers(false)
      }
    }
    fetchSpeakers()
  }, [])
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 bg-white">
        {/* Easter Egg Arrow - Top Right */}
        <EasterEggArrow type="video" position="top-6 right-4 md:right-8 lg:right-12 z-20" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">APRIL 9, 2026 • TECH PORT • SAN ANTONIO</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-[1.1]">
              Tech Day <span className="text-primary">2026</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
              A full day celebrating San Antonio&apos;s tech community with three tracks of inspiring sessions, networking
              opportunities, and the Tech Fuel pitch competition finals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all"
              >
                Register Now
              </Link>
              <a
                href="#schedule"
                className="px-8 py-4 bg-transparent border-2 border-foreground text-foreground font-semibold rounded-md hover:bg-foreground hover:text-white transition-all"
              >
                View Schedule
              </a>
            </div>
          </motion.div>
        </div>
      </section>

            {/* Tracks Overview */}
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
            <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">THREE TRACKS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-[1.1]">Choose Your Path</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* AI Track */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="relative p-8 bg-muted border border-chart-4/30 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-chart-4 to-primary" />
              <h3 className="text-2xl font-bold text-foreground mb-4 leading-[1.2] tracking-tight">AI</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed font-medium">
                Dive into the future of artificial intelligence. From LLMs to computer vision, discover how AI is reshaping industries.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="w-1.5 h-1.5 bg-chart-4 rounded-full" />
                  Building with LLMs & Agents
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="w-1.5 h-1.5 bg-chart-4 rounded-full" />
                  AI Ethics & Governance
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="w-1.5 h-1.5 bg-chart-4 rounded-full" />
                  Enterprise AI Adoption
                </li>
              </ul>
            </motion.div>

            {/* Emerging Industries Track */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-8 bg-muted border border-primary/30 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <h3 className="text-2xl font-bold text-foreground mb-4 leading-[1.2] tracking-tight">Emerging Industries</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed font-medium">
                Explore cutting-edge technologies transforming San Antonio: cybersecurity, healthcare innovation, aerospace, and clean energy.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Healthcare Innovation
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Cybersecurity: The New Frontier
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Space Tech & Aerospace
                </li>
              </ul>
            </motion.div>

            {/* Founders & Investors Track */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-8 bg-muted border border-foreground/20 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-foreground" />
              <h3 className="text-2xl font-bold text-foreground mb-4 leading-[1.2] tracking-tight">Founders & Investors</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed font-medium">
                Learn from successful founders and connect with investors. Fundraising strategies, building in public, and scaling your startup.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                  Leveraging Hyperscaler Funding
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                  Building in Public Panel
                </li>
                <li className="flex items-center gap-2 text-foreground font-semibold">
                  <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                  Investor Office Hours
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">MEET THE SPEAKERS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
              Industry Leaders & Innovators
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Learn from the best minds in San Antonio&apos;s tech ecosystem and beyond.
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoadingSpeakers && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading speakers...</p>
            </div>
          )}

          {/* No Speakers Message */}
          {!isLoadingSpeakers && speakers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center p-12 border-2 border-dashed border-border rounded-lg"
            >
              <p className="text-muted-foreground font-mono">Speakers to be announced...</p>
            </motion.div>
          )}

          {/* Speakers Grid */}
          {!isLoadingSpeakers && speakers.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {speakers.map((speaker, index) => (
                  <SpeakerCard key={speaker.id} speaker={speaker} index={index} />
                ))}
              </div>

              {/* More speakers coming */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-12 text-center p-8 border-2 border-dashed border-border rounded-lg"
              >
                <p className="text-muted-foreground font-mono">More speakers to be announced...</p>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Schedule Section */}
      <div id="schedule">
        <Schedule />
      </div>

      <Sponsors />
    </main>
  )
}

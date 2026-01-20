"use client"

import { useState, useEffect } from "react"
import { SpeakerCard, type Speaker } from "@/components/sections/speaker-card"
import { Schedule } from "@/components/sections/schedule"
import { Sponsors } from "@/components/sections/sponsors"
import { PixelArrow } from "@/components/pixel-arrow"
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
    <main className="min-h-screen bg-foreground">
      {/* Hero - Dark Theme with dvh */}
      <section className="relative min-h-dvh flex items-center justify-center px-4 bg-foreground overflow-hidden">
        {/* Pixel Arrow - Top Right */}
        <PixelArrow position="top-right" size="xl" variant="dark" type="video" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="font-mono text-sm text-primary mb-6 tracking-widest uppercase">
              April 10, 2026 • Tech Port • San Antonio
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.95] tracking-tight">
              TECH DAY <span className="text-primary">2026</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed font-normal">
              A full day celebrating San Antonio&apos;s tech community with three tracks of inspiring sessions, and
              networking opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-10 py-5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all text-lg"
              >
                Register Now
              </Link>
              <a
                href="#schedule"
                className="px-10 py-5 bg-transparent border-2 border-white/30 text-white font-semibold rounded-md hover:bg-white hover:text-foreground transition-all text-lg"
              >
                View Schedule
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tracks Overview - Dark Theme */}
      <section className="relative py-24 md:py-32 bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">Three Tracks</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[0.95] tracking-tight">
              Choose Your Path
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Emerging Industries Track */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-8 md:p-10 bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight tracking-tight">Emerging Industries</h3>
              <p className="text-white/60 mb-8 leading-relaxed text-base">
                Explore cutting-edge technologies transforming San Antonio: cybersecurity, healthcare innovation, aerospace, and clean energy.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                  Healthcare Innovation
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                  Cybersecurity: The New Frontier
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
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
              className="relative p-8 md:p-10 bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-white" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight tracking-tight">Founders & Investors</h3>
              <p className="text-white/60 mb-8 leading-relaxed text-base">
                Learn from successful founders and connect with investors. Fundraising strategies, building in public, and scaling your startup.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-white rounded-full shrink-0" />
                  Leveraging Hyperscaler Funding
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-white rounded-full shrink-0" />
                  Building in Public Panel
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-white rounded-full shrink-0" />
                  Investor Office Hours
                </li>
              </ul>
            </motion.div>
            {/* AI Track */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="relative p-8 md:p-10 bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-chart-4 to-primary" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight tracking-tight">AI</h3>
              <p className="text-white/60 mb-8 leading-relaxed text-base">
                Dive into the future of artificial intelligence. From LLMs to computer vision, discover how AI is reshaping industries.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-chart-4 rounded-full shrink-0" />
                  Building with LLMs & Agents
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-chart-4 rounded-full shrink-0" />
                  AI Ethics & Governance
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-chart-4 rounded-full shrink-0" />
                  Enterprise AI Adoption
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Speakers Section - Dark Theme */}
      <section className="py-24 md:py-32 bg-foreground/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="font-mono text-sm text-primary mb-4 tracking-widest uppercase">Meet the Speakers</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[0.95] tracking-tight">
              Industry Leaders & Innovators
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Learn from the best minds in San Antonio&apos;s tech ecosystem and beyond.
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoadingSpeakers && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading speakers...</p>
            </div>
          )}

          {/* No Speakers Message */}
          {!isLoadingSpeakers && speakers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center p-12 border-2 border-dashed border-white/20 rounded-xl"
            >
              <p className="text-white/60 font-mono">Speakers to be announced...</p>
            </motion.div>
          )}

          {/* Speakers Grid */}
          {!isLoadingSpeakers && speakers.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {speakers.map((speaker, index) => (
                  <SpeakerCard key={speaker.id} speaker={speaker} index={index} />
                ))}
              </div>

              {/* More speakers coming */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-16 text-center p-10 border-2 border-dashed border-white/20 rounded-xl"
              >
                <p className="text-white/60 font-mono">More speakers to be announced...</p>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Schedule Section */}
      <div id="schedule" className="bg-foreground">
        <Schedule variant="dark" />
      </div>

      {/* Sponsors */}
      <Sponsors variant="dark" />
    </main>
  )
}

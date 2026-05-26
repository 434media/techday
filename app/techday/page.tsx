"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { SpeakerCard, type Speaker } from "@/components/sections/speaker-card"
import { Schedule } from "@/components/sections/schedule"
import { Sponsors } from "@/components/sections/sponsors"
import { PixelArrow } from "@/components/pixel-arrow"
import { Editable } from "@/components/editable"
import { motion } from "motion/react"

const TECHDAY_HERO_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/techday%2Ftechday.jpeg?alt=media"

export default function TechDayPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [isLoadingSpeakers, setIsLoadingSpeakers] = useState(true)
  const [showAllSpeakers, setShowAllSpeakers] = useState(false)

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
      {/* Hero - Dark Theme, image left / text right */}
      <section className="relative min-h-dvh bg-foreground overflow-hidden">
        {/* Pixel Arrow - Top Right */}
        <PixelArrow position="top-right" size="xl" variant="dark" type="video" />

        <div className="relative z-10 min-h-dvh grid grid-cols-1 md:grid-cols-2">
          {/* Image (left on desktop, top on mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[55vh] md:h-auto overflow-hidden"
          >
            <Image
              src={TECHDAY_HERO_IMAGE}
              alt="Tech Day 2026 — San Antonio"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {/* Edge fade into the dark text panel */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-foreground/40 md:to-foreground/80" />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-transparent md:from-foreground/30" />
          </motion.div>

          {/* Text (right on desktop, bottom on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex items-center px-6 sm:px-10 md:px-12 lg:px-16 py-14 md:py-20"
          >
            <div className="max-w-xl">
              <Editable
                id="techday.hero.subtitle"
                as="p"
                className="font-mono text-sm text-primary mb-6 tracking-widest uppercase"
                page="techday"
                section="hero"
              >
                April 21, 2026 • Boeing Center at Tech Port
              </Editable>
              <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-[0.95] tracking-tight">
                <Editable
                  id="techday.hero.title"
                  as="span"
                  className="text-white"
                  page="techday"
                  section="hero"
                >
                  TECH DAY
                </Editable>{" "}
                <span className="text-primary">2026</span>
              </h1>
              <Editable
                id="techday.hero.description"
                as="p"
                className="text-base sm:text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-light"
                page="techday"
                section="hero"
              >
                Emerging Industries. Founders &amp; Investors. AI. Three tracks powering the future and growth of San Antonio.
              </Editable>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#sponsors"
                  className="px-10 py-5 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-all text-lg text-center"
                >
                  Thank You to Our Sponsors
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Speakers Section - Dark Theme */}
      <section id="speakers" className="py-24 md:py-32 bg-foreground/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Editable 
              id="techday.speakers.label" 
              as="p" 
              className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
              page="techday"
              section="speakers"
            >
              Cyber &middot; Bio &middot; Aerospace &middot; AI &middot; Startups
          </Editable>
          <Editable 
              id="techday.speakers.title" 
              as="h2" 
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[0.95] tracking-tight"
              page="techday"
              section="speakers"
            >
              Meet the Speakers
            </Editable>
            <Editable 
              id="techday.speakers.description" 
              as="p" 
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
              page="techday"
              section="speakers"
            >
              Leaders from the industries shaping San Antonio&apos;s future — cybersecurity, life sciences, aerospace, and AI.
            </Editable>
          </motion.div>

          {/* Loading State */}
          {isLoadingSpeakers && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/70">Loading speakers...</p>
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
              <p className="text-white/70 font-mono">Speakers to be announced...</p>
            </motion.div>
          )}

          {/* Speakers Grid */}
          {!isLoadingSpeakers && speakers.length > 0 && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {(showAllSpeakers ? speakers : speakers.slice(0, 8)).map((speaker, index) => (
                  <SpeakerCard key={speaker.id} speaker={speaker} index={index} />
                ))}
              </div>
              {speakers.length > 8 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center mt-12"
                >
                  <button
                    onClick={() => setShowAllSpeakers(!showAllSpeakers)}
                    className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-md hover:bg-white hover:text-foreground transition-all"
                  >
                    {showAllSpeakers ? "Show Less" : `View All Speakers`}
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Schedule Section */}
      <div id="schedule" className="bg-foreground">
        <Schedule variant="dark" />
      </div>

      {/* Tracks Overview - Dark Theme */}
      <section className="relative py-24 md:py-32 bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Editable 
              id="techday.tracks.label" 
              as="p" 
              className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
              page="techday"
              section="tracks"
            >
              Three Tracks
            </Editable>
            <Editable 
              id="techday.tracks.title" 
              as="h2" 
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[0.95] tracking-tight"
              page="techday"
              section="tracks"
            >
              Choose Your Path
            </Editable>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Emerging Industries Track */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-8 md:p-10 bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-emerald-500/30 transition-colors"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
              <Editable 
                id="techday.track.emerging.title" 
                as="h3" 
                className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight tracking-tight"
                page="techday"
                section="tracks"
              >
                Emerging Industries
              </Editable>
              <Editable 
                id="techday.track.emerging.description" 
                as="p" 
                className="text-white/70 mb-8 leading-relaxed text-base"
                page="techday"
                section="tracks"
              >
                Explore cutting-edge technologies transforming San Antonio: cybersecurity, healthcare innovation, aerospace, and clean energy.
              </Editable>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                  <Editable 
                    id="techday.track.emerging.bullet1" 
                    as="span" 
                    className="text-white/80 text-sm font-medium"
                    page="techday"
                    section="tracks"
                  >
                    Cyber &amp; Tech
                  </Editable>
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                  <Editable 
                    id="techday.track.emerging.bullet2" 
                    as="span" 
                    className="text-white/80 text-sm font-medium"
                    page="techday"
                    section="tracks"
                  >
                    Bio &amp; Life Science
                  </Editable>
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                  <Editable 
                    id="techday.track.emerging.bullet3" 
                    as="span" 
                    className="text-white/80 text-sm font-medium"
                    page="techday"
                    section="tracks"
                  >
                    Aerospace &amp; Advanced Manufacturing
                  </Editable>
                </li>
              </ul>
            </motion.div>

            {/* Founders & Investors Track */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-8 md:p-10 bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-violet-500/30 transition-colors"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-violet-500" />
              <Editable 
                id="techday.track.founders.title" 
                as="h3" 
                className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight tracking-tight"
                page="techday"
                section="tracks"
              >
                Founders & Investors
              </Editable>
              <Editable 
                id="techday.track.founders.description" 
                as="p" 
                className="text-white/70 mb-8 leading-relaxed text-base"
                page="techday"
                section="tracks"
              >
                Learn from successful founders and connect with investors. Fundraising strategies, building in public, and scaling your startup.
              </Editable>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-violet-500 rounded-full shrink-0" />
                  <Editable 
                    id="techday.track.founders.bullet1" 
                    as="span" 
                    className="text-white/80 text-sm font-medium"
                    page="techday"
                    section="tracks"
                  >
                    Leveraging Hyperscaler Funding
                  </Editable>
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-violet-500 rounded-full shrink-0" />
                  <Editable 
                    id="techday.track.founders.bullet2" 
                    as="span" 
                    className="text-white/80 text-sm font-medium"
                    page="techday"
                    section="tracks"
                  >
                    Building in Public Panel
                  </Editable>
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-violet-500 rounded-full shrink-0" />
                  <Editable 
                    id="techday.track.founders.bullet3" 
                    as="span" 
                    className="text-white/80 text-sm font-medium"
                    page="techday"
                    section="tracks"
                  >
                    Investor Office Hours
                  </Editable>
                </li>
              </ul>
            </motion.div>
            {/* AI Track */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative p-8 md:p-10 bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-blue-500/30 transition-colors"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
              <Editable 
                id="techday.track.ai.title" 
                as="h3" 
                className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight tracking-tight"
                page="techday"
                section="tracks"
              >
                AI
              </Editable>
              <Editable 
                id="techday.track.ai.description" 
                as="p" 
                className="text-white/70 mb-8 leading-relaxed text-base"
                page="techday"
                section="tracks"
              >
                Dive into the future of artificial intelligence. From LLMs to computer vision, discover how AI is reshaping industries.
              </Editable>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                  <Editable 
                    id="techday.track.ai.bullet1" 
                    as="span" 
                    className="text-white/80 text-sm font-medium"
                    page="techday"
                    section="tracks"
                  >
                    Building with LLMs &amp; Agents
                  </Editable>
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                  <Editable 
                    id="techday.track.ai.bullet2" 
                    as="span" 
                    className="text-white/80 text-sm font-medium"
                    page="techday"
                    section="tracks"
                  >
                    AI Ethics &amp; Governance
                  </Editable>
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                  <Editable 
                    id="techday.track.ai.bullet3" 
                    as="span" 
                    className="text-white/80 text-sm font-medium"
                    page="techday"
                    section="tracks"
                  >
                    Enterprise AI Adoption
                  </Editable>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <Sponsors
        variant="dark"
      
      />
    </main>
  )
}

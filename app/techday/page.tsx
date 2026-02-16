"use client"

import { useState, useEffect } from "react"
import { SpeakerCard, type Speaker } from "@/components/sections/speaker-card"
import { Schedule } from "@/components/sections/schedule"
import { Sponsors } from "@/components/sections/sponsors"
import { PixelArrow } from "@/components/pixel-arrow"
import { Editable } from "@/components/editable"
import { motion } from "motion/react"
import Link from "next/link"

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
            <Editable 
              id="techday.hero.subtitle" 
              as="p" 
              className="font-mono text-sm text-primary mb-6 tracking-widest uppercase"
              page="techday"
              section="hero"
            >
              April 21, 2026 • Tech Port
            </Editable>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.95] tracking-tight">
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
              className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed font-normal"
              page="techday"
              section="hero"
            >
              A full day celebrating San Antonio's tech community with three tracks of inspiring sessions, and networking opportunities.
            </Editable>
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
                className="text-white/60 mb-8 leading-relaxed text-base"
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
                className="text-white/60 mb-8 leading-relaxed text-base"
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
                className="text-white/60 mb-8 leading-relaxed text-base"
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

      {/* Schedule Section */}
      <div id="schedule" className="bg-foreground">
        <Schedule variant="dark" />
      </div>

      {/* Speakers Section - Dark Theme */}
      <section className="py-24 md:py-32 bg-foreground/95">
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
              Meet the Speakers
            </Editable>
            <Editable 
              id="techday.speakers.title" 
              as="h2" 
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[0.95] tracking-tight"
              page="techday"
              section="speakers"
            >
              Industry Leaders & Innovators
            </Editable>
            <Editable 
              id="techday.speakers.description" 
              as="p" 
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
              page="techday"
              section="speakers"
            >
              Learn from the best minds in San Antonio's tech ecosystem and beyond.
            </Editable>
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

      {/* Sponsors */}
      <Sponsors
        variant="dark"
        staticSponsors={[
          {
            name: "H-E-B",
            website: "https://www.heb.com",
            logo: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 536.28 186.25" aria-hidden="true" className="h-12 md:h-16 w-auto">
                <g fill="#fff">
                  <path d="M417.02 104.41h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48m1.02-31.16h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m12.03 8.11c0-5.61-4.18-8.11-12.03-8.11h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98m-13.05 23.05h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48M443.16 0H93.13C41.7 0 0 41.69 0 93.12s41.7 93.13 93.13 93.13h350.03c51.43 0 93.12-41.7 93.12-93.13S494.59 0 443.16 0m0 174.19H93.12c-44.76 0-81.05-36.28-81.05-81.05s36.29-81.05 81.05-81.05h350.04c44.76 0 81.05 36.29 81.05 81.05s-36.29 81.05-81.05 81.05m1.78-150.08-353.63.02c-37.07 0-67.2 30.95-67.17 69.07 0 37.93 30.16 68.88 67.17 68.88l353.63-.07c37.1-.03 67.15-30.89 67.2-68.85-.05-38.2-30.1-69.05-67.2-69.05m-279.8 108.13h-32.67v-27.82h-23.86v27.82H75.93l-4.65-78.29h37.33v35.39h23.86V53.95h37.32zm40.56-27.82h-22.04l-.89-15.08h23.82zm110.11-31.18H256.9v16.1h44.81v15.08H256.9v14.83h56.18l-.76 12.99h-88.1l-4.65-78.29h97.39zm36.77 31.17h-22.04l-.89-15.08h23.82zm108.97 9.03s1.59 18.8-26.4 18.8H371.1l-4.66-78.29h73.29c14.23 0 25.31 8.58 25.28 22.4 0 12.08-6.58 17.85-16.48 20.67 7.69 1.81 13.02 8.46 13.02 16.42m-43.51-40.19h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m-1.02 31.16h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48" />
                  <path d="M417.02 104.41h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48m1.02-31.16h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m12.03 8.11c0-5.61-4.18-8.11-12.03-8.11h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98m-13.05 23.05h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48m27.92-80.3-353.63.02c-37.07 0-67.2 30.95-67.17 69.07 0 37.93 30.16 68.88 67.17 68.88l353.63-.07c37.1-.03 67.15-30.89 67.2-68.85-.05-38.2-30.1-69.05-67.2-69.05m-279.8 108.13h-32.67v-27.82h-23.86v27.82H75.93l-4.65-78.29h37.33v35.39h23.86V53.95h37.32zm40.56-27.82h-22.04l-.89-15.08h23.82zm110.11-31.18H256.9v16.1h44.81v15.08H256.9v14.83h56.18l-.76 12.99h-88.1l-4.65-78.29h97.39zm36.77 31.17h-22.04l-.89-15.08h23.82zm108.97 9.03s1.59 18.8-26.4 18.8H371.1l-4.66-78.29h73.29c14.23 0 25.31 8.58 25.28 22.4 0 12.08-6.58 17.85-16.48 20.67 7.69 1.81 13.02 8.46 13.02 16.42m-43.51-40.19h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m-1.02 31.16h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48" />
                  <path d="M417.02 104.41h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48m1.02-31.16h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m12.03 8.11c0-5.61-4.18-8.11-12.03-8.11h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98m-13.05 23.05h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48m27.92-80.3-353.63.02c-37.07 0-67.2 30.95-67.17 69.07 0 37.93 30.16 68.88 67.17 68.88l353.63-.07c37.1-.03 67.15-30.89 67.2-68.85-.05-38.2-30.1-69.05-67.2-69.05m-279.8 108.13h-32.67v-27.82h-23.86v27.82H75.93l-4.65-78.29h37.33v35.39h23.86V53.95h37.32zm40.56-27.82h-22.04l-.89-15.08h23.82zm110.11-31.18H256.9v16.1h44.81v15.08H256.9v14.83h56.18l-.76 12.99h-88.1l-4.65-78.29h97.39zm36.77 31.17h-22.04l-.89-15.08h23.82zm108.97 9.03s1.59 18.8-26.4 18.8H371.1l-4.66-78.29h73.29c14.23 0 25.31 8.58 25.28 22.4 0 12.08-6.58 17.85-16.48 20.67 7.69 1.81 13.02 8.46 13.02 16.42m-43.51-40.19h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m-1.02 31.16h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48" />
                </g>
                <path fill="#fff" d="M530.34 172.78c0-2.46-1.46-3.54-4.4-3.54h-4.74v12.44h1.88v-5.39h2.17l3.28 5.39h2.11l-3.54-5.48c1.83-.23 3.23-1.2 3.23-3.42Zm-7.25 1.91v-3.86h2.57c1.31 0 2.71.29 2.71 1.83 0 1.92-1.43 2.03-3.03 2.03h-2.26Z" />
                <path fill="#fff" d="M525.37 164.67c-5.93 0-10.96 4.57-10.96 10.76s5.02 10.81 10.96 10.81 10.9-4.57 10.9-10.81-5.02-10.76-10.9-10.76m0 19.78c-4.93 0-8.79-3.83-8.79-9.02s3.85-8.96 8.79-8.96 8.73 3.85 8.73 8.96-3.85 9.02-8.73 9.02" />
              </svg>
            ),
          },
          {
            name: "IRYS",
            website: "https://www.irystechnologies.com/",
            logo: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none" aria-hidden="true" className="h-12 md:h-16 w-auto">
                <path d="M82.0345 64.7158L133.021 43.3023L132.056 41.0429L86.8004 60.0436L122.449 25.127L113.76 16.3859L83.7724 45.7574L99.5044 7.24267L90.3349 3.54941L73.4888 44.7838L73.7873 0.411719L65.1243 0.353516L64.7991 49.5406L45.538 4.35896L38.6982 7.2268L58.6844 54.1069L22.7423 17.9574L18.3389 22.275L57.3623 61.5199L5.99212 40.8524L4.13691 45.4029L57.6502 66.9381L0.0266553 66.5571L0 70.2398L58.3858 70.6261L55.9655 72.9912L4.97922 94.4048L5.94414 96.6641L51.1996 77.6634L15.5507 112.58L24.2404 121.321L54.2276 91.9496L38.4956 130.464L47.6651 134.158L64.5112 92.9232L64.2127 137.295L72.8704 137.354L73.2009 88.1664L92.462 133.353L99.2965 130.48L79.3156 83.6001L115.258 119.75L119.661 115.437L80.6377 76.1871L132.003 96.8546L133.863 92.3041L80.3498 70.7689L137.973 71.1499L138 67.4672L79.6142 67.081L82.0345 64.7158Z" fill="#fff" />
              </svg>
            ),
          },
        ]}
      />
    </main>
  )
}

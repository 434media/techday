"use client"

import { motion } from "motion/react"
import { useInView } from "motion/react"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { EasterEggArrow } from "@/components/easter-eggs"

interface Sponsor {
  id: string
  name: string
  logoUrl: string
  website: string
  tier: string
}

interface SponsorsData {
  platinum: Sponsor[]
  gold: Sponsor[]
  silver: Sponsor[]
  bronze: Sponsor[]
  community: Sponsor[]
}

const DEFAULT_SPONSORS: SponsorsData = {
  platinum: [],
  gold: [],
  silver: [],
  bronze: [],
  community: [],
}

export function Sponsors() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [sponsors, setSponsors] = useState<SponsorsData>(DEFAULT_SPONSORS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const response = await fetch("/api/content/sponsors")
        const data = await response.json()
        setSponsors(data.sponsors || DEFAULT_SPONSORS)
      } catch (error) {
        console.error("Failed to fetch sponsors:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSponsors()
  }, [])

  const hasSponsors = sponsors.platinum.length > 0 || sponsors.gold.length > 0 || sponsors.silver.length > 0 || sponsors.bronze.length > 0 || sponsors.community.length > 0

  return (
    <section ref={ref} id="sponsors" className="relative py-24 bg-white">
      {/* Easter Egg Arrow - Top Right - Opens Video */}
      <div className="absolute top-6 right-4 md:right-8 lg:right-12 z-20">
        <EasterEggArrow type="video" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">OUR PARTNERS</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">Sponsors</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tech Day is made possible by the generous support of our sponsors who believe in San Antonio&apos;s tech
            future.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading sponsors...</p>
          </div>
        )}

        {/* No Sponsors Message */}
        {!isLoading && !hasSponsors && (
          <div className="text-center py-12 mb-12">
            <p className="text-muted-foreground">Sponsor announcements coming soon...</p>
          </div>
        )}

        {/* Platinum Sponsors */}
        {sponsors.platinum.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex justify-center mb-6">
              <span className="wristband bg-linear-to-r from-primary to-primary/80">
                ★ Platinum Sponsors
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {sponsors.platinum.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-8 bg-white border-2 border-primary/30 rounded-xl hover:border-primary transition-all shadow-lg hover:shadow-xl group"
                >
                  <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary/30" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary/30" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary/30" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/30" />
                  
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="h-16 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="h-16 flex items-center justify-center text-xl font-bold text-primary">
                      {sponsor.name}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Gold Sponsors */}
        {sponsors.gold.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1.5 bg-linear-to-r from-amber-500 to-yellow-400 rounded-full text-white font-semibold text-xs tracking-wider uppercase">
                Gold Sponsors
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {sponsors.gold.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 bg-white border border-amber-200 rounded-lg hover:border-amber-400 transition-all shadow-md hover:shadow-lg"
                >
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="h-12 flex items-center justify-center text-lg font-bold text-amber-600">
                      {sponsor.name}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Silver Sponsors */}
        {sponsors.silver.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1.5 bg-linear-to-r from-gray-400 to-gray-300 rounded-full text-white font-semibold text-xs tracking-wider uppercase">
                Silver Sponsors
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {sponsors.silver.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
                >
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="h-10 flex items-center justify-center text-base font-bold text-gray-600">
                      {sponsor.name}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bronze Sponsors */}
        {sponsors.bronze.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mb-12"
          >
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1.5 bg-linear-to-r from-amber-700 to-amber-600 rounded-full text-white font-semibold text-xs tracking-wider uppercase">
                Bronze Sponsors
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {sponsors.bronze.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white border border-amber-200 rounded-lg hover:border-amber-400 transition-all shadow-sm hover:shadow-md"
                >
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="h-8 flex items-center justify-center text-sm font-bold text-amber-700">
                      {sponsor.name}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Community Partners */}
        {sponsors.community.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-16"
          >
            <div className="flex justify-center mb-6">
              <span className="px-4 py-1.5 bg-linear-to-r from-primary/60 to-primary/40 rounded-full text-white font-semibold text-xs tracking-wider uppercase">
                Community Partners
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {sponsors.community.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white border border-border rounded-lg hover:border-primary/40 transition-all shadow-sm hover:shadow-md"
                >
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="h-8 flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {sponsor.name}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Become a Sponsor CTA - Ticket style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20"
        >
          <div className="bg-linear-to-r from-primary to-primary/80 px-6 py-3">
            <p className="font-mono text-xs text-white/80 tracking-wider">PARTNERSHIP OPPORTUNITY</p>
          </div>
          
          <div className="absolute top-16 left-0 right-0 flex items-center justify-between">
            <div className="w-4 h-8 bg-background rounded-r-full -ml-0.5" />
            <div className="flex-1 border-t-2 border-dashed border-border" />
            <div className="w-4 h-8 bg-background rounded-l-full -mr-0.5" />
          </div>
          
          <div className="p-8 pt-12 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3 leading-snug">Become a Sponsor</h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
              Join San Antonio&apos;s top companies in supporting the local tech ecosystem. Multiple sponsorship tiers
              available with exclusive benefits.
            </p>
            <Link
              href="mailto:sponsors@techday.sa"
              className="inline-flex px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              Get Sponsorship Info
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

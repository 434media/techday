"use client"

import { motion } from "motion/react"
import { useInView } from "motion/react"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { PixelArrow } from "@/components/pixel-arrow"
import { Editable } from "@/components/editable"

interface Sponsor {
  id: string
  name: string
  logoUrl: string
  website: string
}

interface StaticSponsor {
  name: string
  website: string
  logo: React.ReactNode
}

interface SponsorsData {
  sponsors: Sponsor[]
  community: Sponsor[]
}

const DEFAULT_SPONSORS: SponsorsData = {
  sponsors: [],
  community: [],
}

interface SponsorsProps {
  variant?: "light" | "dark"
  event?: "techday" | "techfuel"
  staticSponsors?: StaticSponsor[]
}

export function Sponsors({ variant = "light", event = "techday", staticSponsors = [] }: SponsorsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [sponsors, setSponsors] = useState<SponsorsData>(DEFAULT_SPONSORS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const response = await fetch(`/api/content/sponsors?event=${event}`)
        const data = await response.json()
        setSponsors(data.sponsors || DEFAULT_SPONSORS)
      } catch (error) {
        console.error("Failed to fetch sponsors:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSponsors()
  }, [event])

  const hasSponsors = sponsors.sponsors.length > 0 || sponsors.community.length > 0 || staticSponsors.length > 0

  const isDark = variant === "dark"

  return (
    <section ref={ref} id="sponsors" className={`relative py-24 md:py-32 ${isDark ? "bg-foreground" : "bg-white"}`}>
      {/* Pixel Arrow - Top Right */}
      <PixelArrow position="top-right" size="xl" variant={variant} type="video" />
      {/* Pixel Arrow - Bottom Left */}
      <PixelArrow position="bottom-left" size="lg" variant={variant} type="anniversary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Editable 
            id="sponsors.label" 
            as="p" 
            className="font-mono text-sm text-primary mb-4 tracking-widest uppercase"
            page="global"
            section="sponsors"
          >
            Our Partners
          </Editable>
          <Editable 
            id="sponsors.title" 
            as="h2" 
            className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[0.95] tracking-tight ${isDark ? "text-white" : "text-foreground"}`}
            page="global"
            section="sponsors"
          >
            Sponsors
          </Editable>
          <Editable 
            id="sponsors.description" 
            as="p" 
            className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? "text-white/60" : "text-muted-foreground"}`}
            page="global"
            section="sponsors"
          >
            {event === "techfuel"
              ? "Tech Fuel is made possible by the generous support of our sponsors who believe in San Antonio's startup ecosystem."
              : "Tech Day is made possible by the generous support of our sponsors who believe in San Antonio's tech future."}
          </Editable>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className={isDark ? "text-white/60" : "text-muted-foreground"}>Loading sponsors...</p>
          </div>
        )}

        {/* No Sponsors Message */}
        {!isLoading && !hasSponsors && (
          <div className="text-center py-12 mb-12">
            <p className={isDark ? "text-white/60" : "text-muted-foreground"}>Sponsor announcements coming soon...</p>
          </div>
        )}

        {/* Static Sponsors (inline SVGs) */}
        {staticSponsors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-16"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {staticSponsors.map((sponsor) => (
                <a
                  key={sponsor.name}
                  href={sponsor.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative p-6 md:p-8 border rounded-xl transition-all shadow-sm hover:shadow-lg group ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:border-white/30"
                      : "bg-white border-border hover:border-primary/40"
                  }`}
                >
                  <div className="h-12 md:h-16 w-auto flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    {sponsor.logo}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sponsors */}
        {sponsors.sponsors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {sponsors.sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative p-6 md:p-8 border rounded-xl transition-all shadow-sm hover:shadow-lg group ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:border-white/30"
                      : "bg-white border-border hover:border-primary/40"
                  }`}
                >
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="h-12 md:h-16 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className={`h-12 md:h-16 flex items-center justify-center text-lg md:text-xl font-bold ${
                      isDark ? "text-white" : "text-foreground"
                    }`}>
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
            transition={{ duration: 0.6, delay: 0.3 }}
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
                  className={`p-3 border rounded-lg transition-all shadow-sm hover:shadow-md ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:border-white/30"
                      : "bg-white border-border hover:border-primary/40"
                  }`}
                >
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className={`h-8 flex items-center justify-center text-sm font-bold ${
                      isDark ? "text-white/60" : "text-muted-foreground"
                    }`}>
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`relative rounded-2xl overflow-hidden shadow-xl ${isDark ? "bg-white/5 border-2 border-white/10" : "bg-white border-2 border-primary/20"}`}
        >
          <div className="bg-linear-to-r from-primary to-primary/80 px-6 py-4">
            <Editable 
              id="sponsors.cta.label" 
              as="p" 
              className="font-mono text-xs text-white/80 tracking-widest uppercase"
              page="global"
              section="sponsors"
            >
              Partnership Opportunity
            </Editable>
          </div>
          
          <div className="absolute top-16 left-0 right-0 flex items-center justify-between">
            <div className={`w-4 h-8 rounded-r-full -ml-0.5 ${isDark ? "bg-foreground" : "bg-background"}`} />
            <div className={`flex-1 border-t-2 border-dashed ${isDark ? "border-white/10" : "border-border"}`} />
            <div className={`w-4 h-8 rounded-l-full -mr-0.5 ${isDark ? "bg-foreground" : "bg-background"}`} />
          </div>
          
          <div className="p-8 md:p-10 pt-14 text-center">
            <Editable 
              id="sponsors.cta.title" 
              as="h3" 
              className={`text-2xl md:text-3xl font-bold mb-4 leading-tight tracking-tight ${isDark ? "text-white" : "text-foreground"}`}
              page="global"
              section="sponsors"
            >
              Become a Sponsor
            </Editable>
            <Editable 
              id="sponsors.cta.description" 
              as="p" 
              className={`mb-8 max-w-lg mx-auto leading-relaxed text-base md:text-lg ${isDark ? "text-white/60" : "text-muted-foreground"}`}
              page="global"
              section="sponsors"
            >
              Join San Antonio&apos;s top companies in supporting the local tech ecosystem.
            </Editable>
            <Link
              href="/sponsor"
              className="inline-flex px-10 py-5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Get Sponsorship Info
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

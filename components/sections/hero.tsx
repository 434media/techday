"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useTransform, useSpring } from "motion/react"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Editable } from "@/components/editable"

interface Sponsor {
  id: string
  name: string
  logoUrl: string
  website?: string
  logoSize?: "default" | "large"
}

export function Hero() {
  const [apiSponsors, setApiSponsors] = useState<Sponsor[]>([])
  
  // Fetch sponsors from CMS (techday + techfuel)
  useEffect(() => {
    async function fetchSponsors() {
      try {
        const [techdayRes, techfuelRes] = await Promise.all([
          fetch("/api/content/sponsors?event=techday"),
          fetch("/api/content/sponsors?event=techfuel"),
        ])
        const techdayData = await techdayRes.json()
        const techfuelData = await techfuelRes.json()
        const techdaySponsors = techdayData.sponsors?.sponsors || []
        const techfuelSponsors = techfuelData.sponsors?.sponsors || []
        // Combine and deduplicate by id
        const combined = [...techdaySponsors]
        for (const s of techfuelSponsors) {
          if (!combined.some((existing: Sponsor) => existing.id === s.id)) {
            combined.push(s)
          }
        }
        setApiSponsors(combined)
      } catch (error) {
        console.error("Failed to fetch sponsors:", error)
      }
    }
    fetchSponsors()
  }, [])
  
  // Track blimp position for text effect
  const blimpProgress = useMotionValue(0)
  const [cycleCount, setCycleCount] = useState(0)
  
  // Create a smooth spring for the color transition
  const smoothProgress = useSpring(blimpProgress, { stiffness: 100, damping: 30 })
  
  // Transform progress to gradient position (moves left to right as blimp passes)
  const gradientPosition = useTransform(smoothProgress, [0, 1], ["-50%", "150%"])
  
  // Update progress based on animation cycle (50s duration)
  useEffect(() => {
    const duration = 50000 // 50 seconds in ms
    const startTime = Date.now()
    
    const updateProgress = () => {
      const elapsed = (Date.now() - startTime) % duration
      const progress = elapsed / duration
      blimpProgress.set(progress)
      
      // Track cycle for potential future use
      const newCycle = Math.floor((Date.now() - startTime) / duration)
      if (newCycle !== cycleCount) {
        setCycleCount(newCycle)
      }
    }
    
    const interval = setInterval(updateProgress, 50)
    return () => clearInterval(interval)
  }, [blimpProgress, cycleCount])
  return (
    <section className="relative h-dvh flex flex-col overflow-hidden bg-white">
      {/* Background - subtle pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]"
        style={{
          backgroundImage: "url('https://storage.googleapis.com/groovy-ego-462522-v2.firebasestorage.app/techday/arrowdown.svg')",
        }}
      />

      {/* Floating Blimp — 10 Year Anniversary Banner */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <motion.div
          className="absolute"
          initial={{ x: "100vw", y: "5%" }}
          animate={{
            x: "-100%",
            y: ["5%", "7%", "3%", "6%", "5%"],
          }}
          transition={{
            x: {
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            },
            y: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <Image
            src="https://storage.googleapis.com/groovy-ego-462522-v2.firebasestorage.app/techday/TechBlocBlimp.png"
            alt="Tech Bloc 10 Year Anniversary"
            width={300}
            height={150}
            className="w-28 sm:w-36 md:w-48 lg:w-56 h-auto mt-14 sm:mt-16 md:mt-20"
            style={{
              filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))",
            }}
            draggable={false}
          />
        </motion.div>
      </div>
      
      {/* Main Content - Centered */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-12 pb-2">
        
        {/* Headlines */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Headline - Bebas Neue with color sweep effect */}
          <motion.h1 
            className="mt-1 md:mt-3 font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none text-center uppercase"
            style={{
              backgroundImage: "linear-gradient(90deg, #0a0a0a 0%, #0a0a0a 40%, #dc2626 50%, #0a0a0a 60%, #0a0a0a 100%)",
              backgroundSize: "200% 100%",
              backgroundPositionX: gradientPosition,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Tech Day
            <br />
            <span style={{ color: "#dc2626" }}>&</span>
            <span> Tech Fuel</span>
          </motion.h1>
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="mt-1 md:mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Editable 
            id="hero.subtitle" 
            as="p" 
            className="hidden sm:block text-[#0a0a0a]/60 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed"
            page="home"
            section="hero"
          >
            San Antonio&apos;s startup pitch competition and tech conference — two days of founders, investors, and emerging industries.
          </Editable>
          <p className="sm:hidden text-[#0a0a0a]/60 text-sm font-medium max-w-xs mx-auto leading-relaxed">
            Two days of founders, investors, and emerging industries shaping the future of San Antonio.
          </p>
          <Editable 
            id="hero.tagline" 
            as="span" 
            className="text-[#dc2626] font-semibold text-xs sm:text-sm tracking-wide uppercase mt-2 inline-block"
            page="home"
            section="hero"
          >
            Hecho en San Antonio
          </Editable>
        </motion.div>

        {/* Date & CTA — paired columns */}
        <motion.div
          className="mt-3 md:mt-6 flex flex-col sm:flex-row items-center sm:items-stretch gap-3 sm:gap-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Tech Fuel column */}
          <div className="flex flex-col items-center gap-2 sm:gap-3 sm:pr-8 sm:border-r sm:border-[#0a0a0a]/10">
            <div className="text-center">
              <p className="text-[#0a0a0a]/50 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Tech Fuel</p>
              <Editable 
                id="hero.techfuel.date" 
                as="p" 
                className="text-[#0a0a0a] text-lg sm:text-xl font-semibold leading-tight"
                page="home"
                section="hero"
              >
                April 20
              </Editable>
              <Editable 
                id="hero.techfuel.venue" 
                as="p" 
                className="text-[#0a0a0a]/60 text-xs sm:text-sm"
                page="home"
                section="hero"
              >
                UTSA SP1
              </Editable>
              <p className="text-[#0a0a0a]/40 text-[10px] sm:text-xs font-mono mt-1 sm:mt-2 tracking-wide">
                $100K Pitch Competition · 5 Finalists
              </p>
            </div>
            <Link
              href="/techfuel"
              className="group inline-flex items-center justify-center gap-2 bg-[#dc2626] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-md font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-[#0a0a0a] hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Meet the Finalists
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Tech Day column */}
          <div className="flex flex-col items-center gap-2 sm:gap-3 sm:pl-8">
            <div className="text-center">
              <p className="text-[#0a0a0a]/50 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Tech Day</p>
              <Editable 
                id="hero.techday.date" 
                as="p" 
                className="text-[#0a0a0a] text-lg sm:text-xl font-semibold leading-tight"
                page="home"
                section="hero"
              >
                April 21
              </Editable>
              <Editable 
                id="hero.techday.venue" 
                as="p" 
                className="text-[#0a0a0a]/60 text-xs sm:text-sm"
                page="home"
                section="hero"
              >
                Boeing Center at Tech Port
              </Editable>
              <p className="text-[#0a0a0a]/40 text-[10px] sm:text-xs font-mono mt-1 sm:mt-2 tracking-wide">
                3 Tracks · 30+ Speakers · Panels &amp; Demos
              </p>
            </div>
            <Link
              href="/techday#schedule"
              className="group inline-flex items-center justify-center gap-2 bg-[#0a0a0a] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-md font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-[#dc2626] hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View Schedule
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Sponsors Bar - Bottom */}
      <motion.div
        className="relative z-20 border-t border-[#0a0a0a]/10 bg-white/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 md:py-5">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <p className="text-[#0a0a0a]/50 text-xs font-mono uppercase tracking-widest whitespace-nowrap shrink-0">Sponsored by</p>
            <div className="overflow-hidden w-60 sm:w-70 md:w-80 shrink-0 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex items-center gap-6 md:gap-8 w-max animate-scroll-sponsors">
                {/* Double the sponsors for seamless loop */}
                {[...apiSponsors, ...apiSponsors].map((sponsor, i) => (
                  <a
                    key={`${sponsor.id}-${i}`}
                    href={sponsor.website || "#"}
                    target={sponsor.website ? "_blank" : undefined}
                    rel={sponsor.website ? "noopener noreferrer" : undefined}
                    className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
                  >
                    <Image
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      width={sponsor.logoSize === "large" ? 140 : 80}
                      height={sponsor.logoSize === "large" ? 56 : 32}
                      className={`w-auto grayscale hover:grayscale-0 transition-all ${
                        sponsor.logoSize === "large" ? "h-10 md:h-14" : "h-6 md:h-8"
                      }`}
                    />
                  </a>
                ))}
              </div>
            </div>
            <Link 
              href="/sponsor" 
              className="inline-flex items-center gap-1 text-[#dc2626] text-xs font-semibold hover:underline underline-offset-2 whitespace-nowrap shrink-0"
            >
              Become a Sponsor
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

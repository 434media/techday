"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useTransform, useSpring } from "motion/react"
import { useEffect, useState } from "react"
import { ArrowRight, Zap } from "lucide-react"

interface Sponsor {
  id: string
  name: string
  logoUrl: string
  website?: string
}

interface SponsorsData {
  platinum: Sponsor[]
  gold: Sponsor[]
  silver: Sponsor[]
  bronze: Sponsor[]
  community: Sponsor[]
}

export function Hero() {
  const [topSponsors, setTopSponsors] = useState<Sponsor[]>([])
  
  // Fetch top-tier sponsors for hero banner
  useEffect(() => {
    async function fetchSponsors() {
      try {
        const response = await fetch("/api/content/sponsors")
        const data = await response.json()
        const sponsorsData: SponsorsData = data.sponsors || { platinum: [], gold: [], silver: [], bronze: [], community: [] }
        // Show platinum sponsors in hero (flatten from object structure)
        const platinumSponsors = sponsorsData.platinum || []
        setTopSponsors(platinumSponsors)
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
          backgroundImage: "url('https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg')",
        }}
      />

      {/* Floating Blimp */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <motion.div
          className="absolute"
          initial={{ x: "100vw", y: "5%" }}
          animate={{
            x: "-100%",
            y: ["5%", "8%", "3%", "6%", "5%"],
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
            src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/TechBlocBlimp.png"
            alt="Tech Bloc Blimp"
            width={300}
            height={150}
            className="w-36 md:w-48 lg:w-56 h-auto mt-16 md:mt-20"
            style={{
              filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))",
            }}
            draggable={false}
          />
        </motion.div>
      </div>
      
      {/* Main Content - Centered */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-16 pb-8">
        
        {/* Headlines */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Headline - Bebas Neue with color sweep effect */}
          <motion.h1 
            className="mt-4 md:mt-6 font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none text-center uppercase"
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
        <motion.p
          className="mt-3 md:mt-4 text-[#0a0a0a]/70 text-base sm:text-lg md:text-xl font-medium tracking-wide text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-[#dc2626] font-semibold">Hecho en San Antonio</span>
        </motion.p>

        {/* Date & Location - Compact */}
        <motion.div
          className="mt-6 md:mt-8 flex items-center gap-6 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="text-center">
            <p className="text-[#0a0a0a]/50 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Tech Fuel</p>
            <p className="text-[#0a0a0a] text-lg sm:text-xl font-semibold leading-tight">April 9</p>
            <p className="text-[#0a0a0a]/60 text-xs sm:text-sm">Stable Hall</p>
          </div>
          
          <div className="w-px h-12 bg-[#0a0a0a]/15" />
          
          <div className="text-center">
            <p className="text-[#0a0a0a]/50 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Tech Day</p>
            <p className="text-[#0a0a0a] text-lg sm:text-xl font-semibold leading-tight">April 10</p>
            <p className="text-[#0a0a0a]/60 text-xs sm:text-sm">Tech Port</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-2 bg-[#dc2626] text-white px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-[#0a0a0a] hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Register Now
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          
          <Link
            href="/sponsor"
            className="group inline-flex items-center justify-center gap-2 bg-[#0a0a0a] text-white px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-[#dc2626] hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Submit a Pitch
            <Zap className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>

      {/* Sponsors Bar - Bottom */}
      <motion.div
        className="relative z-20 border-t border-[#0a0a0a]/10 bg-white/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <p className="text-[#0a0a0a]/50 text-xs font-mono uppercase tracking-widest">Sponsored by</p>
            <div className="flex items-center gap-6 md:gap-8">
              {topSponsors.length > 0 ? (
                topSponsors.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.website || "#"}
                    target={sponsor.website ? "_blank" : undefined}
                    rel={sponsor.website ? "noopener noreferrer" : undefined}
                    className="opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <Image
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      width={80}
                      height={32}
                      className="h-6 md:h-8 w-auto grayscale hover:grayscale-0 transition-all"
                    />
                  </a>
                ))
              ) : (
                <span className="text-[#0a0a0a]/30 text-sm">Sponsors coming soon</span>
              )}
            </div>
            <Link 
              href="/sponsor" 
              className="inline-flex items-center gap-1 text-[#dc2626] text-xs font-semibold hover:underline underline-offset-2"
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

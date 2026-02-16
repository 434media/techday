"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useMotionValue, useTransform, useSpring } from "motion/react"
import { useEffect, useState } from "react"
import { ArrowRight, Zap } from "lucide-react"
import { Editable } from "@/components/editable"

interface Sponsor {
  id: string
  name: string
  logoUrl: string
  website?: string
}

export function Hero() {
  const [apiSponsors, setApiSponsors] = useState<Sponsor[]>([])
  
  // Fetch sponsors from CMS (e.g. Port SA)
  useEffect(() => {
    async function fetchSponsors() {
      try {
        const response = await fetch("/api/content/sponsors?event=techday")
        const data = await response.json()
        const sponsorsData = data.sponsors || { sponsors: [], community: [] }
        setApiSponsors(sponsorsData.sponsors || [])
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
        <motion.div
          className="mt-3 md:mt-4 text-[#0a0a0a]/70 text-base sm:text-lg md:text-xl font-medium tracking-wide text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Editable 
            id="hero.tagline" 
            as="span" 
            className="text-[#dc2626] font-semibold"
            page="home"
            section="hero"
          >
            Hecho en San Antonio
          </Editable>
        </motion.div>

        {/* Date & Location - Compact */}
        <motion.div
          className="mt-6 md:mt-8 flex items-center gap-6 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
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
          </div>
          
          <div className="w-px h-12 bg-[#0a0a0a]/15" />
          
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
              Tech Port
            </Editable>
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
            href="/techfuel#submit"
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
              {/* H-E-B */}
              <a
                href="https://www.heb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 536.28 186.25" aria-hidden="true" className="h-6 md:h-8 w-auto">
                  <g fill="currentColor">
                    <path d="M417.02 104.41h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48m1.02-31.16h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m12.03 8.11c0-5.61-4.18-8.11-12.03-8.11h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98m-13.05 23.05h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48M443.16 0H93.13C41.7 0 0 41.69 0 93.12s41.7 93.13 93.13 93.13h350.03c51.43 0 93.12-41.7 93.12-93.13S494.59 0 443.16 0m0 174.19H93.12c-44.76 0-81.05-36.28-81.05-81.05s36.29-81.05 81.05-81.05h350.04c44.76 0 81.05 36.29 81.05 81.05s-36.29 81.05-81.05 81.05m1.78-150.08-353.63.02c-37.07 0-67.2 30.95-67.17 69.07 0 37.93 30.16 68.88 67.17 68.88l353.63-.07c37.1-.03 67.15-30.89 67.2-68.85-.05-38.2-30.1-69.05-67.2-69.05m-279.8 108.13h-32.67v-27.82h-23.86v27.82H75.93l-4.65-78.29h37.33v35.39h23.86V53.95h37.32zm40.56-27.82h-22.04l-.89-15.08h23.82zm110.11-31.18H256.9v16.1h44.81v15.08H256.9v14.83h56.18l-.76 12.99h-88.1l-4.65-78.29h97.39zm36.77 31.17h-22.04l-.89-15.08h23.82zm108.97 9.03s1.59 18.8-26.4 18.8H371.1l-4.66-78.29h73.29c14.23 0 25.31 8.58 25.28 22.4 0 12.08-6.58 17.85-16.48 20.67 7.69 1.81 13.02 8.46 13.02 16.42m-43.51-40.19h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m-1.02 31.16h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48" />
                    <path d="M417.02 104.41h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48m1.02-31.16h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m12.03 8.11c0-5.61-4.18-8.11-12.03-8.11h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98m-13.05 23.05h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48m27.92-80.3-353.63.02c-37.07 0-67.2 30.95-67.17 69.07 0 37.93 30.16 68.88 67.17 68.88l353.63-.07c37.1-.03 67.15-30.89 67.2-68.85-.05-38.2-30.1-69.05-67.2-69.05m-279.8 108.13h-32.67v-27.82h-23.86v27.82H75.93l-4.65-78.29h37.33v35.39h23.86V53.95h37.32zm40.56-27.82h-22.04l-.89-15.08h23.82zm110.11-31.18H256.9v16.1h44.81v15.08H256.9v14.83h56.18l-.76 12.99h-88.1l-4.65-78.29h97.39zm36.77 31.17h-22.04l-.89-15.08h23.82zm108.97 9.03s1.59 18.8-26.4 18.8H371.1l-4.66-78.29h73.29c14.23 0 25.31 8.58 25.28 22.4 0 12.08-6.58 17.85-16.48 20.67 7.69 1.81 13.02 8.46 13.02 16.42m-43.51-40.19h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m-1.02 31.16h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48" />
                    <path d="M417.02 104.41h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48m1.02-31.16h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m12.03 8.11c0-5.61-4.18-8.11-12.03-8.11h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98m-13.05 23.05h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48m27.92-80.3-353.63.02c-37.07 0-67.2 30.95-67.17 69.07 0 37.93 30.16 68.88 67.17 68.88l353.63-.07c37.1-.03 67.15-30.89 67.2-68.85-.05-38.2-30.1-69.05-67.2-69.05m-279.8 108.13h-32.67v-27.82h-23.86v27.82H75.93l-4.65-78.29h37.33v35.39h23.86V53.95h37.32zm40.56-27.82h-22.04l-.89-15.08h23.82zm110.11-31.18H256.9v16.1h44.81v15.08H256.9v14.83h56.18l-.76 12.99h-88.1l-4.65-78.29h97.39zm36.77 31.17h-22.04l-.89-15.08h23.82zm108.97 9.03s1.59 18.8-26.4 18.8H371.1l-4.66-78.29h73.29c14.23 0 25.31 8.58 25.28 22.4 0 12.08-6.58 17.85-16.48 20.67 7.69 1.81 13.02 8.46 13.02 16.42m-43.51-40.19h-14.25v16.09h14.77c7.72 0 11.51-2.62 11.51-7.98s-4.18-8.11-12.03-8.11m-1.02 31.16h-13.23v14.84h13.71c7.11 0 10.61-2.42 10.61-7.36s-3.86-7.48-11.09-7.48" />
                  </g>
                  <path fill="currentColor" d="M530.34 172.78c0-2.46-1.46-3.54-4.4-3.54h-4.74v12.44h1.88v-5.39h2.17l3.28 5.39h2.11l-3.54-5.48c1.83-.23 3.23-1.2 3.23-3.42Zm-7.25 1.91v-3.86h2.57c1.31 0 2.71.29 2.71 1.83 0 1.92-1.43 2.03-3.03 2.03h-2.26Z" />
                  <path fill="currentColor" d="M525.37 164.67c-5.93 0-10.96 4.57-10.96 10.76s5.02 10.81 10.96 10.81 10.9-4.57 10.9-10.81-5.02-10.76-10.9-10.76m0 19.78c-4.93 0-8.79-3.83-8.79-9.02s3.85-8.96 8.79-8.96 8.73 3.85 8.73 8.96-3.85 9.02-8.73 9.02" />
                </svg>
              </a>
              {/* IRYS */}
              <a
                href="https://www.irystechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 138 138" fill="none" aria-hidden="true" className="h-6 md:h-8 w-auto">
                  <path d="M82.0345 64.7158L133.021 43.3023L132.056 41.0429L86.8004 60.0436L122.449 25.127L113.76 16.3859L83.7724 45.7574L99.5044 7.24267L90.3349 3.54941L73.4888 44.7838L73.7873 0.411719L65.1243 0.353516L64.7991 49.5406L45.538 4.35896L38.6982 7.2268L58.6844 54.1069L22.7423 17.9574L18.3389 22.275L57.3623 61.5199L5.99212 40.8524L4.13691 45.4029L57.6502 66.9381L0.0266553 66.5571L0 70.2398L58.3858 70.6261L55.9655 72.9912L4.97922 94.4048L5.94414 96.6641L51.1996 77.6634L15.5507 112.58L24.2404 121.321L54.2276 91.9496L38.4956 130.464L47.6651 134.158L64.5112 92.9232L64.2127 137.295L72.8704 137.354L73.2009 88.1664L92.462 133.353L99.2965 130.48L79.3156 83.6001L115.258 119.75L119.661 115.437L80.6377 76.1871L132.003 96.8546L133.863 92.3041L80.3498 70.7689L137.973 71.1499L138 67.4672L79.6142 67.081L82.0345 64.7158Z" fill="currentColor" />
                </svg>
              </a>
              {/* CMS Sponsors (e.g. Port SA) */}
              {apiSponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || "#"}
                  target={sponsor.website ? "_blank" : undefined}
                  rel={sponsor.website ? "noopener noreferrer" : undefined}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={80}
                    height={32}
                    className="h-6 md:h-8 w-auto grayscale hover:grayscale-0 transition-all"
                  />
                </a>
              ))}
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

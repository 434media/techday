"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { EasterEggArrow, MadeInSAEasterEgg } from "@/components/easter-eggs"
import { EventTicket } from "@/components/ticket-badge"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowpixels.png')",
        }}
      />
      {/* Light overlay with subtle diagonal stripe pattern */}
      <div className="absolute inset-0 bg-white/85" />
      <div className="absolute inset-0 diagonal-stripe opacity-50" />

      {/* Easter Egg Arrow - Top Right - Opens Video */}
      <div className="absolute top-20 right-4 md:right-8 lg:right-12 z-20">
        <EasterEggArrow type="video" />
      </div>

      {/* Easter Egg Made in SA - Bottom Left - Links to Anniversary */}
      <div className="absolute bottom-8 left-4 md:left-8 lg:left-12 z-20">
        <MadeInSAEasterEgg type="anniversary" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Date Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-8"
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="font-mono text-sm text-primary font-semibold tracking-wide">April 2026 • San Antonio, TX</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95]"
        >
          <span className="text-foreground">TECH DAY</span>
          <br />
          <span className="text-primary">2026</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground mb-4 leading-snug"
        >
          <span className="text-primary">&quot;Invented Here&quot;</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg text-muted-foreground font-mono mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Celebrating San Antonio&apos;s legacy of tech innovation.
          <br />
          <span className="text-primary font-semibold">Hecho en San Antonio</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/register"
            className="px-8 py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-md hover:bg-primary/90 transition-all"
          >
            Register Now
          </Link>
          <Link
            href="/techfuel"
            className="px-8 py-4 bg-transparent border-2 border-secondary text-secondary font-semibold text-lg rounded-md hover:bg-secondary hover:text-white transition-all"
          >
            Submit Your Pitch
          </Link>
        </motion.div>

        {/* Floating Ticket Preview - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="hidden lg:block mt-16"
        >
          <div className="relative">
            {/* Shadow/glow effect */}
            <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full transform scale-150" />
            <EventTicket className="relative mx-auto transform hover:scale-[1.02] transition-transform duration-300" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

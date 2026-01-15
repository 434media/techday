"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

// Scroll indicator arrow component
function ScrollArrow() {
  return (
    <motion.div
      className="absolute top-4 right-4 md:top-8 md:right-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <motion.img
        src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg"
        alt="Scroll down"
        className="w-8 h-8 md:w-10 md:h-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

// Interactive badge component
function EventBadge({
  title,
  subtitle,
  date,
  href,
  delay = 0,
  variant = "primary",
}: {
  title: string
  subtitle: string
  date: string
  href: string
  delay?: number
  variant?: "primary" | "secondary"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={href} className="block group">
        <motion.div
          className={`relative p-6 md:p-8 rounded-2xl cursor-pointer overflow-hidden ${
            variant === "primary"
              ? "bg-black text-white"
              : "bg-white text-black border-2 border-black"
          }`}
          whileHover={{
            scale: 1.02,
            rotateY: 5,
            rotateX: 5,
          }}
          whileTap={{ scale: 0.98 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: variant === "primary"
                ? "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)"
                : "linear-gradient(105deg, transparent 40%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 55%, transparent 60%)",
            }}
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />

          {/* Badge content */}
          <div className="relative z-10">
            <motion.div
              className={`text-xs md:text-sm font-medium uppercase tracking-wider mb-2 ${
                variant === "primary" ? "text-red-400" : "text-red-600"
              }`}
            >
              {subtitle}
            </motion.div>
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 font-mono">
              {title}
            </h3>
            <div className={`text-sm md:text-base ${
              variant === "primary" ? "text-white/70" : "text-black/60"
            }`}>
              {date}
            </div>
          </div>

          {/* Arrow indicator */}
          <motion.div
            className={`absolute bottom-4 right-4 md:bottom-6 md:right-6 ${
              variant === "primary" ? "text-white/50" : "text-black/40"
            }`}
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            <svg
              className="w-6 h-6 md:w-8 md:h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

// Sponsor logos component
function SponsorSection() {
  const sponsors = [
    { name: "Sponsor 1", logo: "" },
    { name: "Sponsor 2", logo: "" },
    { name: "Sponsor 3", logo: "" },
    { name: "Sponsor 4", logo: "" },
  ]

  return (
    <motion.section
      className="relative py-16 md:py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <ScrollArrow />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 font-mono">
            Our Sponsors
          </h2>
          <p className="text-lg text-black/60 max-w-2xl mx-auto">
            Thank you to our amazing sponsors who make Tech Day and Tech Fuel possible.
          </p>
        </motion.div>

        {/* Placeholder sponsor logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="aspect-[3/2] bg-black/5 rounded-xl flex items-center justify-center border border-black/10 hover:border-red-600/30 transition-colors"
            >
              <span className="text-black/30 font-medium">Logo</span>
            </motion.div>
          ))}
        </div>

        {/* Become a sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/sponsor">
            <motion.button
              className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Become a Sponsor
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}

export function ConferenceHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <Image
            src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowpixels.png"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white" />
        </motion.div>

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-20"
          style={{ opacity }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              December 2025 • San Antonio, TX
            </motion.div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 font-mono leading-tight">
              San Antonio&apos;s Premier
              <span className="block text-red-600">Tech Conference</span>
            </h1>
            <p className="text-lg md:text-xl text-black/60 max-w-3xl mx-auto leading-relaxed">
              Join us for two incredible events celebrating innovation, community, and the future of technology in San Antonio.
            </p>
          </motion.div>

          {/* Event Badges */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <EventBadge
              title="Tech Day"
              subtitle="Conference"
              date="December 6, 2025"
              href="/techday"
              delay={0.5}
              variant="primary"
            />
            <EventBadge
              title="Tech Fuel"
              subtitle="Networking"
              date="December 5, 2025"
              href="/techfuel"
              delay={0.7}
              variant="secondary"
            />
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="inline-flex flex-col items-center text-black/40"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm mb-2">Scroll to explore</span>
              <img
                src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg"
                alt=""
                className="w-6 h-6 opacity-50"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Sponsors Section */}
      <SponsorSection />
    </div>
  )
}

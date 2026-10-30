"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

const TECHDAY_IMAGE =
  "https://storage.googleapis.com/c434-techday.firebasestorage.app/techday/techday.jpeg"
const TECHFUEL_IMAGE =
  "https://storage.googleapis.com/c434-techday.firebasestorage.app/techday/freyya.jpeg"

export function Hero() {
  return (
    <section className="relative min-h-dvh flex flex-col overflow-hidden bg-white">
      {/* Split hero — two clickable images */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2">
        {/* Tech Day */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative h-[50vh] md:h-auto"
        >
          <Link
            href="/techday"
            aria-label="Tech Day 2026 recap"
            className="group absolute inset-0 block overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
          >
            <Image
              src={TECHDAY_IMAGE}
              alt="Tech Day 2026"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover transition-transform duration-1200 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/40 transition-opacity duration-500 group-hover:opacity-80" />
            <div className="absolute inset-0 bg-linear-to-r from-black/45 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/15" />

            <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 md:p-12">
              <p className="font-mono text-[10px] sm:text-xs text-white/80 tracking-[0.25em] uppercase mb-2 transition-transform duration-500 group-hover:-translate-y-0.5">
                April 21, 2026
              </p>
              <h2 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] uppercase tracking-tight">
                Tech Day
              </h2>
              <span className="mt-4 inline-flex items-center gap-1.5 text-white text-sm font-semibold tracking-wide">
                <span className="border-b border-transparent group-hover:border-white transition-colors">
                  View recap
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Tech Fuel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="relative h-[50vh] md:h-auto"
        >
          <Link
            href="/techfuel"
            aria-label="Tech Fuel 2026 recap"
            className="group absolute inset-0 block overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
          >
            <Image
              src={TECHFUEL_IMAGE}
              alt="Tech Fuel 2026 — Freyya"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover transition-transform duration-1200 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/40 transition-opacity duration-500 group-hover:opacity-80" />
            <div className="absolute inset-0 bg-linear-to-l from-black/45 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/15" />

            <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 md:p-12 md:text-right md:items-end">
              <p className="font-mono text-[10px] sm:text-xs text-white/80 tracking-[0.25em] uppercase mb-2 transition-transform duration-500 group-hover:-translate-y-0.5">
                April 20, 2026 · Winner: Freyya
              </p>
              <h2 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] uppercase tracking-tight">
                Tech Fuel
              </h2>
              <span className="mt-4 inline-flex items-center gap-1.5 text-white text-sm font-semibold tracking-wide">
                <span className="border-b border-transparent group-hover:border-white transition-colors">
                  View recap
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "motion/react"
import Image from "next/image"

interface TicketBadgeProps {
  name?: string
  role?: string
  type?: "attendee" | "speaker" | "sponsor" | "vip"
  showBarcode?: boolean
  className?: string
}

export function TicketBadge({
  name = "Your Name",
  role = "Attendee",
  type = "attendee",
  showBarcode = true,
  className = "",
}: TicketBadgeProps) {
  const typeColors = {
    attendee: "from-primary to-primary/80",
    speaker: "from-secondary to-secondary/80",
    sponsor: "from-chart-5 to-chart-5/80",
    vip: "from-chart-4 to-chart-4/80",
  }

  const typeLabels = {
    attendee: "ATTENDEE",
    speaker: "SPEAKER",
    sponsor: "SPONSOR",
    vip: "VIP ACCESS",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative ${className}`}
    >
      {/* Lanyard hole */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <div className="w-8 h-4 bg-muted rounded-b-full border-2 border-t-0 border-border flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-background border-2 border-border" />
        </div>
      </div>

      {/* Lanyard strings */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-8 overflow-hidden">
        <div className="absolute left-0 top-0 w-1 h-full bg-primary/60 rotate-20 origin-bottom" />
        <div className="absolute right-0 top-0 w-1 h-full bg-primary/60 -rotate-20 origin-bottom" />
      </div>

      {/* Badge container */}
      <div className="relative bg-white rounded-lg overflow-hidden shadow-xl border-2 border-border min-w-70">
        {/* Top colored band with type */}
        <div className={`bg-linear-to-r ${typeColors[type]} px-4 py-2 text-white`}>
          <div className="flex items-center justify-between">
            <Image
              src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
              alt="Tech Day"
              width={60}
              height={24}
              className="brightness-0 invert"
            />
            <span className="font-mono text-xs font-bold tracking-wider">{typeLabels[type]}</span>
          </div>
        </div>

        {/* Main content area */}
        <div className="p-6 text-center">
          {/* Name */}
          <h3 className="text-2xl font-bold text-foreground mb-1">{name}</h3>
          <p className="text-muted-foreground font-medium">{role}</p>

          {/* Perforated divider */}
          <div className="my-4 border-t-2 border-dashed border-border relative">
            <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full border-2 border-border" />
            <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full border-2 border-border" />
          </div>

          {/* Event info */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-mono font-semibold text-primary">TECH DAY 2026</p>
            <p>April 14, 2026 • San Antonio, TX</p>
          </div>

          {/* Barcode */}
          {showBarcode && (
            <div className="mt-4">
              <div className="flex justify-center gap-0.5 h-10">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-foreground"
                    style={{
                      width: Math.random() > 0.5 ? "3px" : "1px",
                      height: "100%",
                    }}
                  />
                ))}
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-1 tracking-[0.3em]">
                TD2026-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface EventTicketProps {
  className?: string
  variant?: "horizontal" | "vertical"
}

export function EventTicket({ className = "", variant = "horizontal" }: EventTicketProps) {
  if (variant === "vertical") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`relative ${className}`}
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-border max-w-xs">
          {/* Ticket stub perforation */}
          <div className="absolute top-24 left-0 right-0 flex items-center justify-between">
            <div className="w-4 h-8 bg-background rounded-r-full -ml-0.5" />
            <div className="flex-1 border-t-2 border-dashed border-border" />
            <div className="w-4 h-8 bg-background rounded-l-full -mr-0.5" />
          </div>

          {/* Header section */}
          <div className="bg-primary p-6 text-primary-foreground relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)`
              }} />
            </div>
            <div className="relative">
              <p className="font-mono text-xs tracking-wider opacity-80">ADMIT ONE</p>
              <h2 className="text-3xl font-bold mt-2">TECH DAY</h2>
              <p className="text-5xl font-black">2026</p>
            </div>
          </div>

          {/* Details section */}
          <div className="p-6 pt-10 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider">DATE</p>
                <p className="font-bold text-foreground">APR 14, 2026</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider">TIME</p>
                <p className="font-bold text-foreground">9:00 AM</p>
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider">VENUE</p>
              <p className="font-bold text-foreground">San Antonio Convention Center</p>
              <p className="text-sm text-muted-foreground">San Antonio, Texas</p>
            </div>

            {/* QR Code placeholder */}
            <div className="flex justify-center pt-2">
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 ${Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="font-mono text-[10px] text-center text-muted-foreground tracking-wider">
              SCAN FOR ENTRY
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative ${className}`}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-border flex max-w-2xl">
        {/* Left section - Main ticket */}
        <div className="flex-1 p-8 relative">
          {/* Diagonal pattern overlay */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(-45deg, var(--primary), var(--primary) 2px, transparent 2px, transparent 8px)`
            }} />
          </div>

          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-mono text-xs text-primary tracking-wider font-semibold">TECH BLOC PRESENTS</p>
                <h2 className="text-4xl font-black text-foreground mt-1">TECH DAY</h2>
                <p className="text-6xl font-black text-primary -mt-2">2026</p>
              </div>
              <Image
                src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
                alt="Tech Day 10 Years"
                width={80}
                height={80}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider">DATE</p>
                <p className="font-bold text-foreground">APRIL 14, 2026</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider">TIME</p>
                <p className="font-bold text-foreground">9:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted-foreground tracking-wider">TYPE</p>
                <p className="font-bold text-primary">GENERAL ADMISSION</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider">VENUE</p>
              <p className="font-bold text-foreground">San Antonio Convention Center</p>
            </div>
          </div>
        </div>

        {/* Perforated divider */}
        <div className="relative w-0 border-r-2 border-dashed border-border">
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-4 bg-background rounded-b-full" />
          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-4 bg-background rounded-t-full" />
        </div>

        {/* Right section - Stub */}
        <div className="w-36 bg-muted/50 p-4 flex flex-col items-center justify-center">
          {/* QR Code placeholder - deterministic pattern */}
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm">
            <div className="grid grid-cols-4 gap-0.5">
              {[1,1,0,1, 0,1,1,0, 1,0,0,1, 1,1,0,1].map((filled, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 ${filled ? "bg-foreground" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
          <p className="font-mono text-[8px] text-muted-foreground tracking-wider text-center">SCAN FOR ENTRY</p>
          
          {/* Ticket number */}
          <div className="mt-4 transform -rotate-90 origin-center whitespace-nowrap">
            <p className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
              #TD2026-001
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

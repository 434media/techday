"use client"

import { motion } from "motion/react"

export interface Speaker {
  id: string
  name: string
  role: string
  company: string
  image: string
  track: "emerging" | "founders"
  bio?: string
  social?: {
    twitter?: string
    linkedin?: string
  }
}

interface SpeakerCardProps {
  speaker: Speaker
  index: number
}

export function SpeakerCard({ speaker, index }: SpeakerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Lanyard connector */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="w-10 h-5 bg-muted rounded-b-xl border-2 border-t-0 border-border flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-background border-2 border-border" />
        </div>
      </div>
      
      {/* Lanyard strings (visible on hover) */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-12 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute left-2 top-0 w-1 h-full bg-primary/40 rotate-[15deg] origin-bottom" />
        <div className="absolute right-2 top-0 w-1 h-full bg-primary/40 -rotate-[15deg] origin-bottom" />
      </div>

      <div className="bg-white border-2 border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
        {/* Track indicator band */}
        <div
          className={`px-4 py-2 flex items-center justify-between ${
            speaker.track === "emerging"
              ? "bg-gradient-to-r from-primary to-primary/80"
              : "bg-gradient-to-r from-foreground to-foreground/80"
          }`}
        >
          <span className="text-[10px] font-mono font-bold tracking-wider text-white/80 uppercase">
            {speaker.track === "emerging" ? "Emerging Industries" : "Founders & Investors"}
          </span>
          <span className="text-[10px] font-mono font-bold tracking-wider text-white/80">SPEAKER</span>
        </div>

        {/* Image with circular crop */}
        <div className="p-6 pb-4 flex justify-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-border shadow-md">
            <img
              src={speaker.image || "/placeholder.svg"}
              alt={speaker.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 text-center">
          <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors leading-snug">
            {speaker.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-1">{speaker.role}</p>
          <p className="text-sm text-primary font-mono font-semibold">{speaker.company}</p>

          {/* Perforated divider */}
          <div className="my-4 border-t-2 border-dashed border-border relative">
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full border-2 border-border" />
            <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full border-2 border-border" />
          </div>

          {/* Badge ID */}
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
            TECHDAY-{speaker.id.toString().padStart(3, "0")}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

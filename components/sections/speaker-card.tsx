"use client"

import { motion } from "motion/react"

export interface Speaker {
  id: string
  name: string
  role: string
  company: string
  image: string
  track: "emerging" | "founders" | "ai"
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
      <div className="bg-white border-2 border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
        {/* Track indicator band */}
        <div
          className={`px-4 py-2 flex items-center justify-between ${
            speaker.track === "ai"
              ? "bg-linear-to-r from-chart-4 to-primary"
              : speaker.track === "emerging"
              ? "bg-linear-to-r from-primary to-primary/80"
              : "bg-linear-to-r from-foreground to-foreground/80"
          }`}
        >
          <span className="text-[10px] font-mono font-bold tracking-wider text-white/80 uppercase">
            {speaker.track === "ai" ? "AI & Machine Learning" : speaker.track === "emerging" ? "Emerging Industries" : "Founders & Investors"}
          </span>
          <span className="text-[10px] font-mono font-bold tracking-wider text-white/80">SPEAKER</span>
        </div>

        {/* Image with circular crop */}
        <div className="p-6 pb-4 flex justify-center">
          <div className="relative overflow-hidden shadow-md">
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
        </div>
      </div>
    </motion.div>
  )
}

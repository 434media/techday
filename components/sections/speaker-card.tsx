"use client"

import { motion } from "motion/react"

export interface Speaker {
  id: string
  name: string
  title: string
  company: string
  imageUrl: string
  track: "emerging" | "founders" | "ai"
  bio?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

interface SpeakerCardProps {
  speaker: Speaker
  index: number
}

export function SpeakerCard({ speaker, index }: SpeakerCardProps) {
  const hasSocialLinks = speaker.socialLinks?.twitter || speaker.socialLinks?.linkedin || speaker.socialLinks?.website

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

        {/* Image */}
        <div className="p-6 pb-4 flex justify-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md">
            <img
              src={speaker.imageUrl || "/placeholder.svg"}
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
          <p className="text-sm text-muted-foreground mb-1">{speaker.title}</p>
          <p className="text-sm text-primary font-mono font-semibold mb-3">{speaker.company}</p>
          
          {/* Bio */}
          {speaker.bio && (
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-3">
              {speaker.bio}
            </p>
          )}

          {/* Social Links - appear on hover */}
          {hasSocialLinks && (
            <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {speaker.socialLinks?.twitter && (
                <a
                  href={speaker.socialLinks.twitter.startsWith("http") ? speaker.socialLinks.twitter : `https://twitter.com/${speaker.socialLinks.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                  aria-label={`${speaker.name}'s Twitter`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {speaker.socialLinks?.linkedin && (
                <a
                  href={speaker.socialLinks.linkedin.startsWith("http") ? speaker.socialLinks.linkedin : `https://linkedin.com/in/${speaker.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                  aria-label={`${speaker.name}'s LinkedIn`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {speaker.socialLinks?.website && (
                <a
                  href={speaker.socialLinks.website.startsWith("http") ? speaker.socialLinks.website : `https://${speaker.socialLinks.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-colors"
                  aria-label={`${speaker.name}'s Website`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

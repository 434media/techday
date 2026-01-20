"use client"

import { motion } from "motion/react"

export interface Speaker {
  id: string
  name: string
  title: string
  company: string
  companyUrl?: string
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
      className="p-1 lg:flex lg:flex-col lg:gap-4 group h-full"
    >
      {/* Track indicator band */}
      {/* <div
        className={`px-3 py-1.5 flex items-center justify-between ${
          speaker.track === "ai"
            ? "bg-linear-to-r from-chart-4 to-primary"
            : speaker.track === "emerging"
            ? "bg-linear-to-r from-primary to-primary/80"
            : "bg-linear-to-r from-foreground to-foreground/80"
        }`}
      >
        <span className="text-[10px] font-mono font-bold tracking-wider text-white/90 uppercase">
          {speaker.track === "ai" ? "AI" : speaker.track === "emerging" ? "Emerging Industries" : "Founders & Investors"}
        </span>
      </div> */}

      {/* Image container */}
      <div className="relative bg-background overflow-hidden">
        <img
          src={speaker.imageUrl || "/placeholder.svg"}
          alt={speaker.name}
          className="w-full object-cover aspect-4/5 grayscale"
        />
        
        {/* Social links overlay - appears on hover */}
        {hasSocialLinks && (
          <div className="absolute bottom-0 left-0 lg:p-2 lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-300">
            <div className="absolute -left-4 -bottom-4 top-0 right-0 opacity-50 blur-lg bg-muted" />
            <nav className="relative flex gap-1">
              {speaker.socialLinks?.twitter && (
                <a
                  href={speaker.socialLinks.twitter.startsWith("http") ? speaker.socialLinks.twitter : `https://twitter.com/${speaker.socialLinks.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2.5 rounded-md bg-transparent text-foreground hover:bg-muted transition-colors"
                  aria-label={`${speaker.name}'s Twitter`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0.5H5.75L9.48421 5.71053L14 0.5H16L10.3895 6.97368L16.5 15.5H11.25L7.51579 10.2895L3 15.5H1L6.61053 9.02632L0.5 0.5ZM12.0204 14L3.42043 2H4.97957L13.5796 14H12.0204Z" />
                  </svg>
                </a>
              )}
              {speaker.socialLinks?.linkedin && (
                <a
                  href={speaker.socialLinks.linkedin.startsWith("http") ? speaker.socialLinks.linkedin : `https://linkedin.com/in/${speaker.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2.5 rounded-md bg-transparent text-foreground hover:bg-muted transition-colors"
                  aria-label={`${speaker.name}'s LinkedIn`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2 0C0.895431 0 0 0.895431 0 2V14C0 15.1046 0.895431 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.895431 15.1046 0 14 0H2ZM5 6.75V13H3V6.75H5ZM5 4.50008C5 5.05554 4.61409 5.5 3.99408 5.5H3.98249C3.38582 5.5 3 5.05554 3 4.50008C3 3.93213 3.39765 3.5 4.00584 3.5C4.61409 3.5 4.98845 3.93213 5 4.50008ZM8.5 13H6.5C6.5 13 6.53178 7.43224 6.50007 6.75H8.5V7.78371C8.5 7.78371 9 6.75 10.5 6.75C12 6.75 13 7.59782 13 9.83107V13H11V10.1103C11 10.1103 11 8.46616 9.7361 8.46616C8.4722 8.46616 8.5 9.93972 8.5 9.93972V13Z" />
                  </svg>
                </a>
              )}
              {speaker.socialLinks?.website && (
                <a
                  href={speaker.socialLinks.website.startsWith("http") ? speaker.socialLinks.website : `https://${speaker.socialLinks.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2.5 rounded-md bg-transparent text-foreground hover:bg-muted transition-colors"
                  aria-label={`${speaker.name}'s Website`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                </a>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Content header */}
      <header className="max-lg:p-1 lg:flex lg:flex-col lg:gap-1">
        <p className="font-mono text-white text-base lg:text-lg uppercase font-semibold leading-normal">
          {speaker.name}
        </p>
        <p className="font-mono text-white/70 text-sm lg:text-base uppercase leading-normal">
          {speaker.title}
          {speaker.company && (
            <>
              ,{" "}
              {speaker.companyUrl ? (
                <a
                  href={speaker.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase no-underline hover:opacity-70 transition-opacity"
                >
                  {speaker.company}
                </a>
              ) : (
                <span>{speaker.company}</span>
              )}
            </>
          )}
        </p>
      </header>
    </motion.div>
  )
}

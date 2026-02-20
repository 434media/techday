"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export interface Speaker {
  id: string
  name: string
  title: string
  company: string
  companyUrl?: string
  imageUrl: string
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
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="lg:flex lg:flex-col lg:gap-4 group h-full cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsModalOpen(true) }}
      >
        {/* Image container */}
        <div className="relative bg-background overflow-hidden">
          <img
            src={speaker.imageUrl || "/placeholder.svg"}
            alt={speaker.name}
            className="w-full object-cover aspect-4/5 grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          
          {/* Bio preview overlay - appears on hover */}
          {speaker.bio && (
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4 pointer-events-none">
              <p className="text-white/85 text-[11px] md:text-xs leading-[1.55] font-normal line-clamp-4 mb-2">
                {speaker.bio}
              </p>
              <span className="text-primary text-[10px] md:text-[11px] font-mono font-semibold uppercase tracking-widest">
                Read more →
              </span>
            </div>
          )}
        </div>

        {/* Content header */}
        <header className="max-lg:p-1 lg:flex lg:flex-col lg:gap-0.5">
          <p className="font-mono text-white text-sm lg:text-base uppercase font-bold leading-[1.15] tracking-tight">
            {speaker.name}
          </p>
          <p className="font-mono text-white/50 text-xs lg:text-[13px] uppercase leading-[1.35] font-medium">
            {speaker.title}
            {speaker.company && (
              <>
                ,{" "}
                <span>{speaker.company}</span>
              </>
            )}
          </p>
        </header>
      </motion.div>

      {/* Full Speaker Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <SpeakerModal speaker={speaker} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

function SpeakerModal({ speaker, onClose }: { speaker: Speaker; onClose: () => void }) {
  const hasSocialLinks = speaker.socialLinks?.twitter || speaker.socialLinks?.linkedin || speaker.socialLinks?.website

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative bg-foreground border border-white/10 w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 text-white/50 hover:text-white bg-black/40 hover:bg-black/60 transition-colors rounded-md"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Speaker image */}
        <div className="relative">
          <img
            src={speaker.imageUrl || "/placeholder.svg"}
            alt={speaker.name}
            className="w-full object-cover aspect-16/10"
          />
          <div className="absolute inset-0 bg-linear-to-t from-foreground via-transparent to-transparent" />
        </div>

        {/* Speaker info */}
        <div className="px-5 pb-6 -mt-12 relative">
          <div className="mb-4">
            <h3 className="font-mono text-white text-xl md:text-2xl uppercase font-bold leading-[1.1] tracking-tight mb-1">
              {speaker.name}
            </h3>
            <p className="font-mono text-primary text-sm md:text-[15px] uppercase leading-[1.3] font-semibold">
              {speaker.title}
            </p>
            {speaker.company && (
              <p className="font-mono text-white/45 text-xs md:text-sm uppercase leading-[1.3] font-medium mt-0.5">
                {speaker.companyUrl ? (
                  <a
                    href={speaker.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/70 transition-colors"
                  >
                    {speaker.company} ↗
                  </a>
                ) : (
                  speaker.company
                )}
              </p>
            )}
          </div>

          {/* Bio */}
          {speaker.bio && (
            <div className="mb-5">
              <p className="text-white/65 text-[13px] md:text-sm leading-[1.7] font-normal">
                {speaker.bio}
              </p>
            </div>
          )}

          {/* Social links */}
          {hasSocialLinks && (
            <div className="flex items-center gap-1 pt-4 border-t border-white/8">
              {speaker.socialLinks?.twitter && (
                <a
                  href={speaker.socialLinks.twitter.startsWith("http") ? speaker.socialLinks.twitter : `https://twitter.com/${speaker.socialLinks.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
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
                  className="inline-flex items-center justify-center p-2.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
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
                  className="inline-flex items-center justify-center p-2.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
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
      </motion.div>
    </motion.div>
  )
}

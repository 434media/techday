"use client"

import { useState, useRef } from "react"
import { motion } from "motion/react"
import { Volume2, VolumeX } from "lucide-react"

export function AnniversaryHero() {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden p-4 md:p-6">
      <div className="md:max-w-5xl md:mx-auto relative z-10 w-full h-full flex items-center justify-center">
        {/* Aspect ratio container */}
        <div className="relative w-full max-h-full overflow-hidden rounded-lg shadow-2xl aspect-[4/5] md:aspect-video">
          <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
            <source
              src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc-anniversary.mov"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Dark Overlay for Better Contrast */}
          <div className="absolute inset-0 bg-black/10" />

          <motion.button
            onClick={toggleAudio}
            className="absolute bottom-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-red)] text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-[var(--brand-red)]/90 md:h-14 md:w-14"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            <motion.div
              key={isMuted ? "muted" : "unmuted"}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {isMuted ? <VolumeX className="h-5 w-5 md:h-6 md:w-6" /> : <Volume2 className="h-5 w-5 md:h-6 md:w-6" />}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </section>
  )
}

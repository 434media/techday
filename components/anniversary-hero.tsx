"use client"

import { useState, useRef } from "react"
import { motion } from "motion/react"
import { Volume2, VolumeX } from "lucide-react"
import { AnimatedButton } from "./ui/animated-button"

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
    <section
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-4 md:p-6"
      aria-label="San Antonio Tech Bloc 10th Anniversary Video"
    >
      <div className="md:max-w-5xl md:mx-auto relative z-10 w-full h-full flex items-center justify-center">
        {/* Aspect ratio container */}
        <div className="relative w-full max-h-full overflow-hidden rounded-lg shadow-2xl aspect-[4/5] md:aspect-video">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/tb-poster.webp"
            title="San Antonio Tech Bloc 10th Anniversary Celebration Video"
            aria-label="Anniversary celebration video showcasing 10 years of San Antonio Tech Bloc"
          >
            <source
              src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc-anniversary.mov"
              type="video/mp4"
            />
            <p>
              Your browser does not support the video tag. Please visit our social media channels to watch the 10th
              anniversary celebration video.
            </p>
          </video>

          {/* Dark Overlay for Better Contrast */}
          <div className="absolute inset-0 bg-black/10" />

          <motion.div
            className="absolute bottom-4 right-4 z-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <AnimatedButton
              onClick={toggleAudio}
              className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg backdrop-blur-sm !p-0"
              ariaLabel={isMuted ? "Unmute video" : "Mute video"}
            >
              <motion.div
                key={isMuted ? "muted" : "unmuted"}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <Volume2 className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </motion.div>
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

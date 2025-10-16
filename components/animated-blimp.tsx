"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Volume2, VolumeX } from "lucide-react"

export function AnimatedBlimp() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const handleBlimpClick = () => {
    console.log("[v0] Blimp clicked, opening video")
    setIsVideoOpen(true)
  }

  const closeVideo = () => {
    console.log("[v0] Closing video")
    setIsVideoOpen(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  useEffect(() => {
    console.log("[v0] Video open state:", isVideoOpen)
  }, [isVideoOpen])

  return (
    <>
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
          initial={{ x: "120vw" }}
          animate={{
            x: "-120%",
            y: [0, -15, 0, -10, 0],
          }}
          transition={{
            x: {
              duration: 45,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            y: {
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={handleBlimpClick}
          style={{
            filter: "blur(0px)",
          }}
        >
          <motion.div
            className="relative"
            animate={{
              filter: ["blur(12px)", "blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)", "blur(12px)"],
            }}
            transition={{
              duration: 45,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              times: [0, 0.05, 0.15, 0.85, 0.95, 1],
            }}
          >
            {/* Blimp shadow */}
            <motion.div
              className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-black/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.35, 0.2],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Blimp image */}
            <motion.img
              src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/TechBlocBlimp.png"
              alt="Tech Bloc Blimp - Click to watch anniversary video"
              className="w-[300px] md:w-[400px] lg:w-[500px] h-auto drop-shadow-2xl select-none"
              style={{
                filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))",
              }}
              whileHover={{
                filter: "drop-shadow(0 25px 50px rgba(239, 68, 68, 0.4))",
              }}
              draggable={false}
            />

            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl opacity-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)",
              }}
              whileHover={{
                opacity: 0.7,
                scale: 1.3,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideo}
          >
            <motion.div
              className="relative w-full max-w-4xl"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeVideo}
                className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors z-10"
                aria-label="Close video"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Video container */}
              <div className="relative w-full overflow-hidden rounded-lg shadow-2xl aspect-video bg-black">
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
                  <p>Your browser does not support the video tag.</p>
                </video>

                {/* Mute/Unmute button */}
                <motion.button
                  onClick={toggleAudio}
                  className="absolute bottom-4 right-4 z-20 h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  <motion.div
                    key={isMuted ? "muted" : "unmuted"}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    ) : (
                      <Volume2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    )}
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

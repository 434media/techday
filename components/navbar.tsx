"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { X, Volume2, VolumeX } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }
  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 bg-transparent">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-center px-4 md:px-8 lg:px-12 mt-2 lg:mt-4">
          <motion.button
            onClick={() => setIsDropdownOpen(true)}
            className="flex items-center transition-opacity cursor-pointer"
            style={{
              filter: "drop-shadow(0 0 20px rgba(220, 38, 38, 0.6))",
            }}
            whileHover={{
              scale: 1.05,
              filter: "drop-shadow(0 0 30px rgba(220, 38, 38, 0.9))",
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="View 10 Years of Tech Bloc"
          >
            <Image
              src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
              alt="Tech Bloc 10 Years"
              width={200}
              height={60}
              className="h-auto w-28 md:w-32 lg:w-36"
              priority
            />
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDropdownOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 -translate-x-1/2 top-24 z-50 w-[85vw] max-w-sm"
              style={{
                aspectRatio: "4/5",
                transformOrigin: "top center",
              }}
            >
              <div className="rounded-lg bg-white shadow-2xl h-full flex flex-col overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Video Section - 2/5 of height */}
                <div className="h-[40%] overflow-hidden flex-shrink-0 relative bg-black">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    title="San Antonio Tech Bloc 10th Anniversary Celebration Video"
                    aria-label="Anniversary celebration video showcasing 10 years of San Antonio Tech Bloc"
                    poster="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/tb-poster.webp"
                  >
                    <source
                      src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc-anniversary.mov"
                      type="video/mp4"
                    />
                    <p>
                      Your browser does not support the video tag. Please visit our social media channels to watch the
                      10th anniversary celebration video.
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
                      className="h-8 w-8 md:h-10 md:w-10 rounded-full shadow-lg backdrop-blur-sm !p-0"
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

                {/* Content Section - 3/5 of height */}
                <div className="h-[60%] p-6 flex flex-col">
                  <h2 className="mb-3 font-mono text-xl font-bold text-red-600 md:text-2xl flex-shrink-0">
                    Celebrating 10 Years of Tech Bloc!
                  </h2>

                  <p className="text-sm leading-relaxed text-gray-700 flex-1 overflow-y-auto">
                    For a decade, Tech Bloc has been the heart of San Antonio's tech community, fostering innovation,
                    collaboration, and growth.{" "}
                    <span className="block mt-2">
                      Join us in December as we celebrate 10 years of building the future together.
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

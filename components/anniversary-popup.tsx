"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRightIcon, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AnniversaryPopup() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(true)
  }

  return (
    <>
      {/* Floating Cube Button */}
      <motion.button
        onClick={handleClick}
        className="fixed left-39 top-28 md:left-36 md:top-6 lg:top-10 z-40 overflow-visible transition-transform cursor-pointer"
        style={{
          filter: "drop-shadow(0 0 20px rgba(220, 38, 38, 0.6))",
        }}
        whileHover={{
          scale: 1.1,
          filter: "drop-shadow(0 0 30px rgba(220, 38, 38, 0.9))",
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Celebrate 10 years of Tech Bloc"
      >
        <Image
          src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
          alt="10 Years Tech Bloc"
          width={80}
          height={80}
          className="h-32 w-28 md:h-24 md:w-24 lg:h-28 lg:w-28"
        />
      </motion.button>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Popup Box - Updated to 4:5 aspect ratio and centered on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -100, y: -100 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -100, y: -100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-8 md:top-32 md:translate-x-0 md:translate-y-0 z-50 w-[85vw] max-w-sm"
              style={{ aspectRatio: "4/5" }}
            >
              <div className="rounded-lg bg-white shadow-2xl h-full flex flex-col overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Image Section - 2/5 of height */}
                <div className="h-[40%] overflow-hidden flex-shrink-0">
                  <Image
                    src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/guber.png"
                    alt="Tech Bloc Anniversary"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Content Section - 3/5 of height */}
                <div className="h-[60%] p-6 flex flex-col">
                  <h2 className="mb-3 font-mono text-xl font-bold text-red-600 md:text-2xl flex-shrink-0">
                    10 Years of Tech Bloc!
                  </h2>

                  <p className="mb-4 text-sm leading-relaxed text-gray-700 flex-1 overflow-y-auto">
                    For a decade, Tech Bloc has been the heart of San Antonio's tech community, fostering innovation,
                    collaboration, and growth. Join us as we celebrate 10 years of building the future together.
                  </p>

                  <Link
                    href="/anniversary"
                    className="cursor-pointer flex w-full items-center justify-center rounded-md bg-red-600 px-6 py-3 font-mono text-sm font-semibold text-white transition-colors hover:bg-red-700 flex-shrink-0"
                  >
                    Don't Be A Goober <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

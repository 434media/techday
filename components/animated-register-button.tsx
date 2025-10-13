"use client"

import { motion } from "motion/react"
import { ArrowRightCircle } from "lucide-react"

export function AnimatedRegisterButton() {
  return (
    <motion.a href="https://luma.com/j9czqpyv" className="block" target="_blank" rel="noopener noreferrer">
      <motion.button
        className="relative overflow-hidden bg-red-700 text-white font-semibold uppercase tracking-wide
                   w-[50vw] md:w-[30vw] max-w-xl md:max-w-sm md:-mt-6 lg:-mt-10 md:mb-2 lg:mb-4 aspect-[40/10] rounded-sm
                   hover:bg-red-700 transition-colors duration-300 cursor-pointer
                   focus-visible:outline-offset-4 focus-visible:outline-2 focus-visible:outline-red-600"
        whileHover="hover"
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated squares that slide in from left on hover */}
        <motion.div
          className="absolute top-0 left-0 h-full w-full pointer-events-none"
          variants={{
            hover: {
              x: 0,
              transition: {
                duration: 0.6,
                ease: "easeOut",
              },
            },
          }}
          initial={{ x: "-100%" }}
        >
          <div className="h-full w-full flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full bg-black"
                style={{ width: "5%" }}
                variants={{
                  hover: {
                    opacity: [0, 1, 1, 0],
                    transition: {
                      duration: 0.6,
                      delay: i * 0.02,
                      ease: "easeOut",
                    },
                  },
                }}
                initial={{ opacity: 0 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center h-full w-full text-[clamp(1rem,3vw,2rem)]">
          Register Now <ArrowRightCircle className="ml-3 h-6 w-6" />
        </span>
      </motion.button>
    </motion.a>
  )
}

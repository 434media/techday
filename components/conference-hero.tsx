"use client"

import { WebGLBackground } from "./webgl-background"
import { AnimatedBlimp } from "./animated-blimp"

export function ConferenceHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <WebGLBackground />

      <AnimatedBlimp />

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 md:gap-8 px-4 py-24 md:py-28 pointer-events-none">
        <div className="w-full max-w-5xl text-center space-y-6">
          <img
            src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/guber.png"
            alt="San Antonio Tech Day 2025"
            className="w-full max-w-3xl mx-auto h-auto grayscale drop-shadow-2xl rounded-lg"
            draggable={false}
          />
          <p className="text-white/90 text-lg md:text-xl lg:text-2xl font-light tracking-wide text-balance">
            Click the blimp to watch our 10th anniversary celebration
          </p>
        </div>
      </div>
    </section>
  )
}

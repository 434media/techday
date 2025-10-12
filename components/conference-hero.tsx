"use client"

import { WebGLBackground } from "./webgl-background"

export function ConferenceHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <WebGLBackground />

      {/* Content Container */}
      <div className="relative z-10 flex h-full items-center justify-center">
        {/* Logo Container - Centered */}
        <div className="w-full max-w-5xl">
          <img
            src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/LockUp_Red.svg"
            alt="Tech Day 2025 - Friday November 14th at Boeing Center at Tech Port, San Antonio"
            className="h-full w-full drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}

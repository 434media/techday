"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { VideoModal } from "@/components/video-modal"

interface EasterEggArrowProps {
  className?: string
  type: "video" | "anniversary"
  position?: string
}

export function EasterEggArrow({ className = "", type, position = "top-6 right-4 md:right-8 lg:right-12 z-20" }: EasterEggArrowProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (type === "video") {
      setIsVideoOpen(true)
    }
  }

  const arrowContent = (
    <motion.div
      className={`absolute ${position} cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={isHovered ? { y: [0, 8, 0] } : {}}
        transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
      >
        <Image
          src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg"
          alt="Easter egg - click to discover"
          width={180}
          height={180}
          className="w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52 drop-shadow-lg"
        />
      </motion.div>
      
      {/* Hint text on hover */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
        className="text-xs font-mono text-primary/70 text-center mt-2 whitespace-nowrap"
      >
        {type === "video" ? "🎬 Watch our story" : "🎉 10 Years!"}
      </motion.p>
    </motion.div>
  )

  if (type === "anniversary") {
    return (
      <Link href="/anniversary">
        {arrowContent}
      </Link>
    )
  }

  return (
    <>
      <div onClick={handleClick}>
        {arrowContent}
      </div>
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoSrc="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc-anniversary.mov"
      />
    </>
  )
}

interface MadeInSAEasterEggProps {
  className?: string
  type: "video" | "anniversary"
}

export function MadeInSAEasterEgg({ className = "", type }: MadeInSAEasterEggProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (type === "video") {
      setIsVideoOpen(true)
    }
  }

  const content = (
    <motion.div
      className={`cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, rotate: -3 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={isHovered ? { 
          y: [0, -5, 0],
          rotate: [0, 2, -2, 0]
        } : {}}
        transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
      >
        <Image
          src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/MadeinSA.svg"
          alt="Made in San Antonio - click to discover"
          width={160}
          height={160}
          className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 drop-shadow-lg"
        />
      </motion.div>
      
      {/* Hint text on hover */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
        className="text-xs font-mono text-primary/70 text-center mt-2 whitespace-nowrap"
      >
        {type === "video" ? "🎬 Watch our story" : "🎉 10 Years!"}
      </motion.p>
    </motion.div>
  )

  if (type === "anniversary") {
    return (
      <Link href="/anniversary">
        {content}
      </Link>
    )
  }

  return (
    <>
      <div onClick={handleClick}>
        {content}
      </div>
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoSrc="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc-anniversary.mov"
      />
    </>
  )
}

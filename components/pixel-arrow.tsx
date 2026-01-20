"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { VideoModal } from "@/components/video-modal"

interface PixelArrowProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  size?: "md" | "lg" | "xl"
  variant?: "light" | "dark"
  type?: "video" | "anniversary" | "static"
  className?: string
}

export function PixelArrow({
  position = "top-right",
  size = "xl",
  variant = "light",
  type = "static",
  className = "",
}: PixelArrowProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const positionClasses = {
    "top-left": "top-4 left-4 md:top-8 md:left-8 lg:top-12 lg:left-12",
    "top-right": "top-4 right-4 md:top-8 md:right-8 lg:top-12 lg:right-12",
    "bottom-left": "bottom-4 left-4 md:bottom-8 md:left-8 lg:bottom-12 lg:left-12",
    "bottom-right": "bottom-4 right-4 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12",
  }

  const sizeClasses = {
    md: "w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40",
    lg: "w-32 h-32 md:w-44 md:h-44 lg:w-56 lg:h-56",
    xl: "w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72",
  }

  const opacityClasses = {
    light: "opacity-10",
    dark: "opacity-15",
  }

  const handleClick = () => {
    if (type === "video") {
      setIsVideoOpen(true)
    }
  }

  const arrowImage = (
    <Image
      src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg"
      alt=""
      width={288}
      height={288}
      className={`${sizeClasses[size]} ${opacityClasses[variant]} pointer-events-none select-none`}
      aria-hidden="true"
    />
  )

  const containerClasses = `absolute ${positionClasses[position]} z-10 ${className}`

  if (type === "anniversary") {
    return (
      <Link href="/anniversary" className={containerClasses}>
        <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
          {arrowImage}
        </div>
      </Link>
    )
  }

  if (type === "video") {
    return (
      <>
        <div onClick={handleClick} className={containerClasses}>
          <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
            {arrowImage}
          </div>
        </div>
        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoSrc="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc-anniversary.mov"
        />
      </>
    )
  }

  return (
    <div className={containerClasses}>
      {arrowImage}
    </div>
  )
}

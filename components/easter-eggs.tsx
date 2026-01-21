"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { VideoModal } from "@/components/video-modal"

interface PixelData {
  x: number
  y: number
  width: number
  height: number
  fill: string
  offsetX: number
  offsetY: number
}

interface EasterEggArrowProps {
  className?: string
  type: "video" | "anniversary"
  position?: string
  interactive?: boolean
}

export function EasterEggArrow({ 
  className = "", 
  type, 
  position = "top-6 right-4 md:right-8 lg:right-12 z-20",
  interactive = true 
}: EasterEggArrowProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [pixels, setPixels] = useState<PixelData[]>([])
  const [svgViewBox, setSvgViewBox] = useState({ width: 100, height: 100 })
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Fetch and parse the SVG to extract pixel data
  useEffect(() => {
    async function fetchSvg() {
      try {
        // Use local proxy to avoid CORS issues
        const response = await fetch("/api/svg", {
          cache: 'force-cache',
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const svgText = await response.text()
        
        // Parse SVG
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml")
        const svgElement = svgDoc.querySelector("svg")
        
        if (svgElement) {
          // Get viewBox dimensions
          const viewBox = svgElement.getAttribute("viewBox")
          if (viewBox) {
            const parts = viewBox.split(" ").map(Number)
            if (parts.length >= 4) {
              setSvgViewBox({ width: parts[2], height: parts[3] })
            }
          }
          
          // Extract all rect elements (pixels)
          const rects = svgElement.querySelectorAll("rect")
          const pixelData: PixelData[] = []
          
          rects.forEach((rect) => {
            const x = parseFloat(rect.getAttribute("x") || "0")
            const y = parseFloat(rect.getAttribute("y") || "0")
            const width = parseFloat(rect.getAttribute("width") || "0")
            const height = parseFloat(rect.getAttribute("height") || "0")
            const fill = rect.getAttribute("fill") || "#dc2626"
            
            if (width > 0 && height > 0) {
              pixelData.push({
                x,
                y,
                width,
                height,
                fill,
                offsetX: 0,
                offsetY: 0,
              })
            }
          })
          
          if (pixelData.length > 0) {
            setPixels(pixelData)
          }
          setIsLoaded(true)
        } else {
          setIsLoaded(true)
        }
      } catch (error) {
        console.warn("SVG fetch failed, using static image:", error)
        setIsLoaded(true)
      }
    }
    
    if (interactive && typeof window !== 'undefined') {
      fetchSvg()
    }
  }, [interactive])

  // Handle mouse movement for pixel dispersion
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !interactive) return
    
    const rect = containerRef.current.getBoundingClientRect()
    // Convert to SVG coordinate space
    const scaleX = svgViewBox.width / rect.width
    const scaleY = svgViewBox.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    setMousePos({ x, y })
  }, [interactive, svgViewBox])

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 })
    setIsHovered(false)
  }, [])

  // Animate pixels based on mouse position
  useEffect(() => {
    if (!interactive || pixels.length === 0) return

    const disperseRadius = 15 // Radius of effect in SVG units
    const maxDisplace = 8 // Maximum displacement in SVG units

    const animate = () => {
      setPixels(prev => prev.map(pixel => {
        const pixelCenterX = pixel.x + pixel.width / 2
        const pixelCenterY = pixel.y + pixel.height / 2
        
        const dx = pixelCenterX - mousePos.x
        const dy = pixelCenterY - mousePos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        let targetOffsetX = 0
        let targetOffsetY = 0
        
        if (distance < disperseRadius && distance > 0) {
          const force = (1 - distance / disperseRadius) * maxDisplace
          const angle = Math.atan2(dy, dx)
          targetOffsetX = Math.cos(angle) * force
          targetOffsetY = Math.sin(angle) * force
        }
        
        const lerp = 0.12
        const newOffsetX = pixel.offsetX + (targetOffsetX - pixel.offsetX) * lerp
        const newOffsetY = pixel.offsetY + (targetOffsetY - pixel.offsetY) * lerp
        
        return {
          ...pixel,
          offsetX: Math.abs(newOffsetX) < 0.05 ? 0 : newOffsetX,
          offsetY: Math.abs(newOffsetY) < 0.05 ? 0 : newOffsetY,
        }
      }))
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePos, interactive, pixels.length])

  const handleClick = () => {
    if (type === "video") {
      setIsVideoOpen(true)
    }
  }

  // Interactive pixel grid from parsed SVG
  const interactiveContent = (
    <motion.div
      ref={containerRef}
      className={`absolute ${position} cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      style={{
        filter: isHovered ? "brightness(1.2)" : "brightness(1)",
        transition: "filter 0.3s ease",
      }}
    >
      <div className="w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52">
        {isLoaded && pixels.length > 0 ? (
          <svg
            viewBox={`0 0 ${svgViewBox.width} ${svgViewBox.height}`}
            className="w-full h-full drop-shadow-lg"
          >
            {pixels.map((pixel, idx) => (
              <rect
                key={idx}
                x={pixel.x + pixel.offsetX}
                y={pixel.y + pixel.offsetY}
                width={pixel.width}
                height={pixel.height}
                fill={pixel.fill}
              />
            ))}
          </svg>
        ) : (
          <Image
            src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg"
            alt="Easter egg - click to discover"
            width={180}
            height={180}
            className="w-full h-full drop-shadow-lg"
          />
        )}
      </div>
      
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

  // Original non-interactive content
  const staticContent = (
    <motion.div
      className={`absolute ${position} cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        filter: isHovered ? "brightness(1.2)" : "brightness(1)",
        transition: "filter 0.3s ease",
      }}
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
      
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
        className="text-xs font-mono text-primary/70 text-center mt-2 whitespace-nowrap"
      >
        {type === "video" ? "🎬 Watch our story" : "🎉 10 Years!"}
      </motion.p>
    </motion.div>
  )

  const arrowContent = interactive ? interactiveContent : staticContent

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

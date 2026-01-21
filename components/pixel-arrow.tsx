"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useCallback, useEffect } from "react"
import { VideoModal } from "@/components/video-modal"

interface PixelArrowProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  size?: "md" | "lg" | "xl"
  variant?: "light" | "dark"
  type?: "video" | "anniversary" | "static"
  className?: string
  interactive?: boolean
}

interface PixelData {
  x: number
  y: number
  width: number
  height: number
  fill: string
  offsetX: number
  offsetY: number
}

const SVG_URL = "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg"
const SVG_PROXY_URL = "/api/svg"

export function PixelArrow({
  position = "top-right",
  size = "xl",
  variant = "light",
  type = "static",
  className = "",
  interactive = true,
}: PixelArrowProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [pixels, setPixels] = useState<PixelData[]>([])
  const [svgViewBox, setSvgViewBox] = useState({ width: 100, height: 100 })
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const positionClasses = {
    "top-left": "top-4 left-4 md:top-8 md:left-8 lg:top-12 lg:left-12",
    "top-right": "-top-4 right-0 md:-top-6 md:right-2 lg:-top-10 lg:right-6",
    "bottom-left": "-bottom-4 left-0 md:-bottom-6 md:left-2 lg:-bottom-10 lg:left-24",
    "bottom-right": "-bottom-4 right-0 md:-bottom-6 md:right-2 lg:-bottom-10 lg:right-2",
  }

  const sizeClasses = {
    md: "w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40",
    lg: "w-32 h-32 md:w-44 md:h-44 lg:w-56 lg:h-56",
    xl: "w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96",
  }

  const opacityValue = variant === "light" ? 0.1 : 0.15

  // Fetch and parse the SVG to extract pixel data
  useEffect(() => {
    async function fetchSvg() {
      try {
        // Use local proxy to avoid CORS issues
        const response = await fetch(SVG_PROXY_URL, {
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
          } else {
            // Fallback to width/height attributes
            const width = parseFloat(svgElement.getAttribute("width") || "100")
            const height = parseFloat(svgElement.getAttribute("height") || "100")
            setSvgViewBox({ width, height })
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
        // CORS or network error - fall back to static image
        console.warn("SVG fetch failed, using static image:", error)
        setIsLoaded(true)
      }
    }
    
    // Only run on client side
    if (typeof window !== 'undefined') {
      fetchSvg()
    }
  }, [])

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

    // Calculate disperse radius based on SVG size
    const avgSize = (svgViewBox.width + svgViewBox.height) / 2
    const disperseRadius = avgSize * 0.15 // 15% of SVG size
    const maxDisplace = avgSize * 0.08 // 8% max displacement

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
  }, [mousePos, interactive, pixels.length, svgViewBox])

  const handleClick = () => {
    if (type === "video") {
      setIsVideoOpen(true)
    }
  }

  // Interactive pixel grid from parsed SVG
  const interactiveContent = (
    <div
      ref={containerRef}
      className={`${sizeClasses[size]} relative`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        filter: isHovered ? "brightness(1.3)" : "brightness(1)",
        transition: "filter 0.3s ease",
      }}
    >
      {isLoaded && pixels.length > 0 ? (
        <svg
          viewBox={`0 0 ${svgViewBox.width} ${svgViewBox.height}`}
          className="w-full h-full"
          style={{ opacity: opacityValue }}
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
          src={SVG_URL}
          alt=""
          fill
          className="pointer-events-none select-none"
          style={{ opacity: opacityValue }}
          aria-hidden="true"
        />
      )}
    </div>
  )

  // Fallback static image for non-interactive
  const staticContent = (
    <div
      className={`${sizeClasses[size]} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: isHovered ? "brightness(1.3)" : "brightness(1)",
        transition: "filter 0.3s ease",
      }}
    >
      <Image
        src={SVG_URL}
        alt=""
        fill
        className="pointer-events-none select-none"
        style={{ opacity: opacityValue }}
        aria-hidden="true"
      />
    </div>
  )

  const containerClasses = `absolute ${positionClasses[position]} z-10 ${className}`
  const content = interactive ? interactiveContent : staticContent

  if (type === "anniversary") {
    return (
      <Link href="/anniversary" className={containerClasses}>
        <div className="cursor-pointer">
          {content}
        </div>
      </Link>
    )
  }

  if (type === "video") {
    return (
      <>
        <div onClick={handleClick} className={containerClasses}>
          <div className="cursor-pointer">
            {content}
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
      {content}
    </div>
  )
}

"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import Link from "next/link"
import Image from "next/image"

interface InteractiveLanyardProps {
  className?: string
}

export function InteractiveLanyard({ className = "" }: InteractiveLanyardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Motion values for physics-based animation
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const rotateZ = useMotionValue(0)
  
  // Spring configs for smooth, bouncy animation like a piñata
  const springConfig = { damping: 12, stiffness: 100, mass: 0.8 }
  const springRotateX = useSpring(rotateX, springConfig)
  const springRotateY = useSpring(rotateY, springConfig)
  const springRotateZ = useSpring(rotateZ, { damping: 20, stiffness: 200, mass: 0.5 })
  
  // Track velocity for momentum
  const velocityX = useRef(0)
  const velocityY = useRef(0)
  const lastPosition = useRef({ x: 0, y: 0 })
  const animationFrame = useRef<number>()
  const idleAnimationRef = useRef<number>()
  
  // Determine if card is showing back based on rotation
  const isBackVisible = useTransform(springRotateY, (value) => {
    const normalized = ((value % 360) + 360) % 360
    return normalized > 90 && normalized < 270
  })
  
  // Handle mouse/touch start
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true)
    lastPosition.current = { x: clientX, y: clientY }
    velocityX.current = 0
    velocityY.current = 0
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
    }
    if (idleAnimationRef.current) {
      cancelAnimationFrame(idleAnimationRef.current)
    }
  }, [])
  
  // Handle mouse/touch move
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return
    
    const deltaX = clientX - lastPosition.current.x
    const deltaY = clientY - lastPosition.current.y
    
    // Update velocity for momentum - more responsive
    velocityX.current = deltaX * 0.7
    velocityY.current = deltaY * 0.4
    
    // Update rotation based on drag - feels like swinging a piñata
    rotateY.set(rotateY.get() + deltaX * 1.2)
    rotateX.set(Math.max(-30, Math.min(30, rotateX.get() - deltaY * 0.3)))
    rotateZ.set(Math.max(-15, Math.min(15, deltaX * 0.15)))
    
    lastPosition.current = { x: clientX, y: clientY }
  }, [isDragging, rotateX, rotateY, rotateZ])
  
  // Handle mouse/touch end - apply momentum like a swinging piñata
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    
    // Apply momentum with decay - piñata physics
    const applyMomentum = () => {
      if (Math.abs(velocityX.current) > 0.3 || Math.abs(velocityY.current) > 0.3) {
        rotateY.set(rotateY.get() + velocityX.current)
        rotateX.set(rotateX.get() - velocityY.current * 0.3)
        
        // Natural decay
        velocityX.current *= 0.92
        velocityY.current *= 0.92
        
        animationFrame.current = requestAnimationFrame(applyMomentum)
      } else {
        // Settle to nearest face (front or back) with gentle swing
        const currentY = rotateY.get()
        const normalized = ((currentY % 360) + 360) % 360
        const nearestFlip = normalized > 90 && normalized < 270 ? 180 : 0
        const targetY = Math.floor(currentY / 360) * 360 + nearestFlip
        rotateY.set(targetY)
        rotateX.set(0)
        rotateZ.set(0)
      }
    }
    
    applyMomentum()
  }, [rotateX, rotateY, rotateZ])
  
  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX, e.clientY)
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY)
  }
  
  const handleMouseUp = () => {
    handleDragEnd()
  }
  
  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd()
    }
  }
  
  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleDragStart(touch.clientX, touch.clientY)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleDragMove(touch.clientX, touch.clientY)
  }
  
  const handleTouchEnd = () => {
    handleDragEnd()
  }
  
  // Idle swing animation - gentle piñata sway
  useEffect(() => {
    if (isDragging) return
    
    let time = 0
    const idleAnimation = () => {
      if (!isDragging) {
        time += 0.015
        // Gentle swinging motion like a hanging lanyard
        const swing = Math.sin(time) * 2.5
        const sway = Math.cos(time * 0.5) * 1.5
        rotateZ.set(swing)
        rotateX.set(sway)
      }
      idleAnimationRef.current = requestAnimationFrame(idleAnimation)
    }
    
    const timeout = setTimeout(() => {
      idleAnimation()
    }, 1500)
    
    return () => {
      clearTimeout(timeout)
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
      if (idleAnimationRef.current) {
        cancelAnimationFrame(idleAnimationRef.current)
      }
    }
  }, [isDragging, rotateX, rotateZ])

  return (
    <div 
      ref={containerRef}
      className={`relative w-full max-w-sm mx-auto ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* Lanyard Rope - Red brand color */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-28 w-[85%] h-36 z-20 pointer-events-none">
        <svg viewBox="0 0 200 150" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
          <defs>
            {/* Red gradient matching brand */}
            <linearGradient id="lanyardRedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            {/* Highlight for 3D effect */}
            <linearGradient id="lanyardHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            {/* Shadow for depth */}
            <filter id="lanyardShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.4"/>
            </filter>
            {/* Inner shadow for strap */}
            <filter id="strapInnerShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
              <feOffset in="blur" dx="1" dy="1" result="offsetBlur"/>
              <feComposite in="SourceGraphic" in2="offsetBlur" operator="over"/>
            </filter>
          </defs>
          
          {/* Left strap - curved like real lanyard */}
          <path 
            d="M100 150 C80 130 50 80 30 0" 
            stroke="url(#lanyardHighlight)" 
            strokeWidth="12" 
            fill="none" 
            strokeLinecap="round"
            filter="url(#lanyardShadow)"
          />
          {/* Left strap highlight */}
          <path 
            d="M100 150 C80 130 50 80 30 0" 
            stroke="#fecaca" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round"
            opacity="0.4"
            style={{ transform: "translateX(-2px)" }}
          />
          
          {/* Right strap - curved like real lanyard */}
          <path 
            d="M100 150 C120 130 150 80 170 0" 
            stroke="url(#lanyardHighlight)" 
            strokeWidth="12" 
            fill="none" 
            strokeLinecap="round"
            filter="url(#lanyardShadow)"
          />
          {/* Right strap highlight */}
          <path 
            d="M100 150 C120 130 150 80 170 0" 
            stroke="#fecaca" 
            strokeWidth="3" 
            fill="none" 
            strokeLinecap="round"
            opacity="0.4"
            style={{ transform: "translateX(-2px)" }}
          />
          
          {/* Metal clip base */}
          <ellipse cx="100" cy="142" rx="12" ry="8" fill="#374151"/>
          {/* Metal clip shine */}
          <ellipse cx="98" cy="140" rx="8" ry="5" fill="#6b7280"/>
          <ellipse cx="96" cy="139" rx="4" ry="2" fill="#9ca3af"/>
          {/* Metal clip hook */}
          <path d="M94 148 L94 158 Q94 162 100 162 Q106 162 106 158 L106 148" stroke="#4b5563" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M96 148 L96 156 Q96 159 100 159 Q104 159 104 156 L104 148" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      
      {/* 3D Card Container */}
      <motion.div
        className="relative pt-8 cursor-grab active:cursor-grabbing select-none"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          rotateZ: springRotateZ,
          transformStyle: "preserve-3d",
          transformOrigin: "top center"
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Front of Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)"
          }}
        >
          <div className="relative bg-foreground rounded-3xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden border border-white/5">
            {/* Hole punch area with slot */}
            <div className="flex justify-center pt-2 relative z-20">
              <div className="relative">
                {/* Slot background */}
                <div className="bg-white/10 rounded-full h-6 w-24 shadow-inner border border-white/5" />
                {/* Hole */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 border border-white/10 shadow-inner" />
              </div>
            </div>

            {/* Arrow SVG Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <Image
                src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg"
                alt=""
                fill
                className="object-cover scale-150"
              />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-6">
              {/* Logo */}
              <div className="flex px-2 pt-1">
                <Image
                  src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
                  alt="Tech Day 10 Years"
                  width={64}
                  height={64}
                  className="object-contain drop-shadow-lg"
                />
              </div>

              {/* Main headline */}
              <h1 className="text-white text-[2.75rem] px-2 pt-4 font-bold tracking-[-2.5px] leading-none">
                Tech Day
                <br />
                <span className="text-primary">&</span> Tech Fuel
              </h1>

              {/* Subtitle */}
              <p className="text-white/60 text-xl px-2 pt-3 pb-6 font-semibold tracking-tight leading-snug">
                April 9–10, 2026
              </p>

              {/* CTA Buttons */}
              <div className="w-full space-y-2.5 pointer-events-auto">
                <Link 
                  href="/register"
                  className="flex items-center justify-center gap-2 w-full h-12 bg-white text-foreground font-bold text-sm rounded-2xl hover:bg-white/90 transition-colors shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                  Register for Tech Day
                </Link>

                <div className="flex items-center gap-3 w-full px-2">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="text-xs text-white/50 font-medium">or</span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>

                <Link 
                  href="/techfuel"
                  className="flex items-center justify-center gap-2 w-full h-12 bg-transparent border border-white/30 text-white font-semibold text-sm rounded-2xl hover:bg-white/10 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                    <path d="M12 2v6.5M12 2c-1.5 0-4.5 1.5-5 3.5 2.5 0 3.5 1 3.5 2.5H12M12 2c1.5 0 4.5 1.5 5 3.5-2.5 0-3.5 1-3.5 2.5H12" />
                    <path d="M8.5 8.5c-.828 0-1.5.895-1.5 2s.672 2 1.5 2h7c.828 0 1.5-.895 1.5-2s-.672-2-1.5-2" />
                    <path d="M9 12.5v6.5a3 3 0 003 3v0a3 3 0 003-3v-6.5" />
                  </svg>
                  Submit Your Pitch
                </Link>
              </div>

              {/* Event details */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-white/40 font-mono tracking-wider uppercase mb-1">Tech Day</p>
                    <p className="text-white font-semibold leading-relaxed">April 9th</p>
                    <p className="text-white/60 leading-relaxed">Tech Port</p>
                  </div>
                  <div>
                    <p className="text-white/40 font-mono tracking-wider uppercase mb-1">Tech Fuel</p>
                    <p className="text-white font-semibold leading-relaxed">April 10th</p>
                    <p className="text-white/60 leading-relaxed">Stable Hall</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back of Card */}
        <motion.div 
          className="absolute inset-0 pt-8 w-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className="relative bg-foreground rounded-3xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden border border-white/5 h-full min-h-120">
            {/* Hole punch area with slot - matching front */}
            <div className="flex justify-center pt-2 relative z-20">
              <div className="relative">
                <div className="bg-white/10 rounded-full h-6 w-24 shadow-inner border border-white/5" />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 border border-white/10 shadow-inner" />
              </div>
            </div>

            {/* Pixel Arrow SVG - Featured prominently on back */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg"
                  alt="Tech Day Arrow"
                  fill
                  className="object-contain scale-125"
                />
              </div>
            </div>

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-foreground via-foreground/60 to-transparent" />

            {/* Overlay content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-end p-8 pb-10">
              <div className="text-center">
                <Image
                  src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
                  alt="Tech Day 10 Years"
                  width={80}
                  height={80}
                  className="object-contain mx-auto mb-4"
                />
                <p className="text-white/50 font-mono text-xs tracking-[0.2em] uppercase mb-2">San Antonio, TX</p>
                <h2 className="text-white text-3xl font-bold tracking-tight mb-2">Tech Day 2026</h2>
                <p className="text-primary font-semibold text-lg tracking-tight">&quot;Invented Here&quot;</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Interaction hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center text-muted-foreground text-xs mt-6 font-medium"
      >
        <span className="inline-flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          Drag to swing
        </span>
      </motion.p>
    </div>
  )
}

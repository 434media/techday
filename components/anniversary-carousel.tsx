"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "motion/react"

interface CarouselImage {
  src: string
  aspectRatio: "portrait" | "wide"
}

const anniversaryImages: CarouselImage[] = [
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/guber.png",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc4.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td19.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc5-wide.jpeg",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc29.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc6.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc7.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc32-wide.jpeg",
    aspectRatio: "wide",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td1.jpg",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc8.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc9.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc20-wide.jpeg",
    aspectRatio: "wide",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td15.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc11.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc12.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td10.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td12.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc13.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc14-wide.jpeg",
    aspectRatio: "wide",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td4.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc17.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc18.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td23.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc33-wide.jpeg",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc19.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc21.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td14.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc34.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc28-wide.jpeg",
    aspectRatio: "wide",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td22.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc22.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc23.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td6.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc24.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc25.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc30-wide.jpeg",
    aspectRatio: "wide",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td9.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc26.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc27.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc31-wide.jpeg",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc10.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc16.jpeg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc35-wide.jpeg",
    aspectRatio: "wide",
  },
  {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td3.jpg",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc3-wide.jpeg",
    aspectRatio: "portrait",
  },
]

function ScrollImage({ image, index }: { image: CarouselImage; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Smoother spring with slightly less damping for more fluid feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  // Reduced parallax effect for better mobile performance
  const y = useTransform(smoothProgress, [0, 1], [60, -60])

  // Gentler scale animation
  const scale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.92])

  // Smoother fade in/out
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  // Reduced rotation for subtler effect
  const rotate = useTransform(smoothProgress, [0, 0.5, 1], [index % 2 === 0 ? -2 : 2, 0, index % 2 === 0 ? 2 : -2])

  const isLeft = index % 2 === 0
  const isWide = image.aspectRatio === "wide"

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        scale,
        opacity,
        rotate,
      }}
      className={`relative py-4 md:py-8 flex items-center ${
        isLeft ? "justify-start pl-12 md:pl-20 lg:pl-28" : "justify-end pr-4 md:pr-8 lg:pr-20"
      }`}
    >
      <div
        className={`relative w-full ${
          isWide 
            ? "max-w-2xl md:max-w-3xl lg:max-w-4xl" 
            : "max-w-70 sm:max-w-xs md:max-w-sm lg:max-w-md"
        }`}
      >
        <div className={`relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl border-2 md:border-4 border-black/5 ${
          !isWide ? "max-h-[55vh] md:max-h-[65vh]" : ""
        }`}>
          <Image
            src={image.src || "/placeholder.svg"}
            alt="Tech Bloc anniversary memory"
            width={isWide ? 1920 : 800}
            height={isWide ? 1080 : 1000}
            className={`w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700 ${
              !isWide ? "max-h-[55vh] md:max-h-[65vh] object-top" : ""
            }`}
            loading="lazy"
          />
        </div>
      </div>
    </motion.div>
  )
}

export function AnniversaryCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div ref={containerRef} className="relative w-full z-10">
      {/* Progress bar - thinner on mobile, positioned closer to edge */}
      <motion.div
        className="fixed left-1.5 md:left-8 top-20 bottom-6 w-0.5 md:w-1 bg-black/10 rounded-full z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.div
          style={{ height: progressHeight }}
          className="w-full bg-primary rounded-full shadow-lg shadow-primary/30"
        />
      </motion.div>

      {/* Hero Section */}
      <div className="min-h-dvh flex items-center justify-center px-4 pl-6 md:pl-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.p
            className="font-mono text-sm text-primary mb-6 tracking-widest uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            2015 — 2025
          </motion.p>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[0.95] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Reflecting on 10 Years of{" "}
            <span className="text-primary">Tech Bloc</span> Memories
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            A decade of innovation, community, and growth in San Antonio&apos;s tech scene 
            captured through unforgettable moments.
          </motion.p>
        </motion.div>
      </div>

      {/* Image Gallery */}
      <div className="relative space-y-4 md:space-y-8">
        {anniversaryImages.map((image, index) => (
          <ScrollImage key={index} image={image} index={index} />
        ))}
      </div>

      {/* Closing Section */}
      <div className="min-h-dvh flex items-center justify-center px-4 pl-6 md:pl-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: false, amount: 0.4 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.p
            className="font-mono text-sm text-primary mb-6 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: false }}
          >
            April 9–10, 2026
          </motion.p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-[0.95] tracking-tight">
            Thank you for being part of San Antonio&apos;s{" "}
            <span className="text-primary">Tech Revolution</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join us at Tech Port and Stable Hall as we celebrate 10 years of building the future together.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

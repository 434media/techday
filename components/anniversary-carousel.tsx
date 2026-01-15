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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const y = useTransform(smoothProgress, [0, 1], [100, -100])

  const scale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.8, 1.05, 1.05, 0.8])

  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const rotate = useTransform(smoothProgress, [0, 0.5, 1], [index % 2 === 0 ? -5 : 5, 0, index % 2 === 0 ? 5 : -5])

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
      className={`relative py-6 md:py-10 flex items-center ${
        isLeft ? "justify-start pl-16 md:pl-24 lg:pl-32" : "justify-end pr-4 md:pr-12 lg:pr-24"
      }`}
    >
      <div
        className={`relative w-full ${
          isWide 
            ? "max-w-3xl md:max-w-4xl lg:max-w-5xl" 
            : "max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        }`}
      >
        <div className={`relative overflow-hidden rounded-2xl shadow-2xl border-4 border-black/10 ${
          !isWide ? "max-h-[60vh] md:max-h-[70vh]" : ""
        }`}>
          <Image
            src={image.src || "/placeholder.svg"}
            alt="Tech Bloc anniversary memory"
            width={isWide ? 1920 : 800}
            height={isWide ? 1080 : 1000}
            className={`w-full h-auto object-cover grayscale ${
              !isWide ? "max-h-[60vh] md:max-h-[70vh] object-top" : ""
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
      <motion.div
        className="fixed left-2 md:left-12 top-24 bottom-8 w-1 bg-black/10 rounded-full z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          style={{ height: progressHeight }}
          className="w-full bg-red-600 rounded-full shadow-lg shadow-red-600/50"
        />
      </motion.div>

      <div className="min-h-screen flex items-center justify-center px-4 pl-4 md:pl-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] as const }}
          className="max-w-7xl mx-auto text-center"
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-black mb-6 font-mono leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            What is <span className="block md:inline">Tech Bloc?</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-black/70 font-light max-w-3xl mx-auto leading-relaxed tracking-tighter md:tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            For a decade, Tech Bloc has been the heart of San Antonio's tech community, fostering innovation,
            collaboration, and growth.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 text-black/50 text-sm md:text-base"
          >
            Scroll to explore our journey
          </motion.div>
        </motion.div>
      </div>

      <div className="relative space-y-8 md:space-y-12">
        {anniversaryImages.map((image, index) => (
          <ScrollImage key={index} image={image} index={index} />
        ))}
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 pl-4 md:pl-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 font-mono leading-tight">
            Thank you for being part of San Antonio's <span className="text-red-600">tech revolution</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-black/70 font-light max-w-3xl mx-auto leading-relaxed tracking-tight">
            Join us in December as we celebrate 10 years of building the future together!
          </p>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "../ui/Button"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { VideoModal } from "./video-modal"

const images = [
  {
    id: 1,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday2024.svg",
    alt: "Tech Day 2024 Banner",
    width: 1200,
    height: 800,
    type: "banner",
    videoUrl: "https://storage.googleapis.com/groovy-ego-462522-v2.firebasestorage.app/TechDay2024.mp4",
  },
  {
    id: 2,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td6.jpg",
    alt: "Conference photo 2",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 3,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td2.jpg",
    alt: "Conference photo 3",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 4,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td3.jpg",
    alt: "Conference photo 4",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 5,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td9.jpg",
    alt: "Conference photo 5",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 6,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td10.jpg",
    alt: "Conference photo 6",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 7,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td8.jpg",
    alt: "Conference photo 7",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 8,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td12.jpg",
    alt: "Conference photo 8",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 9,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td13.jpg",
    alt: "Conference photo 9",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 10,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td14.jpg",
    alt: "Conference photo 10",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 11,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td15.jpg",
    alt: "Conference photo 11",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 12,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td16.jpg",
    alt: "Conference photo 12",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 13,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td17.jpg",
    alt: "Conference photo 13",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 14,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td18.jpg",
    alt: "Conference photo 14",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 15,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td19.jpg",
    alt: "Conference photo 15",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 16,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td20.jpg",
    alt: "Conference photo 16",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 17,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td5.jpg",
    alt: "Conference photo 17",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 19,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td22.jpg",
    alt: "Conference photo 19",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 20,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td23.jpg",
    alt: "Conference photo 20",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 21,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td1.jpg",
    alt: "Conference photo 21",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 23,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td11.jpg",
    alt: "Conference photo 23",
    width: 1200,
    height: 800,
    type: "gallery",
  },
  {
    id: 24,
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td4.jpg",
    alt: "Conference photo 24",
    width: 1200,
    height: 800,
    type: "gallery",
  },
    {
    src: "https://devsa-assets.s3.us-east-2.amazonaws.com/techday-pics/td5.jpg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
]


export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<null | typeof images[0]>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const bannerImage = images.find((img) => img.type === "banner")
  const galleryImages = images.filter((img) => img.type !== "banner")

  return (
    <>
 {bannerImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-3xl p-8 -mt-16 md:mt-0"
        >
          <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center">
            <div className="flex flex-col space-y-6 order-2 md:order-1">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-neutral-50 md:text-4xl lg:text-5xl">
                  2024 Tech Day Photos
                </h2>
                <p className="text-lg text-neutral-300 max-w-[40ch]">
                  Our incredible tech community gathered for an amazing day of learning, sharing, and connecting!
                </p>
              </div>
              <Button
                onClick={() => setIsVideoModalOpen(true)}
                variant="secondary"
                className="w-fit"
              >
                <span className="relative top-px">Watch Video</span>
              </Button>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden order-1 md:order-2">
              <img
                src={bannerImage.src || "/placeholder.svg"}
                alt={bannerImage.alt}
                className="h-full w-full object-contain invert"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -right-2 -top-2 z-50 rounded-full bg-gray-900 p-2 text-gray-100 shadow-lg transition-colors hover:bg-gray-800"
                aria-label="Close image"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              <img
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                width={selectedImage.width}
                height={selectedImage.height}
                className="rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={bannerImage?.videoUrl || ""}
      />
    </>
  )
}


"use client"
import Image from "next/image"
import type React from "react"

interface CarouselImage {
  src: string
  alt: string
  aspectRatio: "portrait" | "wide"
}

const anniversaryImages: CarouselImage[] = [
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc1.jpeg",
    alt: "Tech Bloc 2015 - Year 1 attendees and speakers",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc4.jpeg",
    alt: "Tech Bloc 2018 - Year 4 attendees and speakers",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc5-wide.jpeg",
    alt: "Tech Bloc 2019 - Year 5 attendees and speakers",
    aspectRatio: "wide",
  },
    {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc29.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc6.jpeg",
    alt: "Tech Bloc 2020 - Year 6 attendees and speakers",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc7.jpeg",
    alt: "Tech Bloc 2021 - Year 7 attendees and speakers",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc32-wide.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc8.jpeg",
    alt: "Tech Bloc 2022 - Year 8 attendees and speakers",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc9.jpeg",
    alt: "Tech Bloc 2023 - Year 9 attendees and speakers",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc20-wide.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc11.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc12.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc13.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc14-wide.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc15.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc17.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc18.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc33-wide.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc19.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc21.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc34.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc28-wide.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc22.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc23.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc24.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc25.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc30-wide.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc26.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc27.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc31-wide.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc10.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc16.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "portrait",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc35-wide.jpeg",
    alt: "Tech Bloc attendees and speakers from the last 10 years",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc2-wide.jpeg",
    alt: "Tech Bloc 2016 - Year 2 attendees and speakers",
    aspectRatio: "wide",
  },
  {
    src: "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/techbloc3-wide.jpeg",
    alt: "Tech Bloc 2017 - Year 3 attendees and speakers",
    aspectRatio: "portrait",
  },
]

export function AnniversaryCarousel() {
  return (
    <section
      className="relative w-full mb-10 md:mb-0 py-12 md:py-16 lg:py-20"
      data-testid="anniversary-carousel-container"
    >
      <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
        <div className="sr-only">
          <h1>Celebrating 10 Years of Tech Bloc</h1>
          <p>
            A decade of bringing together San Antonio's tech community through innovation, collaboration, and growth.
            From emerging industries to AI breakthroughs, we've been at the forefront of technology.
          </p>
        </div>

        <div className="relative overflow-hidden" style={{ "--marquee-gap": "2rem" } as React.CSSProperties}>
          <div className="flex gap-8 animate-marquee">
            {/* First set of images */}
            {anniversaryImages.map((image, index) => (
              <div key={`first-${index}`} className="flex w-80 shrink-0 flex-col justify-end">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gray-100 rounded-lg"></div>
                  <Image
                    alt={image.alt}
                    loading="lazy"
                    width={image.aspectRatio === "portrait" ? 1067 : 1600}
                    height={image.aspectRatio === "portrait" ? 1600 : 1067}
                    className="w-full grayscale rounded-lg object-cover"
                    src={image.src || "/placeholder.svg"}
                  />
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {anniversaryImages.map((image, index) => (
              <div key={`second-${index}`} className="flex w-80 shrink-0 flex-col justify-end">
                <div className="relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gray-100 rounded-lg"></div>
                  <Image
                    alt={image.alt}
                    loading="lazy"
                    width={image.aspectRatio === "portrait" ? 1067 : 1600}
                    height={image.aspectRatio === "portrait" ? 1600 : 1067}
                    className="w-full grayscale rounded-lg object-cover"
                    src={image.src || "/placeholder.svg"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

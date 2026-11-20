import type React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, JetBrains_Mono, Syne, Bebas_Neue } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { BotIdClient } from "botid/client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Providers } from "@/components/providers"
import "./globals.css"
import { SITE_URL } from "@/lib/site"

const protectedRoutes = [
  { path: "/api/register", method: "POST" },
  { path: "/api/pitch", method: "POST" },
  { path: "/api/pitch/upload", method: "POST" },
  { path: "/api/newsletter", method: "POST" },
  { path: "/api/sponsor-contact", method: "POST" },
  { path: "/api/semifinals-judges", method: "POST" },
  { path: "/api/semifinals-pitches", method: "POST" },
  { path: "/api/ecosystem-tours", method: "POST" },
  { path: "/api/vote", method: "POST" },
]

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
})

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tech Day 2026 | Invented Here - San Antonio",
    template: "%s | Tech Day San Antonio",
  },
  description:
    "Join San Antonio's premier technology conference celebrating innovation, founders, and the tech community. April 20–21, 2026 at Boeing Center at Tech Port.",
  keywords: [
    "Tech Day",
    "Tech Fuel",
    "San Antonio",
    "technology conference",
    "startup pitch competition",
    "Tech Bloc",
    "innovation",
    "founders",
    "investors",
    "AI",
    "Boeing Center",
    "Tech Port",
  ],
  authors: [{ name: "Tech Bloc San Antonio" }],
  creator: "Tech Bloc San Antonio",
  openGraph: {
    title: "Tech Day 2026 | Invented Here",
    description:
      "San Antonio's premier technology conference — Emerging Industries, Founders & Investors, and AI. April 20–21, 2026.",
    type: "website",
    siteName: "Tech Day San Antonio",
    locale: "en_US",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Day 2026 | Invented Here",
    description:
      "San Antonio's premier technology conference — April 20–21, 2026 at Boeing Center at Tech Port.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // No root canonical: it would be inherited by every page that lacks its own
  // and point them all at the homepage. Each indexable page sets its own.
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        name: "Tech Day 2026",
        description:
          "San Antonio's premier technology conference featuring three tracks: Emerging Industries, Founders & Investors, and AI.",
        startDate: "2026-04-21T13:00:00-05:00",
        endDate: "2026-04-21T16:00:00-05:00",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: "Boeing Center at Tech Port",
          address: {
            "@type": "PostalAddress",
            addressLocality: "San Antonio",
            addressRegion: "TX",
            addressCountry: "US",
          },
        },
        organizer: {
          "@type": "Organization",
          name: "Tech Bloc San Antonio",
          url: SITE_URL,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          url: `${SITE_URL}/register`,
          availability: "https://schema.org/InStock",
        },
        image: `${SITE_URL}/opengraph-image`,
        url: `${SITE_URL}/techday`,
        isAccessibleForFree: true,
        subEvent: {
          "@type": "Event",
          name: "Tech Fuel 2026 — $100K Startup Pitch Competition",
          description:
            "San Antonio's flagship $100K startup pitch competition. 8th year, $700K+ invested, 349+ total applicants. 5 finalists compete for the prize pool.",
          startDate: "2026-04-20",
          url: `${SITE_URL}/techfuel`,
        },
      },
      {
        "@type": "Organization",
        name: "Tech Bloc San Antonio",
        url: SITE_URL,
        description:
          "Nonprofit organization building and supporting San Antonio's technology community through events, advocacy, and startup investment since 2015.",
        foundingDate: "2015",
        areaServed: {
          "@type": "City",
          name: "San Antonio",
          containedInPlace: {
            "@type": "State",
            name: "Texas",
          },
        },
      },
      {
        "@type": "WebSite",
        name: "Tech Day San Antonio",
        url: SITE_URL,
        description:
          "Official website for Tech Day, San Antonio's premier technology conference produced by Tech Bloc.",
      },
    ],
  }

  return (
    <html lang="en">
      <head>
        <BotIdClient protect={protectedRoutes} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${syne.variable} ${bebasNeue.variable} font-sans antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

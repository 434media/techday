"use client"

import Image from "next/image"
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <Image
            src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
            alt="Tech Block"
            width={200}
            height={60}
            className="h-auto w-24"
            priority
          />
        </Link>

        {/* Nav Links - Placeholder for future links */}
        <div className="flex items-center gap-6">{/* Links will be added here */}</div>
      </div>
    </nav>
  )
}

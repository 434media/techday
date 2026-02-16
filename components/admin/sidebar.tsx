"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAdminAuth } from "./auth-provider"
import type { AdminPermission } from "@/lib/firebase/collections"

interface NavItem {
  label: string
  href: string
  permission?: AdminPermission
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { 
    label: "Overview", 
    href: "/admin",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    label: "Registrations", 
    href: "/admin/registrations", 
    permission: "registrations",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  { 
    label: "Newsletter", 
    href: "/admin/newsletter", 
    permission: "newsletter",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    label: "Pitches", 
    href: "/admin/pitches", 
    permission: "pitches",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  { 
    label: "Sponsor Inquiries", 
    href: "/admin/sponsor-contacts", 
    permission: "sponsors",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    )
  },
  { 
    label: "Speakers", 
    href: "/admin/speakers", 
    permission: "speakers",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { 
    label: "Schedule", 
    href: "/admin/schedule", 
    permission: "schedule",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    label: "Sponsors", 
    href: "/admin/sponsors", 
    permission: "sponsors",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },

]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAdminAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(item.permission)
  )

  const dataItems = visibleNavItems.slice(0, 5)
  const contentItems = visibleNavItems.slice(5)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-neutral-200 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-black">Admin Panel</h1>
            <p className="text-xs text-neutral-500">{user?.name}</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors rounded-md"
            aria-label="Toggle admin menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 pt-28"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-white border-b border-neutral-200 max-h-[60vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="py-4">
              <div className="px-4 mb-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                  Data
                </p>
              </div>
              {dataItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-black bg-neutral-100"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {contentItems.length > 0 && (
                <>
                  <div className="px-4 mt-4 mb-2">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                      Content
                    </p>
                  </div>
                  {contentItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "text-black bg-neutral-100"
                          : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </>
              )}

              <div className="mt-4 px-4 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full py-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors text-left"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-neutral-200 flex-col sticky left-0 top-16 h-[calc(100vh-4rem)] z-40">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-200">
          <Link href="/admin" className="block">
            <h1 className="text-lg font-semibold tracking-tight text-black">
              Tech Day
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5 uppercase tracking-wider">
              Admin Panel
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="px-3 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              Data
            </p>
          </div>
          <ul className="space-y-0.5 px-3">
            {dataItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    pathname === item.href
                      ? "text-black bg-neutral-100"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {contentItems.length > 0 && (
            <>
              <div className="px-3 mt-8 mb-2">
                <p className="px-3 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                  Content
                </p>
              </div>
              <ul className="space-y-0.5 px-3">
                {contentItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                        pathname === item.href
                          ? "text-black bg-neutral-100"
                          : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-black truncate">
                {user?.name}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="ml-3 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors rounded-md"
            >
              Logout
            </button>
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-wider text-neutral-400">
            {user?.role}
          </p>
        </div>
      </aside>
    </>
  )
}

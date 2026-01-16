"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAdminAuth } from "./auth-provider"
import type { AdminPermission } from "@/lib/admin/config"

interface NavItem {
  label: string
  href: string
  permission?: AdminPermission
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Registrations", href: "/admin/registrations", permission: "registrations" },
  { label: "Newsletter", href: "/admin/newsletter", permission: "newsletter" },
  { label: "Pitches", href: "/admin/pitches", permission: "pitches" },
  { label: "Speakers", href: "/admin/speakers", permission: "speakers" },
  { label: "Schedule", href: "/admin/schedule", permission: "schedule" },
  { label: "Sponsors", href: "/admin/sponsors", permission: "sponsors" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAdminAuth()

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(item.permission)
  )

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen fixed left-0 top-0">
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
          {visibleNavItems.slice(0, 4).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-black bg-neutral-100"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="px-3 mt-8 mb-2">
          <p className="px-3 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
            Content
          </p>
        </div>
        <ul className="space-y-0.5 px-3">
          {visibleNavItems.slice(4).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-black bg-neutral-100"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
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
            className="ml-3 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
          >
            Logout
          </button>
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-wider text-neutral-400">
          {user?.role}
        </p>
      </div>
    </aside>
  )
}

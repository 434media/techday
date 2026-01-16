import type { ReactNode } from "react"
import { AdminLayout } from "@/components/admin/layout"

export const metadata = {
  title: "Admin - Tech Day",
  robots: "noindex, nofollow",
}

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}

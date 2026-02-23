import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { verifyAdminSession, sessionHasPermission } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

// Registration limits per event
const REGISTRATION_LIMITS: Record<string, number> = {
  techfuel: 200,
  techday: 300,
}

// Determine which events a registration covers (handles legacy "2day" entries)
function getEffectiveEvents(events: string[]): { techday: boolean; techfuel: boolean } {
  const has2day = events.includes("2day")
  return {
    techday: has2day || events.includes("techday"),
    techfuel: has2day || events.includes("techfuel"),
  }
}

export async function GET(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("registrations", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ 
      registrations: [], 
      total: 0,
      message: "Firebase not configured" 
    })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const eventFilter = searchParams.get("event") // "techday", "techfuel", "both", "techday-only", "techfuel-only"
    const search = searchParams.get("search")?.toLowerCase()
    const limit = parseInt(searchParams.get("limit") || "1000")

    let query = adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .orderBy("createdAt", "desc")
      .limit(limit)

    if (status) {
      query = query.where("status", "==", status) as typeof query
    }

    if (category) {
      query = query.where("category", "==", category) as typeof query
    }

    const snapshot = await query.get()

    let registrations = snapshot.docs.map((doc) => {
      const data = doc.data()
      const events: string[] = data.events || []
      const effective = getEffectiveEvents(events)

      // Determine event label for display
      let eventLabel = "None"
      if (effective.techday && effective.techfuel) {
        eventLabel = "Both Days"
      } else if (effective.techday) {
        eventLabel = "Tech Day Only"
      } else if (effective.techfuel) {
        eventLabel = "Tech Fuel Only"
      }

      return {
        id: doc.id,
        ...data,
        eventLabel,
        effectiveEvents: effective,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      }
    })

    // Apply event filter
    if (eventFilter) {
      registrations = registrations.filter((reg) => {
        const eff = reg.effectiveEvents as { techday: boolean; techfuel: boolean }
        switch (eventFilter) {
          case "techday":
            return eff.techday
          case "techfuel":
            return eff.techfuel
          case "both":
            return eff.techday && eff.techfuel
          case "techday-only":
            return eff.techday && !eff.techfuel
          case "techfuel-only":
            return eff.techfuel && !eff.techday
          default:
            return true
        }
      })
    }

    // Client-side search filtering (Firestore doesn't support full-text search)
    if (search) {
      registrations = registrations.filter((reg) => {
        const r = reg as Record<string, unknown>
        return (
          (r.firstName as string)?.toLowerCase().includes(search) ||
          (r.lastName as string)?.toLowerCase().includes(search) ||
          (r.email as string)?.toLowerCase().includes(search) ||
          (r.company as string)?.toLowerCase().includes(search) ||
          (r.ticketId as string)?.toLowerCase().includes(search)
        )
      })
    }

    // Compute stats from ALL registrations (before event filter, after status/category filter)
    const allRegs = snapshot.docs.map((doc) => {
      const data = doc.data()
      const events: string[] = data.events || []
      return { ...getEffectiveEvents(events), ecosystemTours: data.ecosystemTours === true }
    })
    // Only count non-cancelled for capacity
    const activeRegs = snapshot.docs
      .filter((doc) => {
        const s = doc.data().status
        return s !== "cancelled"
      })
      .map((doc) => {
        const events: string[] = doc.data().events || []
        return getEffectiveEvents(events)
      })

    const stats = {
      total: allRegs.length,
      techday: allRegs.filter((e) => e.techday).length,
      techfuel: allRegs.filter((e) => e.techfuel).length,
      bothDays: allRegs.filter((e) => e.techday && e.techfuel).length,
      techdayOnly: allRegs.filter((e) => e.techday && !e.techfuel).length,
      techfuelOnly: allRegs.filter((e) => e.techfuel && !e.techday).length,
      ecosystemTours: allRegs.filter((e) => e.ecosystemTours).length,
      limits: REGISTRATION_LIMITS,
      // Active counts (non-cancelled) for capacity tracking
      activeTechday: activeRegs.filter((e) => e.techday).length,
      activeTechfuel: activeRegs.filter((e) => e.techfuel).length,
    }

    return NextResponse.json({
      registrations,
      total: registrations.length,
      stats,
    })
  } catch (error) {
    console.error("Registrations fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("registrations", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 })
    }

    if (id === "all") {
      // Bulk delete all registrations
      const snapshot = await adminDb.collection(COLLECTIONS.REGISTRATIONS).get()
      const batch = adminDb.batch()
      let count = 0

      for (const doc of snapshot.docs) {
        batch.delete(doc.ref)
        count++

        // Firestore batches have a limit of 500 operations
        if (count % 500 === 0) {
          await batch.commit()
        }
      }

      if (count % 500 !== 0) {
        await batch.commit()
      }

      return NextResponse.json({ success: true, message: `Deleted ${count} registrations` })
    }

    // Delete individual registration
    await adminDb.collection(COLLECTIONS.REGISTRATIONS).doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Registration delete error:", error)
    return NextResponse.json({ error: "Failed to delete registration" }, { status: 500 })
  }
}

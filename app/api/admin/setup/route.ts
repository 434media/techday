import { NextResponse } from "next/server"
import { adminDb, adminAuth, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type UserDocument } from "@/lib/firebase/collections"

export const dynamic = "force-dynamic"

// This endpoint is for initial admin setup
// It should only work when there are NO admin users in the system
// After the first admin is created, this endpoint becomes inactive

export async function POST(request: Request) {
  try {
    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Firebase is not configured. Please set up Firebase credentials." },
        { status: 503 }
      )
    }

    const data = await request.json()

    if (!data.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if any admin users already exist
    const existingAdmins = await adminDb
      .collection(COLLECTIONS.USERS)
      .where("role", "==", "admin")
      .limit(1)
      .get()

    if (!existingAdmins.empty) {
      return NextResponse.json(
        { error: "Admin setup has already been completed. Use the admin panel to add more users." },
        { status: 403 }
      )
    }

    // Get the user from Firebase Auth
    let firebaseUser
    try {
      firebaseUser = await adminAuth.getUserByEmail(data.email)
    } catch {
      return NextResponse.json(
        { error: "User must create a Firebase account first" },
        { status: 400 }
      )
    }

    // Create the first admin user
    const adminUser: UserDocument = {
      uid: firebaseUser.uid,
      email: data.email.toLowerCase(),
      displayName: data.displayName || firebaseUser.displayName || "Admin",
      role: "admin",
      permissions: [
        "speakers",
        "schedule",
        "sponsors",
        "registrations",
        "pitches",
        "newsletter",
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await adminDb
      .collection(COLLECTIONS.USERS)
      .doc(firebaseUser.uid)
      .set(adminUser)

    console.log(`First admin user created: ${data.email}`)

    return NextResponse.json({
      success: true,
      message: "First admin user created successfully",
      uid: firebaseUser.uid,
    })
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json(
      { error: "Failed to setup admin user" },
      { status: 500 }
    )
  }
}

// GET - Check if setup is complete
export async function GET() {
  try {
    const existingAdmins = await adminDb
      .collection(COLLECTIONS.USERS)
      .where("role", "==", "admin")
      .limit(1)
      .get()

    return NextResponse.json({
      setupComplete: !existingAdmins.empty,
      adminCount: existingAdmins.size,
    })
  } catch (error) {
    console.error("Setup check error:", error)
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 }
    )
  }
}

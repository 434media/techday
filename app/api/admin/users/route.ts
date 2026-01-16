import { NextResponse } from "next/server"
import { adminDb, adminAuth, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type UserDocument, type UserRole, type Permission } from "@/lib/firebase/collections"

// Middleware helper to verify admin token
async function verifyAdminToken(request: Request): Promise<{ uid: string; email: string } | null> {
  try {
    if (!isFirebaseConfigured()) {
      return null
    }

    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.split("Bearer ")[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    
    // Check if user has admin role in Firestore
    const userDoc = await adminDb
      .collection(COLLECTIONS.USERS)
      .doc(decodedToken.uid)
      .get()

    if (!userDoc.exists) {
      return null
    }

    const userData = userDoc.data() as UserDocument
    if (userData.role !== "admin") {
      return null
    }

    return { uid: decodedToken.uid, email: decodedToken.email || "" }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

// GET - List all admin users
export async function GET(request: Request) {
  const admin = await verifyAdminToken(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const usersSnapshot = await adminDb
      .collection(COLLECTIONS.USERS)
      .orderBy("createdAt", "desc")
      .get()

    const users = usersSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }))

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST - Create or update admin user
export async function POST(request: Request) {
  const admin = await verifyAdminToken(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.email || !data.role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles: UserRole[] = ["admin", "editor", "viewer"]
    if (!validRoles.includes(data.role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be admin, editor, or viewer" },
        { status: 400 }
      )
    }

    // Validate permissions
    const validPermissions: Permission[] = [
      "speakers",
      "schedule",
      "sponsors",
      "registrations",
      "pitches",
      "newsletter",
    ]
    const permissions = data.permissions || []
    for (const perm of permissions) {
      if (!validPermissions.includes(perm)) {
        return NextResponse.json(
          { error: `Invalid permission: ${perm}` },
          { status: 400 }
        )
      }
    }

    // Check if user exists in Firebase Auth
    let firebaseUser
    try {
      firebaseUser = await adminAuth.getUserByEmail(data.email)
    } catch {
      // User doesn't exist in Firebase Auth, we'll create a placeholder
      // They'll need to sign up / be invited separately
      return NextResponse.json(
        { error: "User must sign up first before being granted admin access" },
        { status: 400 }
      )
    }

    // Create or update user document
    const userDoc: UserDocument = {
      uid: firebaseUser.uid,
      email: data.email.toLowerCase(),
      displayName: data.displayName || firebaseUser.displayName || "",
      role: data.role,
      permissions: permissions,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Check if user already exists in our users collection
    const existingUser = await adminDb
      .collection(COLLECTIONS.USERS)
      .doc(firebaseUser.uid)
      .get()

    if (existingUser.exists) {
      // Update existing user (preserve createdAt)
      await adminDb
        .collection(COLLECTIONS.USERS)
        .doc(firebaseUser.uid)
        .update({
          role: data.role,
          permissions: permissions,
          displayName: data.displayName || firebaseUser.displayName || "",
          updatedAt: new Date(),
        })
    } else {
      // Create new user
      await adminDb
        .collection(COLLECTIONS.USERS)
        .doc(firebaseUser.uid)
        .set(userDoc)
    }

    return NextResponse.json({
      success: true,
      message: existingUser.exists ? "User updated" : "User created",
      uid: firebaseUser.uid,
    })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json(
      { error: "Failed to create/update user" },
      { status: 500 }
    )
  }
}

// DELETE - Remove admin user
export async function DELETE(request: Request) {
  const admin = await verifyAdminToken(request)
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Prevent self-deletion
    if (uid === admin.uid) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      )
    }

    // Delete from Firestore (not from Firebase Auth - they can still log in but won't have admin access)
    await adminDb.collection(COLLECTIONS.USERS).doc(uid).delete()

    return NextResponse.json({
      success: true,
      message: "User admin access removed",
    })
  } catch (error) {
    console.error("User deletion error:", error)
    return NextResponse.json(
      { error: "Failed to remove user" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { verifyAdminSession } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

// Diagnostic endpoint to test Firebase connection
export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY || ""
  
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envVars: {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? `${process.env.FIREBASE_PROJECT_ID.substring(0, 5)}...` : "NOT SET",
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? `${process.env.FIREBASE_CLIENT_EMAIL.substring(0, 10)}...` : "NOT SET",
      FIREBASE_PRIVATE_KEY: privateKey ? `SET (length: ${privateKey.length})` : "NOT SET",
      FIREBASE_PRIVATE_KEY_FORMAT: {
        startsWithQuote: privateKey.startsWith('"') || privateKey.startsWith("'"),
        hasLiteralBackslashN: privateKey.includes("\\n"),
        hasActualNewlines: privateKey.includes("\n"),
        startsWithBegin: privateKey.includes("-----BEGIN"),
        endsWithEnd: privateKey.includes("-----END"),
        first50Chars: privateKey.substring(0, 50).replace(/./g, (c) => c === "\n" ? "↵" : c === "\\" ? "\\\\" : "*"),
      },
    },
    isFirebaseConfigured: isFirebaseConfigured(),
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({
      ...diagnostics,
      error: "Firebase not configured - missing environment variables",
      status: "FAILED",
    })
  }

  try {
    // Test 1: Try to access Firestore
    diagnostics.firestoreAccess = "Testing..."
    
    const testDoc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    
    diagnostics.firestoreAccess = "SUCCESS"
    diagnostics.sponsorsDocExists = testDoc.exists
    diagnostics.sponsorsData = testDoc.exists ? {
      hasSponsorsProp: !!testDoc.data()?.sponsors,
      tierCount: testDoc.data()?.sponsors ? Object.keys(testDoc.data()?.sponsors).length : 0,
      updatedAt: testDoc.data()?.updatedAt?.toDate?.()?.toISOString() || null,
    } : null

    // Test 2: Try a write operation (to a test document)
    diagnostics.writeTest = "Testing..."
    
    await adminDb.collection(COLLECTIONS.CONTENT).doc("_connection_test").set({
      testTimestamp: new Date(),
      testedBy: session.email,
    })
    
    diagnostics.writeTest = "SUCCESS"

    // Clean up test document
    await adminDb.collection(COLLECTIONS.CONTENT).doc("_connection_test").delete()
    diagnostics.cleanupTest = "SUCCESS"

    return NextResponse.json({
      ...diagnostics,
      status: "ALL TESTS PASSED",
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json({
      ...diagnostics,
      error: errorMessage,
      errorStack: errorStack?.split("\n").slice(0, 5),
      status: "FAILED",
    }, { status: 500 })
  }
}

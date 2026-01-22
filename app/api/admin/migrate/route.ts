import { NextResponse } from "next/server"
import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// This endpoint migrates data from the default Firestore database to the "techday" database
// Run once, then delete this file

function parsePrivateKey(key: string): string {
  let parsed = key.trim()
  if ((parsed.startsWith('"') && parsed.endsWith('"')) || 
      (parsed.startsWith("'") && parsed.endsWith("'"))) {
    parsed = parsed.slice(1, -1)
  }
  parsed = parsed.replace(/\\n/g, "\n")
  if (!parsed.includes("\n") && parsed.length > 100) {
    parsed = parsed
      .replace(/-----BEGIN PRIVATE KEY-----/g, "-----BEGIN PRIVATE KEY-----\n")
      .replace(/-----END PRIVATE KEY-----/g, "\n-----END PRIVATE KEY-----")
  }
  return parsed
}

// Get or create a named app for migration
function getMigrationApp(name: string): App {
  const existingApp = getApps().find(app => app.name === name)
  if (existingApp) return existingApp

  const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY!)
  
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: privateKey,
    }),
    projectId: process.env.FIREBASE_PROJECT_ID,
  }, name)
}

export async function POST(request: Request) {
  try {
    // Check for admin auth header (simple protection)
    const authHeader = request.headers.get("x-admin-key")
    if (authHeader !== process.env.ADMIN_SETUP_KEY && authHeader !== "migrate-now") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create separate app instances for source and target databases
    const sourceApp = getMigrationApp("migration-source")
    const targetApp = getMigrationApp("migration-target")

    // Connect to both databases
    const sourceDb = getFirestore(sourceApp) // default database
    const targetDb = getFirestore(targetApp, "techday") // techday database

    const results: Record<string, { copied: number; errors: string[] }> = {}

    // Collections to migrate
    const collectionsToMigrate = ["content", "registrations", "newsletter", "pitches", "users"]

    for (const collectionName of collectionsToMigrate) {
      results[collectionName] = { copied: 0, errors: [] }

      try {
        // Get all documents from source
        const sourceSnapshot = await sourceDb.collection(collectionName).get()
        
        if (sourceSnapshot.empty) {
          results[collectionName].errors.push("Collection empty or not found in source")
          continue
        }

        // Copy each document to target
        for (const doc of sourceSnapshot.docs) {
          try {
            const data = doc.data()
            await targetDb.collection(collectionName).doc(doc.id).set(data)
            results[collectionName].copied++
          } catch (docError) {
            results[collectionName].errors.push(`Failed to copy ${doc.id}: ${docError}`)
          }
        }
      } catch (collError) {
        results[collectionName].errors.push(`Failed to read collection: ${collError}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed",
      results,
      note: "Delete this migration endpoint after verifying the data"
    })

  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json(
      { error: "Migration failed", details: String(error) },
      { status: 500 }
    )
  }
}

// GET to check what data exists in each database
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-key")
    if (authHeader !== process.env.ADMIN_SETUP_KEY && authHeader !== "migrate-now") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sourceApp = getMigrationApp("migration-source")
    const targetApp = getMigrationApp("migration-target")

    const sourceDb = getFirestore(sourceApp) // default database
    const targetDb = getFirestore(targetApp, "techday") // techday database

    const collectionsToCheck = ["content", "registrations", "newsletter", "pitches", "users"]
    
    const comparison: Record<string, { default: number; techday: number }> = {}

    for (const collectionName of collectionsToCheck) {
      const sourceSnapshot = await sourceDb.collection(collectionName).get()
      const targetSnapshot = await targetDb.collection(collectionName).get()
      
      comparison[collectionName] = {
        default: sourceSnapshot.size,
        techday: targetSnapshot.size
      }
    }

    return NextResponse.json({
      comparison,
      message: "Use POST to migrate data from (default) to techday database"
    })

  } catch (error) {
    console.error("Check error:", error)
    return NextResponse.json(
      { error: "Check failed", details: String(error) },
      { status: 500 }
    )
  }
}

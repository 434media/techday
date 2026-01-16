// Firebase Admin SDK Configuration
// This is used for server-side Firebase operations (API routes)

import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"
import { getAuth, type Auth } from "firebase-admin/auth"

// Check if Firebase is properly configured
function isFirebaseConfigured(): boolean {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  )
}

// Lazy initialization to prevent build-time errors
let _adminApp: App | null = null
let _adminDb: Firestore | null = null
let _adminAuth: Auth | null = null

function getAdminApp(): App {
  if (_adminApp) return _adminApp

  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase Admin SDK is not configured. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables."
    )
  }

  if (getApps().length > 0) {
    _adminApp = getApps()[0]
  } else {
    _adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  }

  return _adminApp
}

// Getter for Admin Firestore
const adminDb = new Proxy({} as Firestore, {
  get(_, prop) {
    if (!_adminDb) {
      _adminDb = getFirestore(getAdminApp())
    }
    return (_adminDb as Record<string | symbol, unknown>)[prop]
  },
})

// Getter for Admin Auth
const adminAuth = new Proxy({} as Auth, {
  get(_, prop) {
    if (!_adminAuth) {
      _adminAuth = getAuth(getAdminApp())
    }
    return (_adminAuth as Record<string | symbol, unknown>)[prop]
  },
})

export { adminDb, adminAuth, isFirebaseConfigured }

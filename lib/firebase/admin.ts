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

// Parse the private key - handle multiple formats
function parsePrivateKey(key: string): string {
  // If the key is wrapped in quotes, remove them
  let parsed = key.trim()
  if ((parsed.startsWith('"') && parsed.endsWith('"')) || 
      (parsed.startsWith("'") && parsed.endsWith("'"))) {
    parsed = parsed.slice(1, -1)
  }
  
  // Replace literal \n with actual newlines
  // This handles both \\n and \n patterns
  parsed = parsed.replace(/\\n/g, "\n")
  
  // If there are still no actual newlines and the key is long, 
  // try splitting on the known PEM markers
  if (!parsed.includes("\n") && parsed.length > 100) {
    parsed = parsed
      .replace(/-----BEGIN PRIVATE KEY-----/g, "-----BEGIN PRIVATE KEY-----\n")
      .replace(/-----END PRIVATE KEY-----/g, "\n-----END PRIVATE KEY-----")
  }
  
  return parsed
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
    const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY!)
    
    _adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: privateKey,
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  }

  return _adminApp
}

// Getter for Admin Firestore - using "techday" database
function getAdminDb(): Firestore {
  if (!_adminDb) {
    _adminDb = getFirestore(getAdminApp(), "techday")
  }
  return _adminDb
}

// Getter for Admin Auth
function getAdminAuth(): Auth {
  if (!_adminAuth) {
    _adminAuth = getAuth(getAdminApp())
  }
  return _adminAuth
}

// Export as getters that return the actual instances
// This avoids Proxy issues with Firebase's async internals
const adminDb = {
  collection: (...args: Parameters<Firestore["collection"]>) => getAdminDb().collection(...args),
  doc: (...args: Parameters<Firestore["doc"]>) => getAdminDb().doc(...args),
  batch: () => getAdminDb().batch(),
  runTransaction: <T>(fn: Parameters<Firestore["runTransaction"]>[0]) => getAdminDb().runTransaction<T>(fn),
}

const adminAuth = {
  verifyIdToken: (...args: Parameters<Auth["verifyIdToken"]>) => getAdminAuth().verifyIdToken(...args),
  verifySessionCookie: (...args: Parameters<Auth["verifySessionCookie"]>) => getAdminAuth().verifySessionCookie(...args),
  createSessionCookie: (...args: Parameters<Auth["createSessionCookie"]>) => getAdminAuth().createSessionCookie(...args),
  revokeRefreshTokens: (...args: Parameters<Auth["revokeRefreshTokens"]>) => getAdminAuth().revokeRefreshTokens(...args),
  getUser: (...args: Parameters<Auth["getUser"]>) => getAdminAuth().getUser(...args),
  getUserByEmail: (...args: Parameters<Auth["getUserByEmail"]>) => getAdminAuth().getUserByEmail(...args),
  createUser: (...args: Parameters<Auth["createUser"]>) => getAdminAuth().createUser(...args),
  updateUser: (...args: Parameters<Auth["updateUser"]>) => getAdminAuth().updateUser(...args),
  deleteUser: (...args: Parameters<Auth["deleteUser"]>) => getAdminAuth().deleteUser(...args),
  setCustomUserClaims: (...args: Parameters<Auth["setCustomUserClaims"]>) => getAdminAuth().setCustomUserClaims(...args),
}

export { adminDb, adminAuth, isFirebaseConfigured }

// Firebase Client SDK Configuration
// Used for browser-side Firebase operations (Auth, etc.)

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User
} from "firebase/auth"

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if Firebase client is configured
export function isClientConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  )
}

// Lazy initialization
let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _googleProvider: GoogleAuthProvider | null = null

function getFirebaseApp(): FirebaseApp {
  if (_app) return _app
  
  if (!isClientConfigured()) {
    throw new Error("Firebase client is not configured. Check NEXT_PUBLIC_FIREBASE_* env vars.")
  }
  
  _app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  return _app
}

export function getClientAuth(): Auth {
  if (_auth) return _auth
  _auth = getAuth(getFirebaseApp())
  return _auth
}

function getGoogleProvider(): GoogleAuthProvider {
  if (_googleProvider) return _googleProvider
  _googleProvider = new GoogleAuthProvider()
  // Request additional scopes if needed
  _googleProvider.addScope("email")
  _googleProvider.addScope("profile")
  // Restrict to 434media.com domain only
  _googleProvider.setCustomParameters({
    hd: "434media.com" // Hosted domain - only allows @434media.com accounts
  })
  return _googleProvider
}

// Sign in with Google popup
export async function signInWithGoogle(): Promise<User> {
  const auth = getClientAuth()
  const provider = getGoogleProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}

// Sign in with email/password
export async function signInWithEmail(email: string, password: string): Promise<User> {
  const auth = getClientAuth()
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

// Sign out
export async function signOut(): Promise<void> {
  const auth = getClientAuth()
  await firebaseSignOut(auth)
}

// Get current user
export function getCurrentUser(): User | null {
  const auth = getClientAuth()
  return auth.currentUser
}

// Get ID token for server verification
export async function getIdToken(): Promise<string | null> {
  const user = getCurrentUser()
  if (!user) return null
  return user.getIdToken()
}

// Subscribe to auth state changes
export function onAuthChange(callback: (user: User | null) => void): () => void {
  const auth = getClientAuth()
  return onAuthStateChanged(auth, callback)
}

// Export types
export type { User }

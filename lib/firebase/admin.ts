// Firebase Admin SDK Configuration
// This is used for server-side Firebase operations (API routes)

import { initializeApp, getApps, cert, type App, type Credential } from "firebase-admin/app"
import { getFirestore, Firestore } from "firebase-admin/firestore"
import { getAuth, type Auth } from "firebase-admin/auth"
import { ExternalAccountClient, type BaseExternalAccountClient } from "google-auth-library"
import { getVercelOidcToken } from "@vercel/oidc"

// Two ways to authenticate, chosen by which env vars are set:
//
//  - KEY (current): FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY, a downloaded
//    service-account key.
//  - KEYLESS: the techday-app service account in c434-techday, reached through
//    Vercel OIDC and Workload Identity Federation, so no key file exists. Vercel
//    proves which project is calling (getVercelOidcToken), Google exchanges that
//    for a short-lived token for techday-app, and nothing long-lived is stored.
//    Needs GCP_PROJECT_NUMBER, GCP_SERVICE_ACCOUNT_EMAIL,
//    GCP_WORKLOAD_IDENTITY_POOL_ID and GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID, plus
//    FIREBASE_PROJECT_ID. Pattern: https://vercel.com/docs/oidc/gcp
//
// The key path wins while its vars are set, so deploying this changes nothing
// until the Vercel env is switched (the key vars removed, the GCP_* vars added).

function hasKeyCredential(): boolean {
  return !!(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
}

function hasKeylessCredential(): boolean {
  return !!(
    process.env.GCP_PROJECT_NUMBER &&
    process.env.GCP_SERVICE_ACCOUNT_EMAIL &&
    process.env.GCP_WORKLOAD_IDENTITY_POOL_ID &&
    process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID
  )
}

// Check if Firebase is properly configured
function isFirebaseConfigured(): boolean {
  return !!process.env.FIREBASE_PROJECT_ID && (hasKeyCredential() || hasKeylessCredential())
}

const isKeyless = () => !hasKeyCredential() && hasKeylessCredential()

let _externalClient: BaseExternalAccountClient | null = null

/** Workload Identity Federation client for techday-app, fed by the Vercel OIDC token. */
function getExternalClient(): BaseExternalAccountClient {
  if (_externalClient) return _externalClient
  const providerPath =
    `iam.googleapis.com/projects/${process.env.GCP_PROJECT_NUMBER}` +
    `/locations/global/workloadIdentityPools/${process.env.GCP_WORKLOAD_IDENTITY_POOL_ID}` +
    `/providers/${process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`
  // STS wants the provider's resource name ("//iam.googleapis.com/..."); the Vercel
  // OIDC token is requested for the https form, one of the provider's allowed audiences.
  const audience = `//${providerPath}`
  const oidcAudience = `https://${providerPath}`
  const client = ExternalAccountClient.fromJSON({
    type: "external_account",
    audience,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url:
      `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/` +
      `${process.env.GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
    // Read per request, never at module load: on Vercel the token arrives in the
    // request (x-vercel-oidc-token) and is not available at build time.
    subject_token_supplier: { getSubjectToken: () => getVercelOidcToken({ audience: oidcAudience }) },
  })
  if (!client) throw new Error("Could not create the Workload Identity Federation client.")
  _externalClient = client
  return client
}

/**
 * A firebase-admin credential backed by the federated client, for Firebase Auth
 * (createSessionCookie, getUser and the rest). Firestore cannot take a custom
 * credential through firebase-admin (it accepts only a key or Application Default
 * Credentials), so getAdminDb builds its client with the same authClient instead.
 */
const keylessCredential: Credential = {
  async getAccessToken() {
    const client = getExternalClient()
    const { token } = await client.getAccessToken()
    if (!token) throw new Error("Workload Identity Federation returned no access token.")
    const expiry = client.credentials?.expiry_date
    return {
      access_token: token,
      expires_in: expiry ? Math.max(0, Math.floor((expiry - Date.now()) / 1000)) : 300,
    }
  },
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
      "Firebase Admin SDK is not configured. Set FIREBASE_PROJECT_ID plus either FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY, or the GCP_* Workload Identity Federation variables."
    )
  }

  if (getApps().length > 0) {
    _adminApp = getApps()[0]
  } else if (isKeyless()) {
    _adminApp = initializeApp({
      credential: keylessCredential,
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
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
    _adminDb = isKeyless()
      ? new Firestore({
          projectId: process.env.FIREBASE_PROJECT_ID,
          databaseId: "techday",
          authClient: getExternalClient(),
        })
      : getFirestore(getAdminApp(), "techday")
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

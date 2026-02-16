// Firestore Collection Names and Types
// Centralized collection definitions for consistency

export const COLLECTIONS = {
  USERS: "users",
  REGISTRATIONS: "registrations",
  NEWSLETTER: "newsletter",
  PITCH_SUBMISSIONS: "pitchSubmissions",
  SPONSOR_CONTACTS: "sponsorContacts",  // Sponsor inquiry form submissions
  CONTENT: "content",
  SITE_TEXT: "siteText",  // Inline editable text blocks
  SITE_TEXT_HISTORY: "siteTextHistory",  // Version history for text blocks
  // Note: Admin users are managed through Firebase Authentication, not Firestore
} as const

// User roles for admin access
export type UserRole = "admin" | "editor" | "viewer"

// User permissions for granular access control
export type Permission = "speakers" | "schedule" | "sponsors" | "registrations" | "pitches" | "newsletter"

// User document structure
export interface UserDocument {
  uid: string
  email: string
  displayName?: string
  role: UserRole
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

// Registration document structure
export interface RegistrationDocument {
  id?: string
  firstName: string
  lastName: string
  email: string
  category: string
  company: string
  title: string
  events: string[]
  dietaryRestrictions: string
  ticketId: string
  status: "pending" | "confirmed" | "checked-in" | "cancelled"
  createdAt: Date
  updatedAt: Date
  source: string
}

// Newsletter subscriber document structure
export interface NewsletterDocument {
  id?: string
  email: string
  subscribedAt: Date
  source: "homepage" | "registration" | "popup" | "footer"
  status: "active" | "unsubscribed"
}

// Pitch submission document structure
export interface PitchSubmissionDocument {
  id?: string
  companyName: string
  founderName: string
  email: string
  phone: string
  website: string
  stage: string
  industry: string
  pitch: string
  problem: string
  solution: string
  traction: string
  teamSize: string
  fundingRaised: string
  fundingGoal: string
  deckUrl: string
  status: "pending" | "reviewing" | "accepted" | "rejected"
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  reviewNotes?: string
}

// Sponsor contact/inquiry document structure
export interface SponsorContactDocument {
  id?: string
  firstName: string
  lastName: string
  company: string
  workEmail: string
  phone: string
  message: string
  status: "new" | "contacted" | "closed"
  submittedAt: Date
}

// Content document structures for CMS
export interface SpeakerContent {
  id: string
  name: string
  title: string
  company: string
  bio: string
  imageUrl: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export interface SessionContent {
  id: string
  title: string
  description: string
  time: string
  duration: number
  room: string
  speakerIds?: string[]
  type: "keynote" | "talk" | "workshop" | "panel" | "break" | "networking"
  track?: "emerging" | "founders" | "ai" | ""
}

export interface SponsorContent {
  id: string
  name: string
  logoUrl: string
  website: string
}

export type SponsorEvent = "techday" | "techfuel"
export type SponsorCategory = "sponsors" | "community"

export interface ContentDocument {
  speakers?: SpeakerContent[]
  sessions?: SessionContent[]
  sponsors?: {
    techday: {
      sponsors: SponsorContent[]
      community: SponsorContent[]
    }
    techfuel: {
      sponsors: SponsorContent[]
      community: SponsorContent[]
    }
  }
  updatedAt: Date
  updatedBy: string
}

// Admin document structure (stored in Firestore, not env vars)
// Note: This is kept for reference but admin users are now managed through Firebase Auth
// Google sign-in: Only @434.media workspace accounts
// Email/Password: Users created in Firebase Authentication
export type AdminRole = "admin" // Simplified - all Firebase Auth users are admins
export type AdminPermission = 
  | "registrations"
  | "newsletter"
  | "pitches"
  | "speakers"
  | "schedule"
  | "sponsors"
  | "users"

// AdminDocument type kept for backwards compatibility but not used for auth
export interface AdminDocument {
  email: string
  uid?: string
  name: string
  role: AdminRole
  permissions: AdminPermission[]
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

// Simplified - all authenticated users get full permissions
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  admin: ["registrations", "newsletter", "pitches", "speakers", "schedule", "sponsors", "users"],
}

// Permission labels for UI
export const PERMISSION_LABELS: Record<AdminPermission, string> = {
  registrations: "Event Registrations",
  newsletter: "Newsletter Subscribers",
  pitches: "Pitch Submissions",
  speakers: "Speaker Management",
  schedule: "Schedule Management",
  sponsors: "Sponsor Management",
  users: "User Management",
}

// Site Text Content for inline editing
export interface TextBlockContent {
  id: string                    // Unique identifier like "hero.title" or "about.description"
  content: string               // The actual text content
  element: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "li" | "label" | "rich"
  page: string                  // Which page it belongs to (e.g., "home", "sponsor", "techday")
  section: string               // Which section (e.g., "hero", "about", "cta")
  updatedAt: Date
  updatedBy: string
  version?: number              // Current version number
}

// Version History for text blocks
export interface TextBlockVersion {
  id: string                    // Auto-generated version ID
  textBlockId: string           // Reference to the TextBlockContent id
  content: string               // The content at this version
  version: number               // Version number (1, 2, 3, ...)
  createdAt: Date               // When this version was created
  createdBy: string             // Who made this edit (email)
  changeType: "create" | "update" | "restore"  // What kind of change
}

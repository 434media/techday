// Firestore Collection Names and Types
// Centralized collection definitions for consistency

export const COLLECTIONS = {
  USERS: "users",
  REGISTRATIONS: "registrations",
  NEWSLETTER: "newsletter",
  PITCH_SUBMISSIONS: "pitchSubmissions",
  CONTENT: "content",
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

// Content document structures for CMS
export interface SpeakerContent {
  id: string
  name: string
  title: string
  company: string
  bio: string
  imageUrl: string
  track: "ai" | "emerging" | "founders"
  sessionId?: string
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
  speakerId?: string
  type: "keynote" | "talk" | "workshop" | "panel" | "break" | "networking"
  track?: "emerging" | "founders" | "ai" | ""
}

export interface SponsorContent {
  id: string
  name: string
  logoUrl: string
  website: string
  tier: "platinum" | "gold" | "silver" | "bronze" | "community"
}

export interface ContentDocument {
  speakers?: SpeakerContent[]
  sessions?: SessionContent[]
  sponsors?: {
    platinum: SponsorContent[]
    gold: SponsorContent[]
    silver: SponsorContent[]
    bronze: SponsorContent[]
    community: SponsorContent[]
  }
  updatedAt: Date
  updatedBy: string
}

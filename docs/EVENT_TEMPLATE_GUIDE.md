# Event Application Template — Build Guide

> A comprehensive blueprint for spinning up a custom event website using this codebase as a template. This document captures every integration, feature, data model, and architectural decision so a new project can be stood up from scratch with mock data.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Environment Variables](#environment-variables)
4. [Project Structure](#project-structure)
5. [Firebase / Firestore Integration](#firebase--firestore-integration)
6. [Resend Email Integration](#resend-email-integration)
7. [Authentication & Admin System](#authentication--admin-system)
8. [Inline CMS (Edit Mode)](#inline-cms-edit-mode)
9. [Public Pages](#public-pages)
10. [Admin Dashboard](#admin-dashboard)
11. [API Routes](#api-routes)
12. [Forms & Data Collection](#forms--data-collection)
13. [Visual Effects & Components](#visual-effects--components)
14. [Bot Protection](#bot-protection)
15. [Deployment (Vercel)](#deployment-vercel)
16. [Bootstrapping a New Event](#bootstrapping-a-new-event)
17. [Mock Data Strategy](#mock-data-strategy)
18. [Gaps & Recommendations](#gaps--recommendations)

---

## Architecture Overview

This is a **Next.js 16 App Router** application deployed on **Vercel**. It combines a public-facing event website with a full admin dashboard and inline CMS capabilities.

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Hosting)                      │
│  ┌──────────────────┐  ┌─────────────────────────────┐  │
│  │   Public Pages    │  │     Admin Dashboard         │  │
│  │  (SSR + Client)   │  │  (Client-side, auth-gated)  │  │
│  └────────┬─────────┘  └──────────┬──────────────────┘  │
│           │                       │                      │
│  ┌────────▼───────────────────────▼──────────────────┐  │
│  │              Next.js API Routes                    │  │
│  │  /api/register  /api/newsletter  /api/admin/*     │  │
│  └───────┬──────────────┬─────────────────┬──────────┘  │
│          │              │                 │              │
│  ┌───────▼──────┐ ┌────▼─────┐  ┌────────▼──────────┐  │
│  │   Firestore   │ │  Resend  │  │  Firebase Auth    │  │
│  │ (named "techday")│  (Email) │  │ (Admin sessions)  │  │
│  └──────────────┘ └──────────┘  └───────────────────┘  │
│                                                         │
│  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │  Vercel Blob     │  │  BotID (bot protection)    │  │
│  │  (Image uploads) │  │  (form spam prevention)    │  │
│  └──────────────────┘  └────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Data flow**: All Firestore reads/writes happen server-side through the Firebase Admin SDK (API routes). The client never talks directly to Firestore. Public content APIs serve cached data (60s revalidation). Admin APIs require session cookie authentication.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router, Turbopack) | Full-stack React framework |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS v4 + tw-animate-css | Utility-first CSS |
| Database | Google Firestore (named database: "techday") | Document storage |
| Auth | Firebase Authentication (Google + Email/Password) | Admin login |
| Email | Resend | Transactional email (confirmations) |
| 3D/WebGL | React Three Fiber + Drei + Rapier | Particle effects, 3D badge |
| Animation | Motion (Framer Motion) | Page transitions, scroll animations |
| Bot Protection | BotID | Form spam prevention |
| Image Storage | Vercel Blob | Admin-uploaded images |
| Analytics | Vercel Analytics | Page views, web vitals |
| Fonts | Space Grotesk, JetBrains Mono, Syne, Bebas Neue | Typography |
| Icons | Lucide React | UI icons |
| Deployment | Vercel | Hosting, serverless functions, edge |

---

## Environment Variables

### Required for Firebase (Server-side Admin SDK)

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Required for Firebase (Client-side Auth)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
```

### Required for Email

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Required for Admin

```bash
ADMIN_SESSION_SECRET=<openssl rand -base64 32>
```

### Required for Vercel Services

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx  # For image uploads
```

### Optional

```bash
DISABLE_BOT_PROTECTION=true         # Skip BotID checks in dev
ADMIN_SETUP_SECRET=your-secret      # For /api/admin/seed route
ADMIN_SETUP_KEY=your-key            # For /api/admin/migrate route
ADMIN_USERS=email|role|name|q|a|pin # Legacy config-based admin auth
```

---

## Project Structure

```
app/
├── layout.tsx              # Root layout: fonts, Navbar, Footer, Providers
├── page.tsx                # Homepage (Hero section)
├── globals.css             # Tailwind v4 config, CSS variables, design tokens
├── robots.ts               # SEO: allow/disallow rules
├── sitemap.ts              # SEO: sitemap entries
├── register/page.tsx       # Registration page
├── sponsor/page.tsx        # Sponsor inquiry page
├── techday/page.tsx        # Conference detail page (tracks, schedule, speakers)
├── techfuel/page.tsx       # Pitch competition detail page
├── anniversary/page.tsx    # Anniversary/history page
├── admin/                  # Admin dashboard (auth-gated)
│   ├── layout.tsx          # Admin layout wrapper
│   ├── page.tsx            # Dashboard overview with stats
│   ├── registrations/      # Manage event registrations
│   ├── newsletter/         # Manage newsletter subscribers
│   ├── pitches/            # Review pitch submissions
│   ├── speakers/           # CRUD speakers
│   ├── schedule/           # CRUD schedule sessions
│   ├── sponsors/           # CRUD sponsors by tier
│   ├── partners/           # CRUD partners
│   └── sponsor-contacts/   # Manage sponsor inquiries
├── api/
│   ├── register/route.ts   # Public: event registration
│   ├── newsletter/route.ts # Public: newsletter signup
│   ├── pitch/route.ts      # Public: pitch submission
│   ├── sponsor-contact/    # Public: sponsor inquiry
│   ├── svg/route.ts        # SVG proxy (CORS avoidance)
│   ├── content/            # Public: read-only content APIs
│   │   ├── speakers/       # GET speakers
│   │   ├── schedule/       # GET schedule
│   │   ├── sponsors/       # GET sponsors
│   │   └── text/[id]/      # GET editable text block
│   └── admin/              # Admin: authenticated APIs
│       ├── auth/           # Login/logout/session check
│       ├── content/        # CRUD for speakers, schedule, sponsors, partners, text
│       ├── data/           # View/manage registrations, newsletter, pitches, contacts
│       ├── stats/          # Dashboard statistics
│       ├── seed/           # Seed admin users
│       ├── setup/          # First-time admin setup
│       ├── migrate/        # DB migration utility
│       └── upload/         # Image upload via Vercel Blob
components/
├── navbar.tsx              # Fixed top navigation
├── footer.tsx              # 4-column site footer
├── providers.tsx           # AdminAuthProvider + EditModeProvider
├── sections/               # Major page sections
│   ├── hero.tsx            # Homepage hero
│   ├── about.tsx           # About the event
│   ├── schedule.tsx        # Schedule timeline
│   ├── speaker-card.tsx    # Speaker card component
│   └── sponsors.tsx        # Sponsors grid by tier
├── forms/                  # Form components
│   ├── registration-form.tsx
│   ├── pitch-submission-form.tsx
│   └── sponsor-contact-form.tsx
├── admin/                  # Admin UI components
│   ├── auth-provider.tsx   # Firebase auth context
│   ├── edit-mode-provider.tsx # Inline edit toggle + toolbar
│   ├── layout.tsx          # Auth gate + sidebar layout
│   ├── login.tsx           # Login screen
│   └── sidebar.tsx         # Admin navigation sidebar
├── editable.tsx            # Inline plain-text CMS wrapper
├── rich-editable.tsx       # Inline rich-text CMS wrapper
├── editable-text.tsx       # Plain-text editing core
├── rich-editable-text.tsx  # Rich-text editing core
├── version-history-modal.tsx # Text version history viewer
├── interactive-lanyard.tsx # 3D draggable conference badge
├── webgl-background.tsx    # Particle system background
├── advanced-particles.tsx  # GPU particle simulation
├── animated-blimp.tsx      # Floating animated blimp
├── pixel-arrow.tsx         # Interactive pixel-dispersing arrow
├── ticket-badge.tsx        # Decorative ticket/badge components
├── newsletter-popup.tsx    # Newsletter signup popup
├── video-modal.tsx         # Fullscreen video modal
├── anniversary-carousel.tsx # Scroll-driven photo gallery
└── ui/
    └── animated-button.tsx # Reusable animated button
lib/
├── firebase/
│   ├── admin.ts            # Firebase Admin SDK init (Firestore + Auth)
│   ├── client.ts           # Firebase Client SDK (browser auth)
│   ├── collections.ts      # Collection names, TypeScript interfaces
│   └── index.ts            # Re-exports
├── admin/
│   ├── config.ts           # Legacy admin config (env-based users)
│   └── session.ts          # Server-side session verification
├── email/
│   └── resend.ts           # Email templates and send functions
└── shader-utils.ts, etc.   # WebGL shader helpers
```

---

## Firebase / Firestore Integration

### Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable **Firestore Database** — create a **named database** called `"techday"` (not the default `(default)` database)
3. Enable **Firebase Authentication** with **Google** and **Email/Password** providers
4. Generate a **service account key** (Project Settings → Service Accounts → Generate New Private Key)
5. For Google sign-in admin restriction, configure the hosted domain in the client code (`hd` parameter)

### Named Database

The app uses a **named Firestore database** (`"techday"`) rather than the default. This is set in `lib/firebase/admin.ts`:

```typescript
_adminDb = getFirestore(getAdminApp(), "techday")
```

> **For new events**: Change this database name to isolate data per event (e.g., `"client-event-2027"`).

### Collections

| Collection | Document Structure | Purpose |
|---|---|---|
| `registrations` | `{ firstName, lastName, email, category, company, title, events[], dietaryRestrictions, ticketId, status, createdAt, updatedAt, source }` | Event registration submissions |
| `newsletter` | `{ email, subscribedAt, source, status }` | Newsletter subscribers |
| `pitchSubmissions` | `{ companyName, founderName, email, phone, website, stage, industry, pitch, problem, solution, traction, teamSize, fundingRaised, fundingGoal, deckUrl, status, submittedAt, reviewedAt?, reviewedBy?, reviewNotes? }` | Pitch competition applications |
| `sponsorContacts` | `{ firstName, lastName, company, workEmail, phone, message, status, submittedAt }` | Sponsor inquiry form submissions |
| `content` | Single documents: `speakers` (array), `schedule` (array), `sponsors` (by-tier object), `partners` (array) | CMS content managed by admin |
| `siteText` | `{ id, content, element, page, section, updatedAt, updatedBy, version }` | Inline-editable text blocks |
| `siteTextHistory` | `{ textId, content, element, page, section, changedAt, changedBy, changeType, version }` | Version history for text edits |

### Content Storage Pattern

Speakers, schedule, sponsors, and partners are stored as **single Firestore documents with array fields** (not individual documents per item). This simplifies reads (one doc fetch per content type) but means writes are read-modify-write operations.

```
content/
  speakers → { speakers: [...], updatedAt, updatedBy }
  schedule → { sessions: [...], updatedAt, updatedBy }
  sponsors → { platinum: [...], gold: [...], silver: [...], bronze: [...], community: [...], updatedAt, updatedBy }
  partners → { partners: [...], updatedAt, updatedBy }
```

### Firestore Security Rules

Block all client-side access since everything goes through the Admin SDK:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Resend Email Integration

### Setup

1. Create a [Resend](https://resend.com) account
2. Add and verify your sending domain (e.g., `send.yourdomain.com`)
3. Generate an API key and set `RESEND_API_KEY`
4. Update the `FROM_EMAIL` and `REPLY_TO` constants in `lib/email/resend.ts`

### Email Configuration

```typescript
const FROM_EMAIL = "Event Name <noreply@send.yourdomain.com>"
const REPLY_TO = "team@yourdomain.com"
```

### Email Templates (3 types)

All emails share a branded HTML template with a dark header, white content area, and dark footer.

#### 1. Registration Confirmation (`sendRegistrationConfirmation`)
- **Trigger**: Successful event registration via `/api/register`
- **Subject**: Dynamic based on events selected (e.g., "You're registered for Tech Fuel & Tech Day 2026!")
- **Content**: Personalized greeting, styled ticket card with ticket ID, "What's Next?" checklist with dates/venues
- **Dynamic**: Header text and details change based on single-event vs. multi-event registration

#### 2. Pitch Submission Confirmation (`sendPitchConfirmation`)
- **Trigger**: Successful pitch submission via `/api/pitch`
- **Subject**: "Pitch Received — {Company Name} | Tech Fuel 2026"
- **Content**: Submission ID, "Under Review" status badge, 3-step pipeline visualization

#### 3. Sponsor Inquiry Confirmation (`sendSponsorInquiryConfirmation`)
- **Trigger**: Successful sponsor contact form via `/api/sponsor-contact`
- **Subject**: "Thanks for Your Interest — {Company} | Tech Day 2026"
- **Content**: Company acknowledgment, 3-step pipeline (Received → Follow-Up → Finalized)

### Customizing for New Events

1. Update `FROM_EMAIL` and `REPLY_TO`
2. Replace branding in `getEmailTemplate()` — header text, colors (`#c73030`), footer copyright
3. Update event-specific details in each send function (dates, venues, event names)
4. Update the decorative SVG arrow in the email header (or remove it)

---

## Authentication & Admin System

### Overview

The admin system uses **Firebase Authentication** as the identity provider with **server-side session cookies** for stateful access.

### Auth Flow

```
1. User visits /admin
2. AdminLayout renders → AdminAuthProvider checks auth state
3. Not authenticated → AdminLogin shows (Google or Email/Password)
4. User signs in via Firebase Client SDK
5. Client sends Firebase ID token to POST /api/admin/auth
6. Server verifies token with Firebase Admin SDK
7. Server enforces domain restriction (e.g., @434media.com for Google sign-in)
8. Server creates 7-day httpOnly session cookie via Firebase createSessionCookie()
9. Server returns user info { email, name, role, permissions }
10. Client stores user in AdminAuthProvider context
11. Subsequent API calls include session cookie automatically
12. Server verifies session cookie with verifySessionCookie() on each request
```

### Domain Restriction

Google sign-in is restricted to a specific Google Workspace domain:

```typescript
// lib/firebase/client.ts
_googleProvider.setCustomParameters({
  hd: "434media.com", // Change this to your org's domain
  prompt: "select_account"
})
```

The server also enforces this:

```typescript
// api/admin/auth/route.ts
if (decodedToken.firebase?.sign_in_provider === "google.com") {
  const email = decodedToken.email || ""
  if (!email.endsWith("@434media.com")) {
    return NextResponse.json({ error: "Unauthorized domain" }, { status: 403 })
  }
}
```

### Session Management (`lib/admin/session.ts`)

- Reads `admin_session` cookie from request
- Verifies with `adminAuth.verifySessionCookie()`
- Returns `SessionUser` with email, name, role, permissions, uid
- All authenticated users get full admin permissions (flat "admin" role)

### Customizing for New Events

1. Change the Google Workspace domain restriction (or remove it for email/password only)
2. Create admin users in Firebase Authentication console
3. Optionally implement role-based permissions (currently all admins get full access)

---

## Inline CMS (Edit Mode)

### How It Works

The app has a built-in inline content editing system that lets admins edit text directly on the live site without deploying code changes.

### Components

| Component | Purpose |
|---|---|
| `EditModeProvider` | Context provider with toggle state, keyboard shortcuts, floating toolbar |
| `Editable` | Wrapper for plain-text inline editing |
| `RichEditable` | Wrapper for rich-text inline editing (bold, italic, links) |
| `EditableText` | Core plain-text editing engine |
| `RichEditableText` | Core rich-text editing engine |
| `VersionHistoryModal` | View and restore previous text versions |

### Usage Pattern

```tsx
// In any page component:
<Editable id="hero.title" as="h1" page="home" section="hero" className="text-5xl font-bold">
  Default Title Text
</Editable>

<RichEditable id="about.body" page="home" section="about" className="prose">
  <p>Default <strong>rich</strong> content</p>
</RichEditable>
```

### Behavior

- **View mode** (default): Renders stored content from Firestore, falls back to default children
- **Edit mode** (admin + Cmd/Ctrl+E): Blue highlight ring on hover, click to edit inline
- **Save**: Cmd/Ctrl+Enter or Save button → PUT `/api/admin/content/text`
- **Cancel**: Escape key or Cancel button
- **Version history**: Clock icon → modal showing all previous versions with restore

### Floating Admin Toolbar

When an admin is logged in (even on public pages), a floating toolbar appears in the bottom-right corner:
- Toggle edit mode on/off
- Link to Admin Dashboard
- Keyboard shortcuts reference (Cmd+E toggle, Esc exit)
- Sign out button

### Data Storage

Each text block is stored as a document in the `siteText` collection, keyed by its `id` (e.g., `"hero.title"`). Every edit creates a history entry in `siteTextHistory` for full version tracking.

---

## Public Pages

### Homepage (`/`)
- **Hero section** with animated blimp, gradient headline, CTA buttons, platinum sponsor bar
- All text inline-editable

### Tech Day (`/techday`)
- Conference detail page (dark theme)
- Three track cards (Emerging Industries, Founders & Investors, AI)
- Full schedule timeline with track filtering
- Speaker grid (fetched from API, 8 shown initially with "View All")
- Sponsors section by tier

### Tech Fuel (`/techfuel`)
- Pitch competition page (light theme)
- About section, timeline of key dates
- Qualifications and screening criteria (accordions)
- 4-step process visualization
- Impact stats, countdown timer
- Pitch submission CTA

### Register (`/register`)
- 3D interactive lanyard badge (React Three Fiber)
- Registration form with event/ticket selection
- FAQ section (6 questions)

### Sponsor (`/sponsor`)
- Full-screen hero with background image
- Sponsor contact/inquiry form

### Anniversary (`/anniversary`)
- Scroll-driven vertical photo carousel (45 photos)
- Parallax, scale, rotation transforms on scroll

---

## Admin Dashboard

### Access
- URL: `/admin`
- Protected by `robots.txt` (noindex, nofollow)
- Auth-gated: renders login screen if not authenticated

### Layout
- **Sidebar** (desktop: fixed 64px, mobile: hamburger overlay)
  - Two sections: **Data** and **Content**
  - Items filtered by user permissions
- **Main content area** with page-specific management UI

### Pages

| Page | Features |
|---|---|
| **Overview** (`/admin`) | Stat cards (registrations, subscribers, pitches), quick action links, system info |
| **Registrations** (`/admin/registrations`) | Table with filters (category, status, search), detail modal, CSV export, bulk delete |
| **Newsletter** (`/admin/newsletter`) | Subscriber list with status filter, CSV export, bulk delete |
| **Pitches** (`/admin/pitches`) | Submission table, status workflow (pending → reviewing → accepted/rejected), review notes, CSV export |
| **Sponsor Contacts** (`/admin/sponsor-contacts`) | Inquiry table, detail modal, status tracking, CSV export |
| **Speakers** (`/admin/speakers`) | CRUD with drag-to-reorder, image upload (URL or file via Vercel Blob), social links |
| **Schedule** (`/admin/schedule`) | CRUD sessions with type/track pickers, speaker assignment with search, auto-sort by time |
| **Sponsors** (`/admin/sponsors`) | CRUD by tier (platinum/gold/silver/bronze/community), drag-to-reorder within tier, logo upload, tier change |
| **Partners** (`/admin/partners`) | CRUD partner logos with name, website, image upload |

---

## API Routes

### Public Routes (no auth required)

| Route | Method | Purpose |
|---|---|---|
| `/api/register` | POST, GET | Submit registration, lookup by ticket/email |
| `/api/newsletter` | POST | Subscribe to newsletter |
| `/api/pitch` | POST, GET | Submit pitch, list pitches |
| `/api/sponsor-contact` | POST | Submit sponsor inquiry |
| `/api/svg` | GET | SVG proxy to avoid CORS |
| `/api/content/speakers` | GET | Fetch speakers (60s cache) |
| `/api/content/schedule` | GET | Fetch schedule (60s cache) |
| `/api/content/sponsors` | GET | Fetch sponsors by tier (60s cache) |
| `/api/content/text/[id]` | GET | Fetch single editable text block |

### Admin Routes (session cookie required)

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/auth` | POST, GET, DELETE | Login, check session, logout |
| `/api/admin/stats` | GET | Dashboard counts |
| `/api/admin/data/registrations` | GET, DELETE | List/delete registrations |
| `/api/admin/data/newsletter` | GET, DELETE | List/delete subscribers |
| `/api/admin/data/pitches` | GET, PATCH, DELETE | List/update status/delete pitches |
| `/api/admin/data/sponsor-contacts` | GET, DELETE | List/delete sponsor inquiries |
| `/api/admin/content/speakers` | GET, POST, PUT, PATCH, DELETE | CRUD + reorder speakers |
| `/api/admin/content/schedule` | GET, POST, PUT, DELETE | CRUD schedule sessions |
| `/api/admin/content/sponsors` | GET, POST, PUT, PATCH, DELETE | CRUD + reorder sponsors |
| `/api/admin/content/partners` | GET, POST, PUT, DELETE | CRUD partners |
| `/api/admin/content/text` | GET, PUT, DELETE | CRUD editable text blocks |
| `/api/admin/content/text/history/[id]` | GET | Fetch version history for a text block |
| `/api/admin/upload` | POST | Upload image to Vercel Blob |
| `/api/admin/setup` | POST, GET | First-time admin creation |
| `/api/admin/seed` | POST, GET | Seed admin users |
| `/api/admin/migrate` | POST, GET | Database migration utility |

### Common API Patterns

All public POST routes follow this pattern:
1. BotID verification (skip if `DISABLE_BOT_PROTECTION=true`)
2. Firebase availability check
3. Input validation with descriptive error messages
4. Duplicate detection (by email or ticket ID)
5. Firestore document creation
6. Confirmation email via Resend
7. Success response

All admin routes follow this pattern:
1. Session cookie verification via `verifyAdminSession()`
2. Permission check via `sessionHasPermission()`
3. Input validation
4. Firestore operation
5. Response with updated data

---

## Forms & Data Collection

### Registration Form
- **Fields**: firstName, lastName, email, category (founder/investor/attendee/student/government), company, title, events (checkbox: Tech Fuel / Tech Day / Both), dietaryRestrictions, agreeToTerms
- **On submit**: Creates registration with auto-generated ticket ID (`TD26-XXXXXX`), sends confirmation email
- **Success state**: Shows E-Ticket preview with ticket ID and barcode

### Pitch Submission Form
- **Fields**: companyName, founderName, email, phone, website, stage (pre-seed through Series B+), industry (10 categories), pitch (elevator, 50 char min), problem, solution, traction, teamSize, fundingRaised, fundingGoal, deckUrl, agreeToRules
- **On submit**: Creates pitch submission, sends confirmation email

### Sponsor Contact Form
- **Fields**: firstName, lastName, company, workEmail, phone, message
- **On submit**: Creates sponsor contact record, sends confirmation email
- **Renders as**: Modal dialog triggered from sponsor page

### Newsletter Popup
- **Fields**: email only
- **Trigger**: "Made in SA" floating button (bottom-left corner)
- **Behavior**: Auto-closes 3s after successful subscription

---

## Visual Effects & Components

### 3D / WebGL

| Component | Description | Dependencies |
|---|---|---|
| `InteractiveLanyard` | 3D draggable conference badge on a lanyard with physics (piñata swing), front/back sides | React Three Fiber, Drei |
| `WebGLBackground` | Full-viewport particle system with fog and vignette post-processing | React Three Fiber, custom shaders |
| `AdvancedParticles` | GPU-based FBO particle simulation with noise-driven animation | React Three Fiber, custom materials |

### Animations

| Component | Description |
|---|---|
| `AnimatedBlimp` | Floating blimp that crosses the screen on a 45s loop with vertical bobbing and depth blur. Clicking opens a video modal. |
| `AnniversaryCarousel` | Scroll-driven vertical photo gallery with parallax, scale, opacity, and rotation transforms |
| `PixelArrow` | Interactive SVG arrow where pixels disperse on mouse proximity (magnetic repulsion) |
| `AnimatedButton` | Button with sliding block hover animation (20 squares slide in from left) |
| `EasterEggArrow` | Hidden interactive arrow that opens video or links to anniversary page |

### UI Components

| Component | Description |
|---|---|
| `TicketBadge` | Decorative lanyard-style conference badge with barcode |
| `EventTicket` | Horizontal/vertical ticket design with QR code placeholder and perforated edges |
| `VideoModal` | Fullscreen video modal with backdrop, escape-to-close |
| `NewsletterPopup` | Floating newsletter signup with "Made in SA" branding |

---

## Bot Protection

The app uses **BotID** for spam prevention on all public form submissions.

### Setup

```tsx
// app/layout.tsx — Client-side script injection
const protectedRoutes = [
  { path: "/api/register", method: "POST" },
  { path: "/api/pitch", method: "POST" },
  { path: "/api/newsletter", method: "POST" },
  { path: "/api/sponsor-contact", method: "POST" },
]

<BotIdClient protect={protectedRoutes} />
```

```typescript
// In each API route
import { verifyBotId } from "botid"

if (process.env.DISABLE_BOT_PROTECTION !== "true") {
  const botResult = await verifyBotId(request)
  if (botResult.isBot) {
    return NextResponse.json({ error: "Bot detected" }, { status: 403 })
  }
}
```

### next.config.ts

```typescript
import { withBotId } from "botid/next"
export default withBotId(nextConfig)
```

---

## Deployment (Vercel)

### Steps

1. Push repo to GitHub
2. Import project in Vercel
3. Set all environment variables (see [Environment Variables](#environment-variables))
4. Deploy

### Vercel-Specific Features Used

- **Vercel Blob**: Image uploads from admin (speakers, sponsors, partners)
- **Vercel Analytics**: Page view tracking
- **Serverless Functions**: All API routes run as serverless
- **Edge Config**: Environment variables via `vercel env pull .env.local`

### Image Sources

The app allows remote images from these domains (configured in `next.config.ts`):

```typescript
images: {
  remotePatterns: [
    { hostname: "ampd-asset.s3.us-east-2.amazonaws.com" },
    { hostname: "devsa-assets.s3.us-east-2.amazonaws.com" },
    { hostname: "*.public.blob.vercel-storage.com" },
  ]
}
```

Update these for your own S3 buckets or CDN domains.

---

## Bootstrapping a New Event

### Step-by-Step

1. **Clone the repository**
   ```bash
   git clone <repo-url> new-event-name
   cd new-event-name
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create Firebase project**
   - Create project at [console.firebase.google.com](https://console.firebase.google.com/)
   - Enable Firestore (create named database, e.g., `"client-event-2027"`)
   - Enable Firebase Auth (Google + Email/Password providers)
   - Generate service account key
   - Create admin users in Firebase Auth console

4. **Create Resend account**
   - Sign up at [resend.com](https://resend.com)
   - Add and verify sending domain
   - Generate API key

5. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Fill in all required values
   ```

6. **Customize branding**
   - Update `app/globals.css` — primary color, fonts
   - Update `app/layout.tsx` — metadata (title, description, OG tags)
   - Update `components/navbar.tsx` — logo, nav links
   - Update `components/footer.tsx` — company info, links
   - Update `lib/email/resend.ts` — FROM_EMAIL, REPLY_TO, template branding
   - Update `lib/firebase/admin.ts` — database name
   - Update `lib/firebase/client.ts` — Google domain restriction (or remove)

7. **Customize content**
   - Update event-specific pages (`techday/`, `techfuel/`, `register/`)
   - Update form fields in `components/forms/` to match event needs
   - Update `lib/firebase/collections.ts` — adjust interfaces as needed

8. **Seed initial data**
   - Use admin dashboard to add speakers, schedule, sponsors
   - Or use `/api/admin/seed` with mock data

9. **Deploy to Vercel**
   - Push to GitHub, import in Vercel
   - Set all environment variables
   - Deploy

10. **First admin setup**
    - Visit `/admin`, sign in with your Firebase Auth credentials
    - Or use `/api/admin/setup` for first-time initialization

---

## Mock Data Strategy

For template builds with placeholder content:

### Speakers (mock)
```json
[
  { "id": "spk-1", "name": "Jane Doe", "title": "CTO", "company": "TechCorp", "bio": "Industry leader in cloud architecture...", "imageUrl": "/placeholder-speaker.jpg", "socialLinks": { "linkedin": "#", "twitter": "#" } },
  { "id": "spk-2", "name": "John Smith", "title": "Founder & CEO", "company": "StartupXYZ", "bio": "Serial entrepreneur and investor...", "imageUrl": "/placeholder-speaker.jpg" }
]
```

### Schedule (mock)
```json
[
  { "id": "sess-1", "title": "Opening Keynote", "description": "Welcome and vision for the future", "time": "09:00", "duration": 60, "room": "Main Hall", "type": "keynote", "speakerIds": ["spk-1"] },
  { "id": "sess-2", "title": "Building at Scale", "description": "Lessons from scaling to 1M users", "time": "10:30", "duration": 45, "room": "Room A", "type": "talk", "track": "emerging", "speakerIds": ["spk-2"] },
  { "id": "sess-3", "title": "Networking Lunch", "description": "", "time": "12:00", "duration": 60, "room": "Atrium", "type": "break" }
]
```

### Sponsors (mock)
```json
{
  "platinum": [{ "id": "sp-1", "name": "Major Corp", "logoUrl": "/placeholder-logo.svg", "website": "#", "tier": "platinum" }],
  "gold": [{ "id": "sp-2", "name": "Gold Partner", "logoUrl": "/placeholder-logo.svg", "website": "#", "tier": "gold" }],
  "silver": [], "bronze": [], "community": []
}
```

### Seeding Mock Data

Create a seed script or use the existing `/api/admin/seed` route. Alternatively, add mock data directly through the admin dashboard after first login.

Consider adding a `lib/mock-data.ts` file to the template with all placeholder content that can be loaded via a seed API route during initial setup.

---

## Gaps & Recommendations

### Missing Features to Add

#### 1. **Check-In System**
The registration model has a `"checked-in"` status but there's no check-in UI or QR code scanning. Recommendation:
- Add a `/admin/check-in` page with QR code scanner (use device camera)
- Generate real QR codes on the E-Ticket (currently just a placeholder barcode)
- Allow manual check-in by ticket ID or name search
- Show real-time check-in count on the dashboard

#### 2. **Email Unsubscribe Flow**
Newsletter subscribers can be set to `"unsubscribed"` in the database, but there's no unsubscribe link in emails or a public unsubscribe endpoint. Recommendation:
- Add unsubscribe link to all email templates (required by CAN-SPAM)
- Create `/api/newsletter/unsubscribe?token=xxx` route
- Generate signed unsubscribe tokens per subscriber

#### 3. **Attendee Communication / Blast Emails**
No way to send bulk emails to registered attendees (e.g., event reminders, schedule changes). Recommendation:
- Add `/admin/email` page for composing and sending bulk emails
- Template picker (reminder, update, thank you)
- Audience selector (all registrants, by event, by category)
- Use Resend's batch API

#### 4. **Event Feedback / Surveys**
No post-event feedback collection. Recommendation:
- Add a `feedback` collection and form
- Create `/feedback` page with session rating, overall experience, NPS score
- Add feedback stats to admin dashboard

#### 5. **Speaker Portal / Self-Service**
Speakers can't manage their own profile, upload presentations, or see their schedule. Recommendation:
- Add `/speaker-portal` with invite-link auth
- Allow speakers to update bio, headshot, social links
- Upload presentation slides (stored in Vercel Blob)
- View their assigned sessions

#### 6. **Agenda Builder / Personal Schedule**
Attendees can't build a personal agenda from the schedule. Recommendation:
- Add "Add to My Schedule" buttons on session cards
- Store in localStorage or behind optional attendee login
- Export to calendar (.ics file)

#### 7. **Waitlist Support**
No capacity management or waitlist when events are full. Recommendation:
- Add `maxCapacity` to event config
- Auto-close registration when full, switch to waitlist mode
- Notify waitlisted attendees when spots open

#### 8. **Multi-Event / Multi-Day Support**
The template is structured for a specific 2-day event. For true reusability:
- Make event dates, names, and venues configurable (env vars or Firestore config doc)
- Support variable number of tracks and event days
- Abstract the `techday/` and `techfuel/` pages into a generic `/events/[slug]` pattern

#### 9. **Proper Image Optimization**
Speaker/sponsor images are loaded from external URLs without Next.js Image optimization in some cases. Recommendation:
- Consistently use `next/image` with `fill` and `sizes` props
- Add image upload preprocessing (resize, compress) on the admin side
- Set up a proper CDN pattern

#### 10. **Testing**
No test files exist in the project. Recommendation:
- Add unit tests for API routes (Vitest or Jest)
- Add component tests for forms (React Testing Library)
- Add E2E tests for registration flow and admin login (Playwright)
- Add API integration tests for Firestore operations

#### 11. **Sitemap Completeness**
The sitemap only includes `/` and `/anniversary`. It should include all public pages:
- `/techday`
- `/techfuel`
- `/register`
- `/sponsor`

#### 12. **Error Boundary & Loading States**
No `error.tsx` or `loading.tsx` files in route segments. Recommendation:
- Add `app/error.tsx` for global error handling
- Add `loading.tsx` to routes with data fetching
- Add `not-found.tsx` for custom 404 page

#### 13. **Rate Limiting**
No rate limiting on public API routes. A determined actor could spam registrations. Recommendation:
- Add rate limiting middleware (Vercel's `@vercel/edge` or `upstash/ratelimit`)
- Limit by IP: e.g., 5 registrations/hour, 10 newsletter signups/hour

#### 14. **Analytics & Event Tracking**
Vercel Analytics is included for page views but there's no custom event tracking. Recommendation:
- Track form submissions, CTA clicks, section views
- Add funnel tracking (page view → form start → form complete)
- Consider Mixpanel or PostHog for deeper behavioral analytics

#### 15. **Accessibility Audit**
No documented accessibility testing or ARIA landmarks. Recommendation:
- Run Lighthouse accessibility audit
- Add `aria-label` to interactive elements (floating toolbar, modals)
- Ensure keyboard navigation works through all components
- Add skip-to-content link
- Test with screen readers

#### 16. **PWA / Offline Support**
No service worker or PWA manifest. For an event app, offline access to schedule is valuable. Recommendation:
- Add `manifest.json` for PWA
- Cache schedule and speaker data for offline viewing
- Add "Add to Home Screen" prompt

#### 17. **Internationalization (i18n)**
All content is hardcoded in English. For international events:
- Consider `next-intl` for multi-language support
- Make the inline CMS support language variants

#### 18. **Cleanup: Remove Dead Code**
- `lib/admin/config.ts` — Legacy env-based admin auth system (replaced by Firebase Auth)
- `/api/admin/migrate` — One-time migration utility, should be removed after use
- `components/conference-hero.tsx` — Appears to be an older/alternate hero component
- Mailchimp env vars (`MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`) — Not used in codebase, Resend is the email provider

---

## Quick Reference: What to Change Per Client

| Item | File(s) | What to Change |
|---|---|---|
| Event name & dates | `app/layout.tsx`, page components, `lib/email/resend.ts` | Metadata, headings, email templates |
| Primary color | `app/globals.css` | `--primary` oklch value, hex fallback |
| Fonts | `app/layout.tsx`, `app/globals.css` | Google font imports, CSS variables |
| Logo | `components/navbar.tsx`, `components/footer.tsx` | SVG/image source |
| Firebase project | `.env.local`, `lib/firebase/admin.ts` | Env vars, named database |
| Admin domain | `lib/firebase/client.ts`, `app/api/admin/auth/route.ts` | Google hosted domain param |
| Email sender | `lib/email/resend.ts` | FROM_EMAIL, REPLY_TO, template content |
| Image domains | `next.config.ts` | `remotePatterns` array |
| Bot protection routes | `app/layout.tsx` | `protectedRoutes` array |
| Registration categories | `components/forms/registration-form.tsx`, `lib/firebase/collections.ts` | Dropdown options, TypeScript types |
| Ticket ID prefix | `app/api/register/route.ts` | e.g., `TD26-` → `EVT27-` |
| Pitch form fields | `components/forms/pitch-submission-form.tsx` | Add/remove fields per event type |
| Schedule tracks | `lib/firebase/collections.ts`, `components/sections/schedule.tsx` | Track names, colors |
| Sponsor tiers | `lib/firebase/collections.ts`, `components/sections/sponsors.tsx` | Tier names, visual treatment |
| Sitemap | `app/sitemap.ts` | Add all public page URLs |
| Robots | `app/robots.ts` | Update domain |

---

*This document was generated from the Tech Day 2026 codebase as a template guide for future event applications.*

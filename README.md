# San Antonio Tech Day 2026

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router & Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Motion (Framer Motion) + React Three Fiber
- **3D Graphics:** Three.js, @react-three/drei, @react-three/rapier
- **Database:** Firebase Firestore (Admin SDK)
- **File Storage:** Vercel Blob
- **Analytics:** Vercel Analytics
- **Package Manager:** pnpm

---

## Project Structure

```
techday/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with navbar & footer
│   ├── page.tsx              # Homepage
│   ├── globals.css           # Global styles & Tailwind imports
│   ├── robots.ts             # SEO robots.txt generation
│   ├── sitemap.ts            # SEO sitemap generation
│   │
│   ├── admin/                # Admin dashboard (protected)
│   │   ├── layout.tsx        # Admin layout with auth
│   │   ├── page.tsx          # Admin dashboard home
│   │   ├── newsletter/       # Newsletter subscribers management
│   │   ├── partners/         # Partner content management
│   │   ├── pitches/          # Tech Fuel pitch submissions
│   │   ├── registrations/    # Event registrations
│   │   ├── schedule/         # Event schedule management
│   │   ├── speakers/         # Speaker management
│   │   └── sponsors/         # Sponsor management
│   │
│   ├── api/                  # API Routes
│   │   ├── admin/            # Protected admin endpoints
│   │   │   ├── auth/         # Admin authentication
│   │   │   ├── content/      # CMS CRUD operations
│   │   │   ├── data/         # Data export endpoints
│   │   │   ├── stats/        # Dashboard statistics
│   │   │   └── upload/       # File upload to Vercel Blob
│   │   ├── content/          # Public content endpoints
│   │   ├── newsletter/       # Newsletter signup
│   │   ├── pitch/            # Pitch submission
│   │   ├── register/         # Event registration
│   │   └── svg/              # Dynamic SVG generation
│   │
│   ├── anniversary/          # 10-year anniversary page
│   ├── register/             # Event registration page
│   ├── sponsor/              # Sponsorship info page
│   ├── techday/              # Main conference page
│   └── techfuel/             # Pitch competition page
│
├── components/               # React components
│   ├── admin/                # Admin UI components
│   │   ├── auth-provider.tsx # Authentication context
│   │   ├── layout.tsx        # Admin layout wrapper
│   │   ├── login.tsx         # Login form
│   │   └── sidebar.tsx       # Admin navigation
│   │
│   ├── cta/                  # Call-to-action components
│   │   ├── image-gallery.tsx
│   │   ├── keyboard-handler.tsx
│   │   └── video-modal.tsx
│   │
│   ├── forms/                # Form components
│   │   ├── pitch-submission-form.tsx
│   │   └── registration-form.tsx
│   │
│   ├── sections/             # Page section components
│   │   ├── about.tsx
│   │   ├── hero.tsx
│   │   ├── schedule.tsx
│   │   ├── speaker-card.tsx
│   │   └── sponsors.tsx
│   │
│   ├── ui/                   # Reusable UI primitives
│   │   └── animated-button.tsx
│   │
│   ├── advanced-particles.tsx    # WebGL particle effects
│   ├── animated-blimp.tsx        # 3D blimp animation
│   ├── animated-register-button.tsx
│   ├── anniversary-carousel.tsx
│   ├── anniversary-hero.tsx
│   ├── anniversary-popup.tsx
│   ├── conference-hero.tsx
│   ├── easter-eggs.tsx
│   ├── footer.tsx
│   ├── interactive-lanyard.tsx  # 3D lanyard with physics
│   ├── navbar.tsx
│   ├── newsletter-popup.tsx
│   ├── pixel-arrow.tsx
│   ├── ticket-badge.tsx
│   ├── video-modal.tsx
│   └── webgl-background.tsx
│
├── lib/                      # Utility libraries
│   ├── admin/                # Admin utilities
│   │   ├── config.ts         # Admin user configuration
│   │   └── session.ts        # Session management
│   │
│   ├── firebase/             # Firebase configuration
│   │   ├── admin.ts          # Firebase Admin SDK init
│   │   ├── collections.ts    # Firestore collection helpers
│   │   └── index.ts          # Firebase exports
│   │
│   ├── dof-points-material.ts   # Custom Three.js shader
│   ├── shader-utils.ts          # WebGL shader utilities
│   ├── simulation-material.ts   # Physics simulation shader
│   └── vignette-shaders.ts      # Post-processing shaders
│
├── docs/                     # Documentation
│   └── FIREBASE_SETUP.md     # Firebase configuration guide
│
├── public/                   # Static assets
├── .env.local                # Environment variables (local)
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **pnpm** (recommended) or npm/yarn
- **Firebase Project** with Firestore enabled (see [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md))

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/techday.git
cd techday
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Firebase Admin SDK (server-side only - KEEP SECRET)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Admin access allowlist (comma-separated). Only these addresses, with a verified
# email, can open /admin; 434media.com staff must be listed too. Unset = nobody.
ADMIN_EMAILS=someone@example.com,other@example.com

# Admin Session Secret (generate with: openssl rand -base64 32)
ADMIN_SESSION_SECRET=your-secure-random-string

# Admin Users (format: email|role|name|question|answer|pin)
ADMIN_USERS=admin@example.com|superadmin|Admin|What is 2+2?|4|1234

# Vercel Blob (for file uploads)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

> ⚠️ **Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

For detailed Firebase setup instructions, see [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md).

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## Key Features

### Public Pages
- **Homepage** (`/`) — Event overview and highlights
- **Tech Day** (`/techday`) — Main conference details, schedule, speakers
- **Tech Fuel** (`/techfuel`) — $100K pitch competition information
- **Register** (`/register`) — Event registration form
- **Sponsor** (`/sponsor`) — Sponsorship opportunities
- **Anniversary** (`/anniversary`) — 10-year celebration page

### Admin Dashboard (`/admin`)
- Protected authentication with PIN verification
- Manage registrations, pitch submissions, newsletter subscribers
- Content management for speakers, sponsors, schedule, partners
- File uploads via Vercel Blob
- Dashboard statistics and data export

### Technical Highlights
- **3D Graphics** — Interactive WebGL backgrounds with React Three Fiber
- **Physics Simulations** — Rapier physics for interactive elements
- **Animations** — Smooth page transitions with Motion
- **Server Components** — Next.js 16 App Router with RSC
- **API Routes** — RESTful endpoints for all data operations

---

## Contributing

### Branch Workflow

1. **Fork** the repository
2. **Create** a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with clear messages:
   ```bash
   git commit -m "feat: add speaker carousel component"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against `main`

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style (formatting, no logic change)
- `refactor:` — Code refactoring
- `perf:` — Performance improvements
- `test:` — Adding tests
- `chore:` — Maintenance tasks

### Code Style

- Use TypeScript for all new files
- Follow existing patterns in the codebase
- Run `pnpm lint` before committing
- Keep components focused and composable

---

## Deployment

This project is deployed on **Vercel**. Every push to `main` triggers a production deployment.

### Environment Variables on Vercel

Add the following environment variables in your Vercel project settings:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ADMIN_EMAILS` (admin allowlist; see lib/admin/allowlist.ts)
- `ADMIN_SESSION_SECRET`
- `ADMIN_USERS`
- `BLOB_READ_WRITE_TOKEN`

---

## License

This project is proprietary software for San Antonio Tech Day / Tech Bloc.

---

## Contact

For questions about contributing or the codebase, reach out to the Tech Day development team.
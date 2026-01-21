# Firebase Setup Guide for Tech Day

This application uses Google Firestore for data storage. All database operations happen server-side through the Firebase Admin SDK.

## 1. Get Service Account Credentials

You need a Google Cloud service account with Firestore access.

### Option A: Use Existing Service Account
If you already have a service account JSON key, extract these values:
- `project_id` → `FIREBASE_PROJECT_ID`
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY`

### Option B: Create New Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., "techday-2026")
4. Go to **Build → Firestore Database** → "Create database"
5. Choose **Start in production mode**, select a region
6. Go to **Project Settings → Service accounts**
7. Click "Generate new private key"
8. Save the JSON file securely

## 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
# Firebase Admin SDK (server-side only - KEEP SECRET)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Admin Session Secret (generate with: openssl rand -base64 32)
ADMIN_SESSION_SECRET=your-secure-random-string

# Admin Users (format: email|role|name|question|answer|pin)
ADMIN_USERS=jesse@434media.com|superadmin|Jesse|What year was Tech Day founded?|2023|1234
```

> ⚠️ **Important**: The `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes and use `\n` for newlines.

## 3. Set Up Firestore Security Rules

Go to **Firestore → Rules** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // All collections are server-side only (accessed via Admin SDK)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

This blocks all client-side access since we use the Admin SDK for everything.

## 4. Firestore Collections

The application uses these collections:

| Collection | Purpose |
|------------|---------|
| `registrations` | Event registration submissions |
| `newsletter` | Newsletter email subscriptions |
| `pitchSubmissions` | Startup pitch competition entries |
| `speakers` | Speaker information for the event |
| `schedule` | Event schedule and sessions |
| `sponsors` | Sponsor information and tiers |

## 5. Deploy to Vercel

Add these environment variables in your Vercel project settings:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ADMIN_SESSION_SECRET`
- `ADMIN_USERS`

## Troubleshooting

### "Firebase is not configured" error
Make sure all three Firebase environment variables are set:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### Private key format issues
The private key must:
- Be wrapped in double quotes
- Have newlines as literal `\n` characters (not actual line breaks)
- Include the full key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

import type { NextConfig } from "next";
import { withBotId } from 'botid/next/config';

// Security headers. The CSP lists only what the site actually loads: Firebase
// Storage / S3 / Vercel Blob media, Firebase Auth (admin Google popup login),
// Vercel Blob client uploads from /admin, and same-origin BotID and Vercel
// Analytics. Scripts and styles keep 'unsafe-inline' because the pages are
// static and Next's inline flight scripts have no nonce; every other directive
// is locked down. img-src allows any https: host because admins can paste an
// arbitrary logo URL for partners (app/admin/partners).
const isPreview = process.env.VERCEL_ENV === "preview";
const isDev = process.env.NODE_ENV === "development";
// The Vercel toolbar is injected on preview deployments only.
const toolbar = isPreview ? " https://vercel.live" : "";
// Firebase Auth's signInWithPopup uses a hidden iframe on the auth domain.
const firebaseAuthFrame = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  ? ` https://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`
  : "";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://apis.google.com${toolbar}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  `font-src 'self' data:${toolbar}`,
  "media-src 'self' https://storage.googleapis.com",
  "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://vercel.com https://*.blob.vercel-storage.com" +
    (isPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""),
  `frame-src${firebaseAuthFrame} https://accounts.google.com${toolbar}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      // Tech Day's own bucket in c434-techday (Security Policy 7.2 move).
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/c434-techday.firebasestorage.app/**",
      },
      {
        protocol: "https",
        hostname: "devsa-assets.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withBotId(nextConfig);

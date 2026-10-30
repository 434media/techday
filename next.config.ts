import type { NextConfig } from "next";
import { withBotId } from 'botid/next/config';

const nextConfig: NextConfig = {
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
      // The old copy in 434's project. Kept only until the switch's dry run
      // shows no Firestore content still pointing here; remove it before the
      // old copy is deleted (switch + 7 days).
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/groovy-ego-462522-v2.firebasestorage.app/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/groovy-ego-462522-v2.firebasestorage.app/**",
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
};

export default withBotId(nextConfig);

import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://sanantoniotechday.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/", "/semifinals-judges/", "/semifinals-pitches/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended", "PerplexityBot", "ClaudeBot", "Applebot-Extended"],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/private/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

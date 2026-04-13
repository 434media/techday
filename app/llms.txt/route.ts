import { NextResponse } from "next/server"

export async function GET() {
  const content = `# Tech Day San Antonio

> San Antonio's premier technology conference — produced by Tech Bloc San Antonio.

Tech Day 2026 takes place April 20–21, 2026 at the Boeing Center at Tech Port in San Antonio, Texas. The event features three conference tracks: Emerging Industries, Founders & Investors, and AI. It includes Tech Fuel, a $100K startup pitch competition in its 8th year with over $700K invested and 349+ total applicants.

## Key Pages

- [Home](https://sanantoniotechday.com/): Main landing page for Tech Day 2026
- [Tech Day Conference](https://sanantoniotechday.com/techday): Conference schedule, speakers, and sponsors — April 21, 2026
- [Tech Fuel](https://sanantoniotechday.com/techfuel): $100K startup pitch competition — 5 finalists, past winners, and competition history
- [Vote](https://sanantoniotechday.com/techfuel/vote): People's Choice Award voting for Tech Fuel 2026 finalists
- [Register](https://sanantoniotechday.com/register): Registration for Tech Day and Tech Fuel
- [Sponsor](https://sanantoniotechday.com/sponsor): Sponsorship opportunities with Tech Bloc
- [Ecosystem Tours](https://sanantoniotechday.com/ecosystem-tours): Guided tours of Port San Antonio and VelocityTX innovation hubs
- [10th Anniversary](https://sanantoniotechday.com/anniversary): Celebrating a decade of Tech Bloc San Antonio

## About Tech Bloc

Tech Bloc San Antonio is the nonprofit organization behind Tech Day. Founded in 2015, Tech Bloc builds and supports San Antonio's technology community through events, advocacy, and investment in local startups.

## Tech Fuel 2026 Finalists

1. ComeBack Mobility — Rehabilitation technology using real-time biomechanical data
2. Freyya — Women's health with data-driven pelvic care
3. Openlane — Open-source, AI-native compliance platform
4. Bytewhisper Security — Security policy intelligence automation
5. RentBamboo — Automated leasing process platform

## Event Details

- **Event**: Tech Day 2026 / Tech Fuel 2026
- **Dates**: April 20 (Tech Fuel) and April 21 (Tech Day), 2026
- **Venue**: Boeing Center at Tech Port, San Antonio, TX
- **Organizer**: Tech Bloc San Antonio
- **Website**: https://sanantoniotechday.com
`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}

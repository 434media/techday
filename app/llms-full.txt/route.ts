import { NextResponse } from "next/server"

export async function GET() {
  const content = `# Tech Day San Antonio — Full Documentation

> San Antonio's premier technology conference — produced by Tech Bloc San Antonio. This document provides comprehensive information about Tech Day 2026 for AI assistants and language models.

---

## Organization

**Tech Bloc San Antonio** is a 501(c)(4) nonprofit organization founded in 2015. Tech Bloc builds and supports San Antonio's technology community through events, advocacy, workforce development, and investment in local startups. Tech Bloc produces Tech Day, the city's largest annual technology conference.

---

## Tech Day 2026

**Tech Day** is San Antonio's premier technology conference, branded under the tagline "Invented Here."

- **Date**: April 21, 2026
- **Time**: Doors open at 12:30 PM; program runs 1:00 PM – 4:00 PM
- **Venue**: Boeing Center at Tech Port, San Antonio, TX
- **Tracks**: Three concurrent tracks:
  1. **Emerging Industries** — Cyber, aerospace, advanced manufacturing, bioscience
  2. **Founders & Investors** — Startup ecosystem, venture capital, angel investing
  3. **AI** — Applied artificial intelligence, enterprise AI, generative AI
- **Format**: Keynote speakers, panel discussions, networking
- **Registration**: Free — https://sanantoniotechday.com/register
- **Website**: https://sanantoniotechday.com/techday

---

## Tech Fuel 2026

**Tech Fuel** is San Antonio's flagship startup pitch competition, now in its 8th year.

### Competition Stats
- **Total invested**: $700,000+
- **Total applicants across all years**: 349+
- **2026 prize pool**: $100,000
- **2026 applicants**: 75+
- **2026 semi-finalists**: 25
- **2026 finalists**: 5

### 2026 Competition Process
1. **75+ applications** from startups across Bexar County
2. **25 semi-finalists** placed into 5 groups for private Zoom pitch sessions with 4–5 judges each
3. **5 finalists** — one selected from each judging panel
4. **Finals on April 20, 2026** — in-person at UTSA SP1 with 5-minute pitches and 10-minute Q&A before 5 judges

### 2026 Finalists
1. **ComeBack Mobility** — Rehabilitation technology using real-time biomechanical data to guide safer, faster recovery. Website: https://www.comebackmobility.com
2. **Freyya** — Advancing women's health with real-time, data-driven pelvic care. Website: https://www.freyya.com
3. **Openlane** — Open-source, AI-native platform helping companies get compliant faster. Website: https://www.theopenlane.io
4. **Bytewhisper Security** — Turning security policies into actionable intelligence, analyzed and improved in hours, not weeks. Website: https://www.bytewhispersecurity.com
5. **RentBamboo** — Automating the leasing process from first inquiry to signed lease. Website: https://www.rentbamboo.com

### People's Choice Award
Attendees can vote for their favorite finalist at https://sanantoniotechday.com/techfuel/vote

### Past Winners
| Year | 1st Place | 2nd Place | 3rd Place | Applicants |
|------|-----------|-----------|-----------|------------|
| 2024 | Axicle | Balam | Wild Forge | 54 |
| 2023 | M Aerospace RTC | Kaleido | MedCognition | 59 |
| 2022 | Sensytec | — | — | 82 |

---

## Ecosystem Tours

During Tech Fuel (April 20, 2026), attendees can participate in guided tours of San Antonio's innovation hubs:

1. **Port San Antonio** — A 1,900-acre industrial campus and one of the nation's leading hubs for cyber, aerospace, and advanced manufacturing
2. **VelocityTX** — An internationally recognized bioscience innovation campus for translational research and commercialization

These tours are included with Tech Fuel registration. Sign up: https://sanantoniotechday.com/ecosystem-tours

---

## Sponsorship

Organizations can partner with Tech Bloc to sponsor Tech Day and Tech Fuel 2026. Sponsors gain visibility among hundreds of San Antonio technologists, founders, and investors.

Sponsorship inquiries: https://sanantoniotechday.com/sponsor

---

## 10th Anniversary

2025 marked Tech Bloc San Antonio's 10th anniversary — a decade of building and supporting the San Antonio technology community.

Learn more: https://sanantoniotechday.com/anniversary

---

## Contact & Links

- **Website**: https://sanantoniotechday.com
- **Organization**: Tech Bloc San Antonio
- **Location**: San Antonio, Texas, USA
- **Sitemap**: https://sanantoniotechday.com/sitemap.xml
`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}

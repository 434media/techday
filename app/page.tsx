import { AnniversaryPopup } from "@/components/anniversary-popup"
import { ConferenceHero } from "../components/conference-hero"
import { NewsletterPopup } from "../components/newsletter-popup"

export default function Home() {
  return (
    <main className="h-screen overflow-hidden">
      <ConferenceHero />
      <AnniversaryPopup />
      <NewsletterPopup />
    </main>
  )
}

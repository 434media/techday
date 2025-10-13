import { Navbar } from "@/components/navbar"
import { AnniversaryHero } from "../../components/anniversary-hero"

export default function AnniversaryPage() {
  return (
    <>
      <Navbar />
      <main className="h-screen overflow-hidden -mt-16 md:mt-0 pt-8 pb-8 md:pt-20 md:pb-16">
        <AnniversaryHero />
      </main>
    </>
  )
}

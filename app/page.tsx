import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Sponsors } from "@/components/sections/sponsors"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Sponsors />
    </main>
  )
}

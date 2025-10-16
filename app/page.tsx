import { AnniversaryCarousel } from "@/components/anniversary-carousel"
import { WebGLBackground } from "@/components/webgl-background"

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center relative"
      role="main"
      aria-label="Tech Bloc 10 Year Anniversary"
    >
      <WebGLBackground />
      <AnniversaryCarousel />
    </main>
  )
}

import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
                alt="Tech Day 10 Years"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <div>
                <p className="text-xs text-primary font-semibold tracking-wide">San Antonio</p>
                <p className="font-bold text-xl leading-none tracking-tight">TECH DAY</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The technology conference focused on founders, startups and the future of San Antonio&apos;s tech ecosystem.
            </p>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-semibold text-foreground mb-5 text-xs uppercase tracking-widest">Events</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/techday" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Tech Day
                </Link>
              </li>
              <li>
                <Link href="/techfuel" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Tech Fuel
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-5 text-xs uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/techfuel#submit" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Submit Pitch
                </Link>
              </li>
              <li>
                <Link href="/sponsor" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Become a Sponsor
                </Link>
              </li>
              <li>
                <a href="https://satechbloc.com/" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  SA Tech Bloc
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-foreground mb-5 text-xs uppercase tracking-widest">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://twitter.com/SATechBloc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/sa-tech-bloc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/techbloc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Instagram
                </a>
              </li>              
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Tech Bloc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Built by</span>
            <a 
              href="https://digitalcanvas.community" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              Digital Canvas
            </a>
            <span className="text-muted-foreground/50">×</span>
            <a 
              href="https://434media.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              434 MEDIA
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
                alt="Tech Day 10 Years"
                width={48}
                height={48}
                className="h-10 w-auto"
              />
              <div>
                <p className="font-mono text-xs text-primary font-medium">2026</p>
                <p className="font-bold text-lg leading-tight">TECH DAY</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Invented Here. San Antonio&apos;s premier technology conference.
            </p>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Events</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/techday" className="hover:text-primary transition-colors font-medium">
                  Tech Day
                </Link>
              </li>
              <li>
                <Link href="/techfuel" className="hover:text-primary transition-colors font-medium">
                  Tech Fuel
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary transition-colors font-medium">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/tech-fuel#submit" className="hover:text-primary transition-colors font-medium">
                  Submit Pitch
                </Link>
              </li>
              <li>
                <Link href="#sponsors" className="hover:text-primary transition-colors font-medium">
                  Become a Sponsor
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-primary transition-colors font-medium">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Connect</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://twitter.com/techday"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors font-medium"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/techday"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors font-medium"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:hello@techday.sa" className="hover:text-primary transition-colors font-medium">
                  hello@techday.sa
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; 2026 Tech Day San Antonio. All rights reserved.</p>
          <p className="text-sm text-muted-foreground font-mono font-medium">Hecho en San Antonio</p>
        </div>
      </div>
    </footer>
  )
}

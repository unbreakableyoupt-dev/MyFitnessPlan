import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 group-hover:bg-orange-400 transition-colors">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-100">
              Program<span className="text-orange-500">Forge</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#how-it-works" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              How it works
            </a>
            <a href="#pricing" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-zinc-400 hover:text-zinc-100 transition-colors">
              FAQ
            </a>
          </div>

          {/* CTA */}
          <Link
            href="/questionnaire"
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400 transition-colors"
          >
            Build My Program
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

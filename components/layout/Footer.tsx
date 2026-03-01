import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-base text-zinc-100">
              Program<span className="text-orange-500">Forge</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors">
              Terms
            </a>
            <a href="mailto:support@programforge.io" className="hover:text-zinc-300 transition-colors">
              Support
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} ProgramForge. All rights reserved.
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-700">
          ProgramForge uses AI to generate personalized fitness programs. Always consult a healthcare
          professional before starting a new exercise regimen.
        </p>
      </div>
    </footer>
  )
}

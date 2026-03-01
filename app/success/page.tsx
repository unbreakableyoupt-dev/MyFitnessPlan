import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Download, Mail, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Your Program is Ready — ProgramForge',
  description: 'Your personalized training program has been generated and is ready to download.',
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex h-14 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-base text-zinc-100">
                Program<span className="text-orange-500">Forge</span>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <div className="absolute -inset-2 rounded-full bg-green-500/10 blur-xl" />
            </div>
          </div>

          {/* Success message */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 mb-3">
            Your Program is{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Ready!
            </span>
          </h1>
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            Payment confirmed. Your personalized program has been generated and is ready to download.
          </p>

          {/* Action cards */}
          <div className="space-y-3 mb-8">
            {/* Download button */}
            <a
              href="#" // TODO: Replace with actual PDF URL from Stripe session
              className="flex items-center gap-4 rounded-2xl border border-orange-500 bg-orange-500/10 px-6 py-4 text-left hover:bg-orange-500/20 transition-all duration-200 group"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/20">
                <Download className="h-6 w-6 text-orange-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="font-bold text-zinc-100">Download Your Program</p>
                <p className="text-sm text-zinc-500">Click to download your PDF immediately</p>
              </div>
            </a>

            {/* Email notice */}
            <div className="flex items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800">
                <Mail className="h-6 w-6 text-zinc-400" />
              </div>
              <div>
                <p className="font-semibold text-zinc-200">Check Your Email</p>
                <p className="text-sm text-zinc-500">We&apos;ve also sent the PDF to your email address</p>
              </div>
            </div>
          </div>

          {/* What's in your program */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 mb-8 text-left">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">
              Your program includes
            </h2>
            <ul className="space-y-2.5">
              {[
                'Personalized training split & weekly schedule',
                'Exercise prescription for every session',
                '12-week progressive overload plan',
                'Warm-up & mobility recommendations',
                'Form cues for key compound movements',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="h-5 w-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-400 text-xs font-bold">✓</span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-left mb-8">
            <p className="text-sm font-semibold text-zinc-300 mb-3">💡 Getting Started Tips</p>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>→ Save the PDF to your phone for easy gym access</li>
              <li>→ Track your workouts using a notes app or notebook</li>
              <li>→ Follow the progression plan — don&apos;t skip ahead</li>
              <li>→ Rest days are programmed intentionally — respect them</li>
            </ul>
          </div>

          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            ← Back to ProgramForge
          </Link>
        </div>
      </main>
    </div>
  )
}

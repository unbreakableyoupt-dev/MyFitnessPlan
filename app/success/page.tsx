'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap, Download, Mail, CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const [programText, setProgramText] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)

  useEffect(() => {
    setProgramText(sessionStorage.getItem('programforge_program_text'))
    setGeneratedAt(sessionStorage.getItem('programforge_generated_at'))
  }, [])

  const formattedDate = generatedAt
    ? new Date(generatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col pb-24">
      {/* Nav */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex h-14 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-base text-zinc-100">
                My<span className="text-orange-500">Fitness</span>Plan
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">

          {/* Success header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <div className="absolute -inset-2 rounded-full bg-green-500/10 blur-xl" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 mb-2">
              Your Program is{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Ready!
              </span>
            </h1>
            {formattedDate && (
              <p className="text-sm text-zinc-600 mt-1">Generated on {formattedDate}</p>
            )}
          </div>

          {/* Email CTA */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 mb-8">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800">
              <Mail className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">Check Your Email</p>
              <p className="text-xs text-zinc-500">
                Your PDF will be emailed once delivery is configured — view it below in the meantime.
              </p>
            </div>
          </div>

          {/* Program content */}
          {programText ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Your Program</span>
              </div>
              <div className="p-6">
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed font-sans">
                  {programText}
                </pre>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <p className="text-zinc-500 text-sm">
                Your personalized program has been generated and is ready to download.
              </p>
            </div>
          )}

          {/* Getting started */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 mt-6 mb-8">
            <p className="text-sm font-semibold text-zinc-300 mb-3">Getting Started</p>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 flex-shrink-0">→</span>
                Follow Phase 1 exactly — resist the urge to jump ahead
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 flex-shrink-0">→</span>
                Log every session: weight used, reps completed, RPE felt
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 flex-shrink-0">→</span>
                Respect your deload weeks — they&apos;re when real progress locks in
              </li>
            </ul>
          </div>

          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Back to MyFitnessPlan
          </Link>
        </div>
      </main>

      {/* Sticky download bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto max-w-3xl flex items-center gap-3">
          <a
            href="#"
            className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-orange-500 hover:bg-orange-400 px-5 py-3 transition-colors group"
          >
            <Download className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white text-sm">Download Program PDF</span>
          </a>
          <p className="text-xs text-zinc-600 hidden sm:block flex-shrink-0">PDF rendering coming soon</p>
        </div>
      </div>
    </div>
  )
}

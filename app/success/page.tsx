'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap, Download, Mail, CheckCircle } from 'lucide-react'

function renderInline(text: string): (string | React.ReactElement)[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="text-zinc-100 font-semibold">{part.slice(2, -2)}</strong>
      : part
  )
}

function renderMarkdown(text: string): React.ReactElement[] {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return (
        <h2 key={i} className="text-base font-bold text-orange-400 mt-6 mb-1 pb-1 border-b border-zinc-800">
          {line.slice(3)}
        </h2>
      )
    }
    if (line.startsWith('### ')) {
      return (
        <h3 key={i} className="text-sm font-bold text-zinc-200 mt-4 mb-1">
          {line.slice(4)}
        </h3>
      )
    }
    if (line.trim() === '') {
      return <div key={i} className="h-1" />
    }
    return (
      <p key={i} className="text-sm text-zinc-300 leading-relaxed">
        {renderInline(line)}
      </p>
    )
  })
}

import React from 'react'

export default function SuccessPage() {
  const [programText, setProgramText] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    setProgramText(sessionStorage.getItem('programforge_program_text'))
    setGeneratedAt(sessionStorage.getItem('programforge_generated_at'))
    try {
      const raw = sessionStorage.getItem('programforge_form')
      if (raw) {
        const form = JSON.parse(raw)
        if (form.email) setUserEmail(form.email)
      }
    } catch {}
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

          {/* Email status */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 mb-8">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800">
              <Mail className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">PDF Sent to Your Email</p>
              <p className="text-xs text-zinc-500">
                {userEmail
                  ? <>A PDF copy was sent to <span className="text-zinc-300 font-medium">{userEmail}</span> — check your inbox.</>
                  : 'Check your inbox for the PDF copy of your program.'}
              </p>
            </div>
          </div>

          {/* Program content */}
          {programText ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Your Program</span>
              </div>
              <div className="p-6 space-y-0.5">
                {renderMarkdown(programText)}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <p className="text-zinc-500 text-sm">
                Your personalized program has been generated and is ready to download.
              </p>
            </div>
          )}

          {/* ─── RPE / RIR Guide ─────────────────────────────────────── */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden mt-6">
            <div className="px-5 py-4 border-b border-zinc-800">
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                Understanding RPE &amp; RIR
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Your program uses these scales to control <em>how hard</em> to push — not just how many reps.
                Mastering them is the key to long-term progress.
              </p>
            </div>

            <div className="p-5 space-y-6">

              {/* RPE table */}
              <div>
                <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-2">
                  RPE — Rate of Perceived Exertion (scale 1–10)
                </h3>
                <p className="text-xs text-zinc-400 mb-3">
                  RPE measures effort on a 1–10 scale. The key insight: it auto-regulates for your daily readiness.
                  On a poor sleep night, lifting the same RPE 7 weight as usual is still correct — your body sets the number.
                </p>
                <div className="rounded-xl border border-zinc-800 overflow-hidden">
                  {[
                    { rpe: '6',   feel: '4+ reps left in the tank — very easy',          when: 'Warm-up sets' },
                    { rpe: '7',   feel: '3 reps left — working but fully controlled',     when: 'Phase 1 base work' },
                    { rpe: '8',   feel: '2 reps left — hard, technique stays solid',      when: 'Phase 2 main lifts' },
                    { rpe: '8.5', feel: '1–2 reps left — very hard',                      when: 'Phase 3 strength' },
                    { rpe: '9',   feel: '1 rep left — maximum effort for reps',           when: 'PR week attempts' },
                    { rpe: '10',  feel: 'Nothing left — true muscular failure',           when: '1RM testing only' },
                  ].map(({ rpe, feel, when }, i) => (
                    <div
                      key={rpe}
                      className={`grid grid-cols-[3rem_1fr_auto] items-center gap-3 px-4 py-2.5 text-xs ${
                        i % 2 === 0 ? 'bg-zinc-800/40' : ''
                      }`}
                    >
                      <span className="font-bold text-orange-400">RPE {rpe}</span>
                      <span className="text-zinc-300">{feel}</span>
                      <span className="text-zinc-600 hidden sm:block text-right">{when}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIR table */}
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">
                  RIR — Reps In Reserve
                </h3>
                <p className="text-xs text-zinc-400 mb-3">
                  RIR is the inverse of RPE expressed directly as reps. &ldquo;RIR 2&rdquo; means you had exactly 2 reps
                  left before form broke down. Use whichever feels more intuitive — they mean the same thing:
                </p>
                <div className="rounded-xl border border-zinc-800 overflow-hidden">
                  {[
                    { rir: 'RIR 3', rpe: 'RPE 7',  feel: 'Could have done 3 more clean reps with perfect form' },
                    { rir: 'RIR 2', rpe: 'RPE 8',  feel: 'Could have done 2 more reps before form would slip' },
                    { rir: 'RIR 1', rpe: 'RPE 9',  feel: 'One rep away from failure — working at max capacity' },
                    { rir: 'RIR 0', rpe: 'RPE 10', feel: 'Failure — the rep either didn\'t happen or form broke' },
                  ].map(({ rir, rpe, feel }, i) => (
                    <div
                      key={rir}
                      className={`grid grid-cols-[4rem_4rem_1fr] items-center gap-3 px-4 py-2.5 text-xs ${
                        i % 2 === 0 ? 'bg-zinc-800/40' : ''
                      }`}
                    >
                      <span className="font-bold text-amber-400">{rir}</span>
                      <span className="text-zinc-500">{rpe}</span>
                      <span className="text-zinc-300">{feel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to use */}
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                <p className="text-xs font-bold text-orange-300 uppercase tracking-wide mb-2">
                  How to Use RPE/RIR in Your Workouts
                </p>
                <ol className="space-y-1.5 text-xs text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold flex-shrink-0">1.</span>
                    <span>Note the target RPE before each set — e.g. &ldquo;4×6 @ RPE 7&rdquo; means you should feel 3 reps left after each set.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold flex-shrink-0">2.</span>
                    <span>After the set, immediately ask: &ldquo;How many more reps could I have done with good form?&rdquo; — that number is your RIR.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold flex-shrink-0">3.</span>
                    <span><strong className="text-zinc-300">Too light (RIR 4+):</strong> Increase the weight on your next set or next session.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold flex-shrink-0">4.</span>
                    <span><strong className="text-zinc-300">Too heavy (RIR 0 when target was RIR 2+):</strong> Reduce load by 5–10% immediately.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold flex-shrink-0">5.</span>
                    <span><strong className="text-zinc-300">Progression rule:</strong> Hit the top of your rep range at the target RPE for 2 sessions in a row → add the smallest available weight increment.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 font-bold flex-shrink-0">6.</span>
                    <span>On deload weeks, use RPE 5–6 regardless of load. If it feels easy, that&apos;s the point.</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

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
          <p className="text-xs text-zinc-600 hidden sm:block flex-shrink-0">PDF also sent to your email</p>
        </div>
      </div>
    </div>
  )
}

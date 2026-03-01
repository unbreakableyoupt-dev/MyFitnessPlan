'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap, Download, Mail, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { GeneratedProgram, ProgramPhase } from '@/lib/programTypes'
import { cn } from '@/lib/utils'

// ─── Phase Card (collapsible) ─────────────────────────────────────────────────

function PhaseCard({ phase }: { phase: ProgramPhase }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div>
          <p className="font-bold text-zinc-100">{phase.phaseLabel}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{phase.focus}</p>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-zinc-500 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-zinc-500 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 divide-y divide-zinc-800/60">
          {phase.days.map((day) => (
            <div key={day.dayNumber} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-orange-300">{day.dayName}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{day.focus}</p>
                </div>
                <span className="text-xs text-zinc-600 flex-shrink-0">{day.sessionDuration} min</span>
              </div>
              <div className="space-y-1.5">
                {day.exercises.map((ex) => (
                  <div
                    key={ex.order}
                    className="flex items-start gap-3 rounded-lg bg-zinc-800/50 px-3 py-2.5"
                  >
                    <span className="text-xs text-zinc-600 w-4 flex-shrink-0 mt-0.5">{ex.order}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200">{ex.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {ex.sets}×{ex.reps} · RPE {ex.rpe} · {ex.rest} rest
                        {ex.notes && (
                          <> · <span className="text-zinc-600 italic">{ex.notes}</span></>
                        )}
                      </p>
                    </div>
                    <span className="text-[10px] text-zinc-600 bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded flex-shrink-0 whitespace-nowrap">
                      {ex.pattern}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SuccessPage() {
  const [program, setProgram] = useState<GeneratedProgram | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('programforge_program')
    const ts = sessionStorage.getItem('programforge_generated_at')
    if (raw) {
      try {
        setProgram(JSON.parse(raw))
      } catch {
        // Silently fall through — show generic success view
      }
    }
    if (ts) setGeneratedAt(ts)
  }, [])

  const formattedDate = generatedAt
    ? new Date(generatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

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
            <p className="text-zinc-400 mt-3 max-w-lg mx-auto">
              {program
                ? `Your ${program.program.split} program is fully built — ${program.program.phasedWeeks.length} phases across 12 weeks.`
                : 'Your personalized program has been generated and is ready to download.'}
            </p>
          </div>

          {/* Download + Email CTAs */}
          <div className="space-y-3 mb-10">
            <a
              href="#"
              className="flex items-center gap-4 rounded-2xl border border-orange-500 bg-orange-500/10 px-6 py-4 hover:bg-orange-500/20 transition-all duration-200 group"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/20">
                <Download className="h-6 w-6 text-orange-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="font-bold text-zinc-100">Download Your Program PDF</p>
                <p className="text-sm text-zinc-500">
                  PDF rendering coming in next phase — program data is ready
                </p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800">
                <Mail className="h-6 w-6 text-zinc-400" />
              </div>
              <div>
                <p className="font-semibold text-zinc-200">Check Your Email</p>
                <p className="text-sm text-zinc-500">
                  Email delivery will be sent once PDF + Nodemailer are wired up
                </p>
              </div>
            </div>
          </div>

          {/* ── Real program preview ─────────────────────────────────── */}
          {program && (
            <div className="space-y-6 mb-10">
              {/* Overview stats */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                  Program Overview
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Split', value: program.program.split },
                    { label: 'Frequency', value: `${program.program.daysPerWeek} days/week` },
                    { label: 'Duration', value: program.overview.programDuration },
                    { label: 'Phases', value: `${program.program.phasedWeeks.length} phases` },
                    { label: 'Progression', value: program.progression.method },
                    { label: 'Deload', value: program.deload.frequency },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-zinc-800 p-3">
                      <p className="text-xs text-zinc-500 mb-0.5">{stat.label}</p>
                      <p className="text-sm font-semibold text-zinc-200">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed italic border-t border-zinc-800 pt-4">
                  &ldquo;{program.overview.philosophy}&rdquo;
                </p>
              </div>

              {/* Key principles */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                  Key Programming Principles
                </h2>
                <ul className="space-y-2.5">
                  {program.overview.keyPrinciples.map((principle, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                        <span className="text-orange-400 text-[10px] font-bold">{i + 1}</span>
                      </span>
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phased training (collapsible) */}
              <div>
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                  Your Training Program
                </h2>
                <div className="space-y-2">
                  {program.program.phasedWeeks.map((phase) => (
                    <PhaseCard key={phase.phase} phase={phase} />
                  ))}
                </div>
              </div>

              {/* Progression */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                  Progression System
                </h2>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold mb-3">
                  {program.progression.method}
                </span>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {program.progression.overview}
                </p>
                <ul className="space-y-2 border-t border-zinc-800 pt-4">
                  {program.progression.rules.map((rule, i) => (
                    <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                      <span className="text-orange-400 flex-shrink-0">→</span>
                      {rule}
                    </li>
                  ))}
                </ul>
                {program.progression.rpeExplanation && (
                  <div className="mt-4 rounded-lg bg-zinc-800/50 p-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 mb-1">What is RPE?</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {program.progression.rpeExplanation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 mb-1">What is RIR?</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {program.progression.rirExplanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Deload */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                  Deload Protocol
                </h2>
                <p className="text-sm font-semibold text-orange-300 mb-2">{program.deload.frequency}</p>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{program.deload.rationale}</p>
                <div className="rounded-lg bg-zinc-800 p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                      Example Deload Adjustments
                    </p>
                    <ul className="space-y-1">
                      {program.deload.deloadWeekExample.adjustments.map((adj, i) => (
                        <li key={i} className="text-sm text-zinc-400">
                          · {adj}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-zinc-700 pt-3">
                    <p className="text-xs text-zinc-500 italic">
                      {program.deload.deloadWeekExample.mindset}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nutrition (if included) */}
              {program.nutrition.included && program.nutrition.dailyCalories && (
                <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6">
                  <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                    Nutrition Plan
                  </h2>

                  {/* Calorie + macro grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <div className="rounded-lg bg-zinc-900 p-3 text-center col-span-2 sm:col-span-1">
                      <p className="text-2xl font-black text-orange-400">
                        {program.nutrition.dailyCalories.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">Daily Calories</p>
                    </div>
                    {program.nutrition.macros && (
                      <>
                        {[
                          {
                            label: 'Protein',
                            grams: program.nutrition.macros.protein.grams,
                            perMeal: program.nutrition.macros.protein.perMeal,
                            color: 'text-blue-400',
                          },
                          {
                            label: 'Carbs',
                            grams: program.nutrition.macros.carbs.grams,
                            perMeal: program.nutrition.macros.carbs.perMeal,
                            color: 'text-green-400',
                          },
                          {
                            label: 'Fats',
                            grams: program.nutrition.macros.fats.grams,
                            perMeal: program.nutrition.macros.fats.perMeal,
                            color: 'text-yellow-400',
                          },
                        ].map((macro) => (
                          <div key={macro.label} className="rounded-lg bg-zinc-900 p-3 text-center">
                            <p className={cn('text-2xl font-black', macro.color)}>
                              {macro.grams}g
                            </p>
                            <p className="text-xs text-zinc-500">{macro.label}</p>
                            <p className="text-[10px] text-zinc-600 mt-0.5">{macro.perMeal}/meal</p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Hand portions (if applicable) */}
                  {program.nutrition.handPortions && (
                    <div className="mb-5 rounded-lg bg-zinc-900 p-4">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                        Hand-Portion Guide
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { emoji: '🤚', label: 'Protein', value: program.nutrition.handPortions.protein },
                          { emoji: '👐', label: 'Carbs', value: program.nutrition.handPortions.carbs },
                          { emoji: '👍', label: 'Fats', value: program.nutrition.handPortions.fats },
                          { emoji: '✊', label: 'Vegetables', value: program.nutrition.handPortions.vegetables },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-2 text-sm">
                            <span className="text-base">{item.emoji}</span>
                            <div>
                              <p className="text-xs text-zinc-500">{item.label}</p>
                              <p className="text-zinc-300 font-medium">{item.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meal timing */}
                  {program.nutrition.mealTiming && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                        Meal Timing
                      </p>
                      <ul className="space-y-1.5">
                        {program.nutrition.mealTiming.map((meal, i) => (
                          <li key={i} className="text-sm text-zinc-400">
                            · {meal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Supplements */}
                  {program.nutrition.supplements && (
                    <div className="rounded-lg bg-zinc-900 p-4">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                        Supplement Stack
                      </p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-zinc-600 mb-1.5">Foundational (Recommended)</p>
                          <ul className="space-y-1">
                            {program.nutrition.supplements.foundational.map((s, i) => (
                              <li key={i} className="text-sm text-zinc-400">
                                · {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {program.nutrition.supplements.optional.length > 0 && (
                          <div className="border-t border-zinc-800 pt-3">
                            <p className="text-xs text-zinc-600 mb-1.5">Optional / Advanced</p>
                            <ul className="space-y-1">
                              {program.nutrition.supplements.optional.map((s, i) => (
                                <li key={i} className="text-sm text-zinc-500">
                                  · {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {program.nutrition.bodyFatNotes && (
                    <p className="mt-4 text-xs text-zinc-500 italic border-t border-orange-500/20 pt-4">
                      {program.nutrition.bodyFatNotes}
                    </p>
                  )}
                </div>
              )}

              {/* FAQ */}
              {program.faq.length > 0 && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                  <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                    Program FAQ
                  </h2>
                  <div className="space-y-5 divide-y divide-zinc-800">
                    {program.faq.map((item, i) => (
                      <div key={i} className={i > 0 ? 'pt-5' : ''}>
                        <p className="text-sm font-semibold text-zinc-200 mb-1.5">{item.question}</p>
                        <p className="text-sm text-zinc-500 leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Getting started tips */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 mb-8">
            <p className="text-sm font-semibold text-zinc-300 mb-3">💡 Getting Started</p>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>→ Follow Phase 1 exactly — resist the urge to jump ahead</li>
              <li>→ Log every session: weight used, reps completed, RPE felt</li>
              <li>→ Respect your deload weeks — they&apos;re when real progress is locked in</li>
              <li>→ Questions about the program? Refer to the FAQ section above</li>
            </ul>
          </div>

          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
            ← Back to ProgramForge
          </Link>
        </div>
      </main>
    </div>
  )
}

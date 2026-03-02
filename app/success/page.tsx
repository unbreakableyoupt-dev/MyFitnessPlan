'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Zap, Download, Mail, CheckCircle, ChevronDown, ChevronRight,
  Dumbbell, TrendingUp, RefreshCw, Apple, HelpCircle, Flame,
} from 'lucide-react'
import { GeneratedProgram, ProgramPhase } from '@/lib/programTypes'
import { cn } from '@/lib/utils'

// ─── Movement pattern badge colors ───────────────────────────────────────────

const PATTERN_COLORS: Record<string, string> = {
  'Squat':             'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'Hinge':             'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Horizontal Push':   'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Horizontal Pull':   'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Vertical Push':     'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Vertical Pull':     'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Single-Leg':        'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Core':              'bg-green-500/20 text-green-300 border-green-500/30',
}

function patternBadgeClass(pattern: string): string {
  return PATTERN_COLORS[pattern] ?? 'bg-zinc-700/50 text-zinc-400 border-zinc-600/50'
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-orange-400">{icon}</span>
      <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</h2>
    </div>
  )
}

// ─── Phase Card (collapsible) ─────────────────────────────────────────────────

function PhaseCard({ phase, defaultExpanded = false }: { phase: ProgramPhase; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex-shrink-0">
            {phase.phase}
          </span>
          <div>
            <p className="font-bold text-zinc-100">{phase.phaseLabel}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{phase.focus}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <span className="text-xs text-zinc-600">{phase.days.length} days</span>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-zinc-500 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-zinc-500 flex-shrink-0" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 divide-y divide-zinc-800/60">
          {phase.days.map((day) => (
            <div key={day.dayNumber} className="px-5 py-4">
              {/* Day header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-bold text-orange-300">{day.dayName}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{day.focus}</p>
                </div>
                <span className="flex-shrink-0 rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-400">
                  {day.sessionDuration} min
                </span>
              </div>

              {/* Warmup */}
              {day.warmup && (
                <div className="mb-3 rounded-lg bg-zinc-800/40 border border-zinc-700/40 px-3 py-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Warm-up · </span>
                  <span className="text-xs text-zinc-500">{day.warmup}</span>
                </div>
              )}

              {/* Exercises */}
              <div className="space-y-1.5">
                {day.exercises.map((ex) => (
                  <div
                    key={ex.order}
                    className="flex items-start gap-3 rounded-lg bg-zinc-800/50 px-3 py-2.5"
                  >
                    <span className="text-xs text-zinc-600 w-4 flex-shrink-0 mt-0.5 font-mono">{ex.order}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-200">{ex.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {ex.sets} sets × {ex.reps} reps
                        {ex.rpe && ex.rpe !== 'N/A' && <> · RPE {ex.rpe}</>}
                        {ex.rir && ex.rir !== 'N/A' && <> · {ex.rir} RIR</>}
                        {ex.rest && <> · {ex.rest} rest</>}
                      </p>
                      {ex.notes && (
                        <p className="text-xs text-zinc-600 italic mt-0.5">{ex.notes}</p>
                      )}
                    </div>
                    <span className={cn(
                      'text-[10px] border px-1.5 py-0.5 rounded flex-shrink-0 whitespace-nowrap font-medium',
                      patternBadgeClass(ex.pattern)
                    )}>
                      {ex.pattern}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cooldown */}
              {day.cooldown && (
                <div className="mt-3 rounded-lg bg-zinc-800/40 border border-zinc-700/40 px-3 py-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Cool-down · </span>
                  <span className="text-xs text-zinc-500">{day.cooldown}</span>
                </div>
              )}
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
            <p className="text-zinc-400 mt-3 max-w-lg mx-auto">
              {program
                ? `Your ${program.program.split} program — ${program.program.phasedWeeks.length} phases, fully personalized to your goals.`
                : 'Your personalized program has been generated and is ready to download.'}
            </p>
          </div>

          {/* Email CTA */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 mb-8">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800">
              <Mail className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">Check Your Email</p>
              <p className="text-xs text-zinc-500">
                Your PDF will be emailed once delivery is configured — download below in the meantime.
              </p>
            </div>
          </div>

          {/* ── Real program preview ─────────────────────────────────── */}
          {program && (
            <div className="space-y-5">
              {/* Overview stats */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <SectionHeader icon={<Flame className="h-4 w-4" />} label="Program Overview" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Split', value: program.program.split },
                    { label: 'Frequency', value: `${program.program.daysPerWeek}×/week` },
                    { label: 'Duration', value: program.overview.programDuration },
                    { label: 'Phases', value: `${program.program.phasedWeeks.length} phases` },
                    { label: 'Progression', value: program.progression.method },
                    { label: 'Deload', value: program.deload.frequency },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-zinc-800/60 border border-zinc-700/40 p-3">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">{stat.label}</p>
                      <p className="text-sm font-bold text-zinc-200">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed italic border-t border-zinc-800 pt-4">
                  &ldquo;{program.overview.philosophy}&rdquo;
                </p>
                <p className="text-sm text-zinc-500 leading-relaxed mt-3">{program.overview.approach}</p>
              </div>

              {/* Key principles */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <SectionHeader icon={<TrendingUp className="h-4 w-4" />} label="Key Programming Principles" />
                <ul className="space-y-2.5">
                  {program.overview.keyPrinciples.map((principle, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mt-0.5">
                        <span className="text-orange-400 text-[10px] font-bold">{i + 1}</span>
                      </span>
                      {principle}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-zinc-600 border-t border-zinc-800 pt-4">
                  {program.overview.weeklyStructure}
                </p>
              </div>

              {/* Phased training (collapsible) — Phase 1 auto-expanded */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Dumbbell className="h-4 w-4 text-orange-400" />
                  <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Your Training Program</h2>
                </div>

                {/* Movement pattern legend */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {Object.entries(PATTERN_COLORS).map(([pattern, cls]) => (
                    <span key={pattern} className={cn('text-[10px] border px-1.5 py-0.5 rounded font-medium', cls)}>
                      {pattern}
                    </span>
                  ))}
                </div>

                <div className="space-y-2">
                  {program.program.phasedWeeks.map((phase, idx) => (
                    <PhaseCard key={phase.phase} phase={phase} defaultExpanded={idx === 0} />
                  ))}
                </div>
              </div>

              {/* Progression */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <SectionHeader icon={<TrendingUp className="h-4 w-4" />} label="Progression System" />
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold mb-3">
                  {program.progression.method}
                </span>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {program.progression.overview}
                </p>
                <ul className="space-y-2 mb-4">
                  {program.progression.rules.map((rule, i) => (
                    <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                      <span className="text-orange-400 flex-shrink-0 mt-0.5">→</span>
                      {rule}
                    </li>
                  ))}
                </ul>
                {program.progression.weeklyGoals && program.progression.weeklyGoals.length > 0 && (
                  <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/40 p-4 mb-4">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2.5">Week-by-Week Goals</p>
                    <ul className="space-y-1.5">
                      {program.progression.weeklyGoals.map((goal, i) => (
                        <li key={i} className="text-xs text-zinc-400">· {goal}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {program.progression.rpeExplanation && (
                  <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/40 p-4 space-y-3">
                    <div>
                      <p className="text-xs font-bold text-zinc-500 mb-1">What is RPE?</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {program.progression.rpeExplanation}
                      </p>
                    </div>
                    <div className="border-t border-zinc-700/60 pt-3">
                      <p className="text-xs font-bold text-zinc-500 mb-1">What is RIR?</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {program.progression.rirExplanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Deload */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <SectionHeader icon={<RefreshCw className="h-4 w-4" />} label="Deload Protocol" />
                <p className="text-sm font-bold text-orange-300 mb-2">{program.deload.frequency}</p>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{program.deload.rationale}</p>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{program.deload.protocol}</p>
                <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/40 p-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">
                      Example Deload Week
                    </p>
                    <ul className="space-y-1.5">
                      {program.deload.deloadWeekExample.adjustments.map((adj, i) => (
                        <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                          <span className="text-zinc-600 flex-shrink-0">·</span>
                          {adj}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-zinc-700/60 pt-3">
                    <p className="text-xs text-zinc-500 italic">
                      {program.deload.deloadWeekExample.mindset}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nutrition (if included) */}
              {program.nutrition.included && (
                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
                  <SectionHeader icon={<Apple className="h-4 w-4" />} label="Nutrition Plan" />

                  {program.nutrition.dailyCalories && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-center col-span-2 sm:col-span-1">
                        <p className="text-2xl font-black text-orange-400">
                          {program.nutrition.dailyCalories.toLocaleString()}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">Daily Calories</p>
                      </div>
                      {program.nutrition.macros && (
                        <>
                          {[
                            { label: 'Protein', grams: program.nutrition.macros.protein.grams, perMeal: program.nutrition.macros.protein.perMeal, color: 'text-blue-400' },
                            { label: 'Carbs',   grams: program.nutrition.macros.carbs.grams,   perMeal: program.nutrition.macros.carbs.perMeal,   color: 'text-green-400' },
                            { label: 'Fats',    grams: program.nutrition.macros.fats.grams,    perMeal: program.nutrition.macros.fats.perMeal,    color: 'text-yellow-400' },
                          ].map((macro) => (
                            <div key={macro.label} className="rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-center">
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
                  )}

                  {program.nutrition.calorieSplit && (
                    <p className="text-xs text-zinc-500 italic mb-4 border-t border-orange-500/15 pt-4">
                      {program.nutrition.calorieSplit}
                    </p>
                  )}

                  {/* Hand portions */}
                  {program.nutrition.handPortions && (
                    <div className="mb-5 rounded-xl bg-zinc-900 border border-zinc-800 p-4">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">
                        Hand-Portion Guide (per meal)
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { emoji: '🤚', label: 'Protein',    value: program.nutrition.handPortions.protein },
                          { emoji: '👐', label: 'Carbs',      value: program.nutrition.handPortions.carbs },
                          { emoji: '👍', label: 'Fats',       value: program.nutrition.handPortions.fats },
                          { emoji: '✊', label: 'Vegetables', value: program.nutrition.handPortions.vegetables },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-2.5">
                            <span className="text-xl">{item.emoji}</span>
                            <div>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{item.label}</p>
                              <p className="text-sm text-zinc-300 font-medium">{item.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meal timing */}
                  {program.nutrition.mealTiming && program.nutrition.mealTiming.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Meal Timing</p>
                      <ul className="space-y-1.5">
                        {program.nutrition.mealTiming.map((meal, i) => (
                          <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                            <span className="text-orange-400 flex-shrink-0">·</span>
                            {meal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Supplements */}
                  {program.nutrition.supplements && (
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">Supplement Stack</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] text-zinc-600 uppercase tracking-wide mb-1.5">Foundational (Recommended)</p>
                          <ul className="space-y-1.5">
                            {program.nutrition.supplements.foundational.map((s, i) => (
                              <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                                <span className="text-orange-400 flex-shrink-0">·</span>{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {program.nutrition.supplements.optional.length > 0 && (
                          <div className="border-t border-zinc-800 pt-3">
                            <p className="text-[10px] text-zinc-600 uppercase tracking-wide mb-1.5">Optional / Advanced</p>
                            <ul className="space-y-1.5">
                              {program.nutrition.supplements.optional.map((s, i) => (
                                <li key={i} className="text-sm text-zinc-500 flex items-start gap-2">
                                  <span className="text-zinc-600 flex-shrink-0">·</span>{s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {program.nutrition.bodyFatNotes && (
                    <p className="mt-4 text-xs text-zinc-500 italic border-t border-orange-500/15 pt-4">
                      {program.nutrition.bodyFatNotes}
                    </p>
                  )}
                </div>
              )}

              {/* FAQ */}
              {program.faq.length > 0 && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                  <SectionHeader icon={<HelpCircle className="h-4 w-4" />} label="Program FAQ" />
                  <div className="space-y-5 divide-y divide-zinc-800">
                    {program.faq.map((item, i) => (
                      <div key={i} className={i > 0 ? 'pt-5' : ''}>
                        <p className="text-sm font-bold text-zinc-200 mb-1.5">{item.question}</p>
                        <p className="text-sm text-zinc-500 leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Getting started tips */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 mt-6 mb-8">
            <p className="text-sm font-semibold text-zinc-300 mb-3">Getting Started</p>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="flex items-start gap-2"><span className="text-orange-400 flex-shrink-0">→</span>Follow Phase 1 exactly — resist the urge to jump ahead</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 flex-shrink-0">→</span>Log every session: weight used, reps completed, RPE felt</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 flex-shrink-0">→</span>Respect your deload weeks — they&apos;re when real progress is locked in</li>
              <li className="flex items-start gap-2"><span className="text-orange-400 flex-shrink-0">→</span>Questions? Refer to the FAQ section above</li>
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

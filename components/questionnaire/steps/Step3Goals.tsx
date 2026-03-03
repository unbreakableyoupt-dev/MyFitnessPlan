'use client'

import { FormData, PrimaryGoal, ExperienceLevel } from '@/lib/types'
import { PRIMARY_GOALS, EXPERIENCE_LEVELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Step3Props {
  formData: FormData
  onChange: (updates: Partial<FormData>) => void
}

export default function Step3Goals({ formData, onChange }: Step3Props) {
  return (
    <div className="step-enter space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-1">Your Goal</h2>
        <p className="text-zinc-400">
          What do you want to achieve? Choose your primary goal — we&apos;ll build everything around it.
        </p>
      </div>

      {/* Primary Goal */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">Primary Goal</label>
        <div className="space-y-2">
          {PRIMARY_GOALS.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() =>
                onChange({
                  primaryGoal: goal.id as PrimaryGoal,
                  // Reset sport if not sport-specific
                  ...(goal.id !== 'sport_specific' && { sport: '' }),
                })
              }
              className={cn(
                'w-full flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200',
                formData.primaryGoal === goal.id
                  ? 'border-orange-500 bg-orange-500/10 shadow-sm shadow-orange-500/20'
                  : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
              )}
            >
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'font-semibold',
                    formData.primaryGoal === goal.id ? 'text-orange-300' : 'text-zinc-100'
                  )}
                >
                  {goal.label}
                </p>
                <p className="text-sm text-zinc-500 mt-0.5">{goal.description}</p>
              </div>
              <div
                className={cn(
                  'flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all',
                  formData.primaryGoal === goal.id
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-zinc-600'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">Training Experience</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXPERIENCE_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => onChange({ experienceLevel: level.id as ExperienceLevel })}
              className={cn(
                'flex flex-col rounded-xl border px-5 py-4 text-left transition-all duration-200',
                formData.experienceLevel === level.id
                  ? 'border-orange-500 bg-orange-500/10 shadow-sm shadow-orange-500/20'
                  : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={cn(
                    'font-bold text-base',
                    formData.experienceLevel === level.id ? 'text-orange-300' : 'text-zinc-100'
                  )}
                >
                  {level.label}
                </span>
                <span
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    formData.experienceLevel === level.id
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-zinc-700 text-zinc-500'
                  )}
                >
                  {level.timeframe}
                </span>
              </div>
              <p className="text-sm text-zinc-500">{level.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Helper note */}
      <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 px-4 py-3">
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="text-zinc-400 font-medium">Tip:</span> Be honest about your experience level.
          Beginners who train like advanced athletes get poor results. The AI uses your level to set
          appropriate volume, frequency, and exercise complexity.
        </p>
      </div>
    </div>
  )
}

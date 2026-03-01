'use client'

import { FormData } from '@/lib/types'
import Input from '@/components/ui/Input'

interface Step5Props {
  formData: FormData
  onChange: (updates: Partial<FormData>) => void
}

const POPULAR_SPORTS = [
  'Basketball',
  'Soccer / Football',
  'Tennis',
  'Boxing / MMA',
  'Swimming',
  'Cycling',
  'Track & Field',
  'Wrestling',
  'Baseball',
  'American Football',
  'Hockey',
  'Rowing',
]

export default function Step5Details({ formData, onChange }: Step5Props) {
  const isSportSpecific = formData.primaryGoal === 'sport_specific'

  return (
    <div className="step-enter space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-1">Additional Details</h2>
        <p className="text-zinc-400">
          A few more details to make your program as precise as possible.
          {!isSportSpecific && ' Both fields are optional — skip if not applicable.'}
        </p>
      </div>

      {/* Sport (conditional) */}
      {isSportSpecific && (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Your Sport{' '}
            <span className="text-orange-400 text-xs font-normal ml-1">Required for sport-specific programs</span>
          </label>
          <Input
            id="sport"
            type="text"
            placeholder="e.g. Basketball, Soccer, MMA, Rowing..."
            value={formData.sport}
            onChange={(e) => onChange({ sport: e.target.value })}
          />
          {/* Popular sports chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR_SPORTS.map((sport) => (
              <button
                key={sport}
                type="button"
                onClick={() => onChange({ sport })}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150 ${
                  formData.sport === sport
                    ? 'border-orange-500 bg-orange-500/10 text-orange-300'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Injuries / limitations */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="injuries" className="text-sm font-medium text-zinc-300">
            Injuries or Physical Limitations
          </label>
          <span className="text-xs text-zinc-600 font-normal">(Optional)</span>
        </div>
        <textarea
          id="injuries"
          rows={4}
          placeholder="e.g. Lower back pain, right shoulder impingement, bad knees — describe anything that limits your training..."
          value={formData.injuries}
          onChange={(e) => onChange({ injuries: e.target.value })}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 resize-none text-sm"
        />
        <p className="mt-1.5 text-xs text-zinc-600">
          The AI will avoid movements that may aggravate your issue and substitute appropriate alternatives.
        </p>
      </div>

      {/* Skip notice */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 flex items-start gap-3">
        <span className="text-zinc-400 text-sm mt-0.5">✓</span>
        <div>
          <p className="text-sm text-zinc-400">
            {isSportSpecific
              ? 'Describe your sport and any limitations, then continue.'
              : 'No injuries or special sport? Just click Continue — these fields are optional.'}
          </p>
        </div>
      </div>
    </div>
  )
}

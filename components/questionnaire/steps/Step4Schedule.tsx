'use client'

import { FormData, EquipmentId, MinutesPerSession } from '@/lib/types'
import { EQUIPMENT_OPTIONS, SESSION_DURATIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step4Props {
  formData: FormData
  onChange: (updates: Partial<FormData>) => void
}

export default function Step4Schedule({ formData, onChange }: Step4Props) {
  const days = [2, 3, 4, 5, 6, 7]

  const toggleEquipment = (id: EquipmentId) => {
    const current = formData.equipmentAccess
    const next = current.includes(id)
      ? current.filter((e) => e !== id)
      : [...current, id]
    onChange({ equipmentAccess: next })
  }

  const isSelected = (id: string) => formData.equipmentAccess.includes(id as EquipmentId)

  return (
    <div className="step-enter space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-1">Schedule & Equipment</h2>
        <p className="text-zinc-400">
          How often can you train, how long per session, and what equipment do you have access to?
        </p>
      </div>

      {/* Days per week */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">
          Training Days Per Week
        </label>
        <div className="grid grid-cols-6 gap-2">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => onChange({ daysPerWeek: day })}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl border py-3 font-bold transition-all duration-200',
                formData.daysPerWeek === day
                  ? 'border-orange-500 bg-orange-500/10 text-orange-300 shadow-sm shadow-orange-500/20'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              )}
            >
              <span className="text-xl font-black">{day}</span>
              <span className="text-[10px] font-normal mt-0.5 text-zinc-500">days</span>
            </button>
          ))}
        </div>
        {formData.daysPerWeek !== '' && (
          <p className="mt-2 text-xs text-zinc-500">
            {(formData.daysPerWeek as number) <= 3
              ? 'Full-body splits work best here.'
              : (formData.daysPerWeek as number) <= 5
              ? 'Upper/lower or push/pull/legs splits are ideal.'
              : 'High-frequency split — recovery management is key.'}
          </p>
        )}
      </div>

      {/* Minutes per session */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">
          Minutes Per Session
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {SESSION_DURATIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ minutesPerSession: value as MinutesPerSession })}
              className={cn(
                'rounded-xl border py-3 font-semibold text-sm transition-all duration-200',
                formData.minutesPerSession === value
                  ? 'border-orange-500 bg-orange-500/10 text-orange-300 shadow-sm shadow-orange-500/20'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {formData.minutesPerSession !== '' && (
          <p className="mt-2 text-xs text-zinc-500">
            {(formData.minutesPerSession as number) <= 30
              ? 'Short sessions: compound-only, no fluff.'
              : (formData.minutesPerSession as number) <= 60
              ? 'Moderate sessions: compounds + key accessories.'
              : 'Full sessions: complete volume with conditioning work.'}
          </p>
        )}
      </div>

      {/* Equipment — multi-select */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-zinc-300">
            Equipment Access
            <span className="ml-2 text-xs font-normal text-zinc-500">select all that apply</span>
          </label>
          {formData.equipmentAccess.length > 0 && (
            <span className="text-xs font-semibold text-orange-400">
              {formData.equipmentAccess.length} selected
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EQUIPMENT_OPTIONS.map((eq) => {
            const selected = isSelected(eq.id)
            return (
              <button
                key={eq.id}
                type="button"
                onClick={() => toggleEquipment(eq.id as EquipmentId)}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150',
                  selected
                    ? 'border-orange-500 bg-orange-500/10 shadow-sm shadow-orange-500/10'
                    : 'border-zinc-700 bg-zinc-800/40 hover:border-zinc-600 hover:bg-zinc-800'
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    'flex-shrink-0 flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-150',
                    selected
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-zinc-600 group-hover:border-zinc-400'
                  )}
                >
                  {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-lg flex-shrink-0">{eq.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn('font-semibold text-sm', selected ? 'text-orange-200' : 'text-zinc-200')}>
                    {eq.label}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{eq.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Validation nudge */}
        {formData.equipmentAccess.length === 0 && (
          <p className="mt-2 text-xs text-zinc-600">Select at least one option to continue.</p>
        )}

        {/* Selected summary chips */}
        {formData.equipmentAccess.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {formData.equipmentAccess.map((id) => {
              const opt = EQUIPMENT_OPTIONS.find((e) => e.id === id)
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 text-xs font-medium text-orange-300"
                >
                  {opt?.icon} {opt?.label ?? id}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

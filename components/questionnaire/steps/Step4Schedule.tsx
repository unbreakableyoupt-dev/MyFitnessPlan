'use client'

import { FormData, EquipmentAccess, MinutesPerSession } from '@/lib/types'
import { EQUIPMENT_OPTIONS, SESSION_DURATIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Step4Props {
  formData: FormData
  onChange: (updates: Partial<FormData>) => void
}

export default function Step4Schedule({ formData, onChange }: Step4Props) {
  const days = [2, 3, 4, 5, 6, 7]

  return (
    <div className="step-enter space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-1">Schedule & Equipment</h2>
        <p className="text-zinc-400">
          How often can you train, how long do you have, and what equipment do you have access to?
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
                'flex flex-col items-center justify-center rounded-xl border py-3 font-bold text-base transition-all duration-200',
                formData.daysPerWeek === day
                  ? 'border-orange-500 bg-orange-500/10 text-orange-300 shadow-sm shadow-orange-500/20'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              )}
            >
              <span className="text-xl font-black">{day}</span>
              <span className="text-[10px] font-normal mt-0.5 text-zinc-500">
                {day === 1 ? 'day' : 'days'}
              </span>
            </button>
          ))}
        </div>
        {formData.daysPerWeek !== '' && (
          <p className="mt-2 text-xs text-zinc-500">
            {formData.daysPerWeek <= 3
              ? 'Full-body or upper/lower splits recommended.'
              : formData.daysPerWeek <= 5
              ? 'Upper/lower or push/pull/legs splits are ideal.'
              : 'High-frequency splits with careful recovery management.'}
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
              ? 'Short sessions: we\'ll prioritize compound movements and minimize rest.'
              : (formData.minutesPerSession as number) <= 60
              ? 'Moderate sessions: balanced compound + accessory work.'
              : 'Long sessions: full volume including accessory and conditioning work.'}
          </p>
        )}
      </div>

      {/* Equipment */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">Equipment Access</label>
        <div className="space-y-2">
          {EQUIPMENT_OPTIONS.map((equipment) => (
            <button
              key={equipment.id}
              type="button"
              onClick={() => onChange({ equipmentAccess: equipment.id as EquipmentAccess })}
              className={cn(
                'w-full flex items-center gap-4 rounded-xl border px-5 py-3.5 text-left transition-all duration-200',
                formData.equipmentAccess === equipment.id
                  ? 'border-orange-500 bg-orange-500/10 shadow-sm shadow-orange-500/20'
                  : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
              )}
            >
              <span className="text-xl flex-shrink-0">{equipment.icon}</span>
              <div className="flex-1">
                <p
                  className={cn(
                    'font-semibold text-sm',
                    formData.equipmentAccess === equipment.id ? 'text-orange-300' : 'text-zinc-100'
                  )}
                >
                  {equipment.label}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{equipment.description}</p>
              </div>
              <div
                className={cn(
                  'flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all',
                  formData.equipmentAccess === equipment.id
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-zinc-600'
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

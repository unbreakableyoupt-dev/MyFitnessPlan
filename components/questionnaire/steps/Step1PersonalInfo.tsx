'use client'

import { FormData } from '@/lib/types'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface Step1Props {
  formData: FormData
  onChange: (updates: Partial<FormData>) => void
}

export default function Step1PersonalInfo({ formData, onChange }: Step1Props) {
  return (
    <div className="step-enter space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-1">About You</h2>
        <p className="text-zinc-400">
          Basic information so we can build a program suited to your physiology.
        </p>
      </div>

      {/* Sex selection */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">Sex</label>
        <div className="grid grid-cols-2 gap-3">
          {(['male', 'female'] as const).map((sex) => (
            <button
              key={sex}
              type="button"
              onClick={() => onChange({ sex, bodyFatTier: '' })}
              className={cn(
                'flex items-center justify-center gap-3 rounded-xl border px-5 py-4 font-semibold capitalize transition-all duration-200',
                formData.sex === sex
                  ? 'border-orange-500 bg-orange-500/10 text-orange-300 shadow-sm shadow-orange-500/20'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              )}
            >
              <span className="text-xl">{sex === 'male' ? '♂' : '♀'}</span>
              <span>{sex === 'male' ? 'Male' : 'Female'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Age */}
      <Input
        id="age"
        label="Age"
        type="number"
        min={13}
        max={99}
        placeholder="e.g. 28"
        value={formData.age}
        onChange={(e) =>
          onChange({ age: e.target.value === '' ? '' : parseInt(e.target.value, 10) })
        }
        suffix="years"
      />

      {/* Bodyweight */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Bodyweight</label>
        {/* Unit toggle */}
        <div className="flex gap-2 mb-3">
          {(['lbs', 'kg'] as const).map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => onChange({ weightUnit: unit })}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-150',
                formData.weightUnit === unit
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
              )}
            >
              {unit}
            </button>
          ))}
        </div>
        <Input
          id="bodyweight"
          type="number"
          min={50}
          max={formData.weightUnit === 'lbs' ? 600 : 300}
          placeholder={formData.weightUnit === 'lbs' ? 'e.g. 185' : 'e.g. 84'}
          value={formData.bodyweight}
          onChange={(e) =>
            onChange({
              bodyweight: e.target.value === '' ? '' : parseFloat(e.target.value),
            })
          }
          suffix={formData.weightUnit}
        />
      </div>

      {/* Height */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Height</label>
        {/* Unit toggle */}
        <div className="flex gap-2 mb-3">
          {([
            { value: 'imperial', label: 'ft / in' },
            { value: 'metric', label: 'cm' },
          ] as const).map((unit) => (
            <button
              key={unit.value}
              type="button"
              onClick={() => onChange({ heightUnit: unit.value })}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-150',
                formData.heightUnit === unit.value
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
              )}
            >
              {unit.label}
            </button>
          ))}
        </div>

        {formData.heightUnit === 'imperial' ? (
          <div className="flex gap-3">
            <Input
              id="heightFeet"
              type="number"
              min={3}
              max={8}
              placeholder="5"
              value={formData.heightFeet}
              onChange={(e) =>
                onChange({
                  heightFeet: e.target.value === '' ? '' : parseInt(e.target.value, 10),
                })
              }
              suffix="ft"
              className="flex-1"
            />
            <Input
              id="heightInches"
              type="number"
              min={0}
              max={11}
              placeholder="10"
              value={formData.heightInches}
              onChange={(e) =>
                onChange({
                  heightInches: e.target.value === '' ? '' : parseInt(e.target.value, 10),
                })
              }
              suffix="in"
              className="flex-1"
            />
          </div>
        ) : (
          <Input
            id="heightCm"
            type="number"
            min={100}
            max={250}
            placeholder="e.g. 178"
            value={formData.heightCm}
            onChange={(e) =>
              onChange({
                heightCm: e.target.value === '' ? '' : parseInt(e.target.value, 10),
              })
            }
            suffix="cm"
          />
        )}
      </div>
    </div>
  )
}

'use client'

import { FormData, NutritionMethod } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Zap, Check } from 'lucide-react'

interface Step6Props {
  formData: FormData
  onChange: (updates: Partial<FormData>) => void
}

export default function Step6Nutrition({ formData, onChange }: Step6Props) {
  return (
    <div className="step-enter space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-1">Nutrition Add-On</h2>
        <p className="text-zinc-400">
          Training programs deliver results. But 80% of body transformation happens in the kitchen.
          Add a personalized nutrition plan for just $10 more.
        </p>
      </div>

      {/* Yes / No choice */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-3">
          Add personalized nutrition plan?
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Yes — nutrition add-on */}
          <button
            type="button"
            onClick={() => onChange({ nutritionAddOn: true, nutritionMethod: 'macro_based' })}
            className={cn(
              'relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-200',
              formData.nutritionAddOn === true
                ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
            )}
          >
            {/* Badge */}
            <div className="absolute -top-2.5 left-4">
              <div className="flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-0.5">
                <Zap className="h-3 w-3 text-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wide">Recommended</span>
              </div>
            </div>

            <div className="mt-2 mb-4">
              <p className={cn('font-bold text-lg mb-0.5', formData.nutritionAddOn === true ? 'text-orange-300' : 'text-zinc-100')}>
                Yes — Add Nutrition Plan
              </p>
              <p className="text-sm text-zinc-500">
                Get a personalized nutrition roadmap alongside your training program.
              </p>
            </div>

            <ul className="space-y-1.5 mb-4">
              {[
                'Personalized calorie targets',
                'Custom macro breakdown',
                'Macro or hand-portion method',
                'Meal timing recommendations',
                'Supplement guidance',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                  <Check className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex items-baseline gap-1 pt-3 border-t border-zinc-700">
              <span className="text-2xl font-black text-zinc-100">+$10</span>
              <span className="text-zinc-500 text-sm">· one-time</span>
            </div>
          </button>

          {/* No — training only */}
          <button
            type="button"
            onClick={() => onChange({ nutritionAddOn: false, nutritionMethod: '' })}
            className={cn(
              'flex flex-col rounded-2xl border p-5 text-left transition-all duration-200',
              formData.nutritionAddOn === false
                ? 'border-zinc-500 bg-zinc-800 shadow-sm'
                : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
            )}
          >
            <div className="mb-4">
              <p className={cn('font-bold text-lg mb-0.5', formData.nutritionAddOn === false ? 'text-zinc-200' : 'text-zinc-400')}>
                No — Training Only
              </p>
              <p className="text-sm text-zinc-600">Just the training program. No nutrition plan.</p>
            </div>

            <ul className="space-y-1.5 mb-4 flex-1">
              {[
                'Custom training program',
                'Periodized 12-week plan',
                'Exercise prescription',
                'Instant PDF download',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-zinc-500">
                  <Check className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex items-baseline gap-1 pt-3 border-t border-zinc-700/50">
              <span className="text-2xl font-black text-zinc-400">$19</span>
              <span className="text-zinc-600 text-sm">· one-time</span>
            </div>
          </button>
        </div>
      </div>

      {/* Nutrition method (only if yes) */}
      {formData.nutritionAddOn === true && (
        <div className="step-enter">
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            Nutrition Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'macro_based' as NutritionMethod,
                label: 'Macro-Based',
                emoji: '📊',
                description:
                  'Specific calorie and macro targets. Best for those who want precision and are willing to track.',
                goodFor: 'Precision-focused, competitive athletes, advanced dieters',
              },
              {
                id: 'hand_portion' as NutritionMethod,
                label: 'Hand-Portion Method',
                emoji: '✋',
                description:
                  'Use your hand as a measuring tool. No counting, no apps — just simple visual guides.',
                goodFor: 'Beginners, those who dislike tracking, lifestyle-focused',
              },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => onChange({ nutritionMethod: method.id })}
                className={cn(
                  'flex flex-col rounded-xl border p-4 text-left transition-all duration-200',
                  formData.nutritionMethod === method.id
                    ? 'border-orange-500 bg-orange-500/10 shadow-sm shadow-orange-500/20'
                    : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
                )}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-2xl">{method.emoji}</span>
                  <div>
                    <p className={cn('font-semibold', formData.nutritionMethod === method.id ? 'text-orange-300' : 'text-zinc-100')}>
                      {method.label}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mb-2 leading-relaxed">{method.description}</p>
                <p className="text-[11px] text-zinc-600">
                  <span className="text-zinc-500">Best for: </span>{method.goodFor}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

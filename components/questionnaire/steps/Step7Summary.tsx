'use client'

import { FormData } from '@/lib/types'
import { PRICING_TIERS } from '@/lib/constants'
import {
  formatHeight,
  formatWeight,
  getGoalLabel,
  getExperienceLabel,
  getEquipmentLabel,
} from '@/lib/utils'
import { MALE_BF_TIERS, FEMALE_BF_TIERS } from '@/lib/constants'
import { Check, ShoppingCart, ArrowRight } from 'lucide-react'

interface Step7Props {
  formData: FormData
  onCheckout: () => void
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-zinc-800 last:border-0">
      <span className="text-sm text-zinc-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-zinc-200 text-right">{value || '—'}</span>
    </div>
  )
}

export default function Step7Summary({ formData, onCheckout }: Step7Props) {
  const hasNutrition = formData.nutritionAddOn === true
  const selectedTier = hasNutrition ? PRICING_TIERS[1] : PRICING_TIERS[0]

  // Get BF tier label
  const bfTiers = formData.sex === 'female' ? FEMALE_BF_TIERS : MALE_BF_TIERS
  const bfTier = bfTiers.find((t) => t.id === formData.bodyFatTier)

  const nutritionMethodLabel =
    formData.nutritionMethod === 'macro_based'
      ? 'Macro-Based'
      : formData.nutritionMethod === 'hand_portion'
      ? 'Hand-Portion Method'
      : ''

  return (
    <div className="step-enter space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-1">Review Your Order</h2>
        <p className="text-zinc-400">
          Everything looks right? Proceed to checkout and your program will be generated instantly after payment.
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 overflow-hidden">
        {/* Your stats */}
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Your Profile</h3>
          <div>
            <SummaryRow
              label="Sex"
              value={formData.sex === 'male' ? 'Male' : formData.sex === 'female' ? 'Female' : ''}
            />
            <SummaryRow label="Age" value={formData.age ? `${formData.age} years` : ''} />
            <SummaryRow label="Bodyweight" value={formatWeight(formData)} />
            <SummaryRow label="Height" value={formatHeight(formData)} />
            <SummaryRow
              label="Body Fat"
              value={bfTier ? `${bfTier.label} (${bfTier.range})` : ''}
            />
          </div>
        </div>

        {/* Training details */}
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Training</h3>
          <div>
            <SummaryRow label="Primary Goal" value={getGoalLabel(formData.primaryGoal)} />
            <SummaryRow label="Experience" value={getExperienceLabel(formData.experienceLevel)} />
            <SummaryRow
              label="Schedule"
              value={
                formData.daysPerWeek && formData.minutesPerSession
                  ? `${formData.daysPerWeek} days/week · ${formData.minutesPerSession} min/session`
                  : ''
              }
            />
            <SummaryRow label="Equipment" value={getEquipmentLabel(formData.equipmentAccess)} />
            {formData.sport && <SummaryRow label="Sport" value={formData.sport} />}
            {formData.injuries && (
              <SummaryRow label="Limitations" value={formData.injuries.slice(0, 60) + (formData.injuries.length > 60 ? '...' : '')} />
            )}
          </div>
        </div>

        {/* Nutrition */}
        <div className="px-5 py-4">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Nutrition</h3>
          <SummaryRow
            label="Nutrition Add-On"
            value={
              formData.nutritionAddOn === true
                ? `Yes — ${nutritionMethodLabel}`
                : 'No — Training only'
            }
          />
        </div>
      </div>

      {/* Pricing breakdown */}
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400">Custom Training Program</span>
          <span className="text-zinc-200 font-medium">$19.00</span>
        </div>
        {hasNutrition && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">Nutrition Add-On ({nutritionMethodLabel})</span>
            <span className="text-zinc-200 font-medium">+$10.00</span>
          </div>
        )}
        <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
          <span className="font-bold text-zinc-100">Total</span>
          <div className="text-right">
            <span className="text-2xl font-black text-orange-400">${selectedTier.price}</span>
            <span className="text-zinc-500 text-sm ml-1">one-time</span>
          </div>
        </div>
      </div>

      {/* What you'll get */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3">What you&apos;ll receive:</h3>
        <ul className="space-y-2">
          {selectedTier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-zinc-400">
              <Check className="h-4 w-4 text-orange-400 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Checkout button */}
      <button
        type="button"
        onClick={onCheckout}
        className="w-full flex items-center justify-center gap-3 rounded-xl bg-orange-500 py-4 text-lg font-bold text-white hover:bg-orange-400 transition-all duration-200 btn-glow"
      >
        <ShoppingCart className="h-5 w-5" />
        Proceed to Checkout — ${selectedTier.price}
        <ArrowRight className="h-5 w-5" />
      </button>

      <p className="text-center text-xs text-zinc-600">
        Secure checkout via Stripe · Instant PDF delivery after payment
      </p>
    </div>
  )
}

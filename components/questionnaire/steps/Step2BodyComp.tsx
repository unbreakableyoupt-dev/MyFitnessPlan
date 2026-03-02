'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { FormData } from '@/lib/types'
import { MALE_BF_TIERS, FEMALE_BF_TIERS, BFTier } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Step2Props {
  formData: FormData
  onChange: (updates: Partial<FormData>) => void
}

function BFCard({
  tier,
  selected,
  onSelect,
}: {
  tier: BFTier
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-xl border p-4 transition-all duration-200 group',
        selected
          ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
          : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
      )}
    >
      {/* Visual representation */}
      <div
        className={cn(
          'h-20 w-full rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br relative overflow-hidden',
          tier.gradient
        )}
      >
        {/* Silhouette layers as colored bands */}
        <div className="absolute inset-0 opacity-30">
          {/* Stylized body shape indicator */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className={cn('rounded-t-[40%]', tier.id.includes('25') || tier.id.includes('30') ? 'h-3/5' : tier.id.includes('20') || tier.id.includes('21') ? 'h-2/5' : 'h-1/3', 'bg-black/20')} />
          </div>
        </div>
        <span className="text-3xl relative z-10 drop-shadow-md">{tier.visual}</span>
        {/* Range label overlay */}
        <div className="absolute bottom-2 right-2">
          <span className="text-xs font-bold text-white/90 bg-black/30 px-2 py-0.5 rounded-full">
            {tier.range}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={cn('font-bold text-base mb-1', selected ? 'text-orange-300' : 'text-zinc-100')}>
            {tier.label}
          </p>
          <p className="text-xs text-zinc-500 leading-relaxed">{tier.description}</p>
        </div>
        {/* Selection indicator */}
        <div
          className={cn(
            'flex-shrink-0 h-5 w-5 rounded-full border-2 mt-0.5 transition-all duration-200',
            selected
              ? 'border-orange-500 bg-orange-500'
              : 'border-zinc-600 group-hover:border-zinc-400'
          )}
        >
          {selected && (
            <div className="h-full w-full rounded-full flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

export default function Step2BodyComp({ formData, onChange }: Step2Props) {
  const tiers = formData.sex === 'female' ? FEMALE_BF_TIERS : MALE_BF_TIERS
  const sexLabel = formData.sex === 'female' ? 'Female' : 'Male'
  const [chartOpen, setChartOpen] = useState(false)

  return (
    <div className="step-enter space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-1">Estimated Body Fat</h2>
        <p className="text-zinc-400">
          Pick the range that best describes your current physique. This doesn&apos;t have to be
          exact — an honest estimate is all we need.
        </p>
      </div>

      {/* Visual reference chart */}
      <div className="rounded-xl border border-zinc-700 overflow-hidden">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800/60 hover:bg-zinc-800 transition-colors text-left"
          onClick={() => setChartOpen((v) => !v)}
        >
          <span className="text-sm font-semibold text-zinc-200">Visual Reference Chart</span>
          {chartOpen
            ? <ChevronDown className="h-4 w-4 text-zinc-400 flex-shrink-0" />
            : <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />}
        </button>
        {chartOpen && (
          <div className="bg-zinc-900 p-3">
            <Image
              src="/bodyfat-chart.png"
              alt="Body fat percentage visual reference chart"
              width={800}
              height={500}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>
        )}
      </div>

      {/* Sex indicator */}
      <div className="flex items-center gap-2 rounded-lg bg-zinc-800/50 border border-zinc-700 px-3 py-2 w-fit">
        <span className="text-zinc-400 text-sm">Showing ranges for:</span>
        <span className="text-zinc-100 text-sm font-semibold">{sexLabel}</span>
      </div>

      {/* BF% tier cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tiers.map((tier) => (
          <BFCard
            key={tier.id}
            tier={tier}
            selected={formData.bodyFatTier === tier.id}
            onSelect={() => onChange({ bodyFatTier: tier.id })}
          />
        ))}
      </div>

      {/* Accuracy note */}
      <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 px-4 py-3">
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="text-zinc-400 font-medium">Note:</span> Body fat estimates are notoriously
          difficult without professional measurement. An honest visual comparison is sufficient — the
          AI accounts for estimation error when building your program.
        </p>
      </div>
    </div>
  )
}

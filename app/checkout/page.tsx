'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap, Lock, ArrowLeft, Check } from 'lucide-react'
import { FormData } from '@/lib/types'
import { PRICING_TIERS } from '@/lib/constants'
import { getGoalLabel, getEquipmentLabel } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function CheckoutPage() {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('programforge_form')
    if (stored) {
      setFormData(JSON.parse(stored))
    }
  }, [])

  const hasNutrition = formData?.nutritionAddOn === true
  const selectedTier = hasNutrition ? PRICING_TIERS[1] : PRICING_TIERS[0]

  const handleStripeCheckout = async () => {
    setLoading(true)
    // TODO: Implement Stripe checkout session
    // const res = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ formData, tierId: selectedTier.id }),
    // })
    // const { url } = await res.json()
    // window.location.href = url
    alert('Stripe integration coming soon! This is a placeholder checkout.')
    setLoading(false)
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">No program data found. Please complete the questionnaire first.</p>
          <Link
            href="/questionnaire"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-400 transition-colors"
          >
            Start Questionnaire
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-base text-zinc-100">
                Program<span className="text-orange-500">Forge</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Lock className="h-3.5 w-3.5 text-green-500" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Back link */}
          <Link
            href="/questionnaire"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to questionnaire
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Payment form (Stripe Elements placeholder) */}
            <div className="order-2 lg:order-1">
              <h2 className="text-xl font-bold text-zinc-100 mb-6">Payment Details</h2>

              {/* Stripe Elements placeholder */}
              <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 space-y-5">
                <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                  <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">Email</p>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-zinc-200 placeholder-zinc-600 text-sm focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                  <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">Card Information</p>
                  <div className="text-sm text-zinc-600 italic">
                    Stripe payment form will render here
                  </div>
                  <div className="mt-3 h-px bg-zinc-700" />
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="text-sm text-zinc-600 italic">MM / YY</div>
                    <div className="text-sm text-zinc-600 italic">CVC</div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                  <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">Name on Card</p>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full bg-transparent text-zinc-200 placeholder-zinc-600 text-sm focus:outline-none"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center gap-3"
                  loading={loading}
                  onClick={handleStripeCheckout}
                >
                  <Lock className="h-4 w-4" />
                  Pay ${selectedTier.price}.00 Securely
                </Button>

                <p className="text-center text-xs text-zinc-600">
                  Your payment is processed securely by Stripe. We never store card details.
                </p>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="order-1 lg:order-2">
              <h2 className="text-xl font-bold text-zinc-100 mb-6">Order Summary</h2>

              <div className="rounded-2xl border border-zinc-700 bg-zinc-900 overflow-hidden">
                {/* Plan name */}
                <div className={`px-5 py-4 ${hasNutrition ? 'bg-orange-500/10 border-b border-orange-500/30' : 'border-b border-zinc-800'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-zinc-100">{selectedTier.name}</p>
                      <p className="text-sm text-zinc-500 mt-0.5">{selectedTier.description}</p>
                    </div>
                    {hasNutrition && (
                      <span className="flex-shrink-0 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        Best Value
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile summary */}
                <div className="px-5 py-4 border-b border-zinc-800 space-y-2">
                  {[
                    { label: 'Goal', value: getGoalLabel(formData.primaryGoal) },
                    {
                      label: 'Schedule',
                      value: `${formData.daysPerWeek} days/week · ${formData.minutesPerSession} min`,
                    },
                    { label: 'Equipment', value: getEquipmentLabel(formData.equipmentAccess) },
                    hasNutrition
                      ? {
                          label: 'Nutrition',
                          value:
                            formData.nutritionMethod === 'macro_based'
                              ? 'Macro-Based Plan'
                              : 'Hand-Portion Plan',
                        }
                      : null,
                  ]
                    .filter(Boolean)
                    .map((row) => (
                      <div
                        key={row!.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-zinc-500">{row!.label}</span>
                        <span className="text-zinc-300">{row!.value}</span>
                      </div>
                    ))}
                </div>

                {/* Features */}
                <div className="px-5 py-4 border-b border-zinc-800">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                    Included
                  </p>
                  <ul className="space-y-1.5">
                    {selectedTier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                        <Check className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total */}
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-100">Total</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-orange-400">${selectedTier.price}</span>
                      <span className="text-zinc-500 text-sm ml-1">one-time</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-zinc-600">
                    No subscription. Pay once, yours forever.
                  </p>
                </div>
              </div>

              {/* Trust signals */}
              <div className="mt-4 space-y-2">
                {[
                  '🔒 256-bit SSL encryption via Stripe',
                  '⚡ Program generated & delivered in under 60 seconds',
                  '📧 PDF sent to your email instantly',
                ].map((item) => (
                  <p key={item} className="text-xs text-zinc-600">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

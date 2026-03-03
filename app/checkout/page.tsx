'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Lock, ArrowLeft, Check, Cpu } from 'lucide-react'
import { FormData } from '@/lib/types'
import { PRICING_TIERS } from '@/lib/constants'
import { getGoalLabel, getEquipmentLabel } from '@/lib/utils'
import { useGenerateProgram } from '@/hooks/useGenerateProgram'
import Button from '@/components/ui/Button'

export default function CheckoutPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [email, setEmail] = useState('')
  const { status: generationStatus, error: generationError, retryAttempt, generate } = useGenerateProgram()

  const isGenerating = generationStatus === 'generating'

  useEffect(() => {
    const stored = sessionStorage.getItem('programforge_form')
    if (stored) {
      setFormData(JSON.parse(stored))
    }
  }, [])

  const hasNutrition = formData?.nutritionAddOn === true
  const selectedTier = hasNutrition ? PRICING_TIERS[1] : PRICING_TIERS[0]

  const handleStripeCheckout = async () => {
    if (!formData) return
    // TODO: Replace with real Stripe checkout session creation.
    // The flow will be:
    //   1. POST /api/create-checkout-session → get Stripe hosted URL
    //   2. Redirect user to Stripe → user pays
    //   3. Stripe calls POST /api/webhook on success
    //   4. Webhook triggers program generation + email delivery
    //   5. User lands on /success page with download link
    //
    // For now: generate the program directly (bypassing payment) so
    // the end-to-end Claude generation can be tested without Stripe.

    const program = await generate(formData)
    if (program) {
      if (email) sessionStorage.setItem('programforge_email', email)
      router.push('/success')
    }
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
                My<span className="text-orange-500">Fitness</span>Plan
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                {/* Generation status */}
                {isGenerating && (
                  <div className={`rounded-xl border p-4 ${retryAttempt > 0 ? 'border-amber-500/40 bg-amber-500/5' : 'border-orange-500/30 bg-orange-500/5'}`}>
                    <div className="flex items-center gap-3">
                      <Cpu className={`h-5 w-5 flex-shrink-0 animate-pulse ${retryAttempt > 0 ? 'text-amber-400' : 'text-orange-400'}`} />
                      <div>
                        {retryAttempt > 0 ? (
                          <>
                            <p className="text-sm font-semibold text-amber-300">
                              High demand — retrying ({retryAttempt}/{3})…
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Anthropic servers are busy. Retrying automatically — hang tight.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-orange-300">Generating your program…</p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Claude is building your personalized plan. This takes 20–40 seconds.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full animate-[shimmer_2s_linear_infinite] w-2/3 ${retryAttempt > 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-orange-500 to-amber-400'}`} />
                    </div>
                  </div>
                )}

                {/* Generation error — shown prominently so you can debug */}
                {generationStatus === 'error' && generationError && (
                  <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-4">
                    <p className="text-sm font-bold text-red-400 mb-2">Generation failed</p>
                    <p className="text-sm text-red-300 font-mono break-all">{generationError}</p>
                    <p className="text-xs text-zinc-500 mt-2">
                      Check the terminal / server logs for the full stack trace.
                    </p>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center gap-3"
                  loading={isGenerating}
                  onClick={handleStripeCheckout}
                >
                  <Lock className="h-4 w-4" />
                  {isGenerating ? 'Generating Program…' : `Pay $${selectedTier.price}.00 Securely`}
                </Button>

                <div className="rounded-xl border-2 border-dashed border-amber-500/50 bg-amber-500/5 p-4">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">
                    ⚠ Test Mode — Stripe Bypassed
                  </p>
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleStripeCheckout}
                    className="w-full rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? 'Generating…' : 'Generate Test Program (No Payment)'}
                  </button>
                </div>

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

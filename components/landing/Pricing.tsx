import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import { PRICING_TIERS } from '@/lib/constants'

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28 relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 mb-4">
            One-time payment.{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Zero subscriptions.
            </span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Pay once, own your program forever. A single PT session costs $80+.
            Get a complete program for less.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                tier.highlighted
                  ? 'border-orange-500 bg-gradient-to-b from-orange-500/10 to-zinc-900 shadow-2xl shadow-orange-500/20'
                  : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              {/* Best value badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-1">
                    <Zap className="h-3 w-3 text-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      {tier.badge}
                    </span>
                  </div>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-100 mb-2">{tier.name}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-zinc-100">${tier.price}</span>
                  <span className="text-zinc-500 text-sm font-medium">/ one-time</span>
                </div>
                {tier.highlighted && (
                  <p className="mt-1 text-xs text-orange-400 font-medium">
                    Training + nutrition for the price of just training elsewhere
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full mt-0.5 ${
                        tier.highlighted
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={`/questionnaire?plan=${tier.id}`}
                className={`block w-full rounded-xl py-3.5 text-center font-bold text-base transition-all duration-200 ${
                  tier.highlighted
                    ? 'bg-orange-500 text-white hover:bg-orange-400 btn-glow'
                    : 'border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100'
                }`}
              >
                {tier.highlighted ? 'Get Transformation Pack' : 'Get Training Program'}
              </Link>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="mt-10 text-center">
          <p className="text-sm text-zinc-500">
            🔒 Secure checkout via Stripe · Instant PDF delivery · Questions?{' '}
            <a href="mailto:support@programforge.io" className="text-zinc-400 underline hover:text-zinc-200">
              support@programforge.io
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

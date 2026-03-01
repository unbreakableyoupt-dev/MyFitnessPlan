import Link from 'next/link'
import { ArrowRight, Shield, Zap, FileText } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-orange-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5">
          <Zap className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-sm font-medium text-orange-300">AI-Generated. Coach-Level Quality.</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
          Your Perfect
          <span className="block bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
            Training Program.
          </span>
          <span className="block text-zinc-100">Generated in Minutes.</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-zinc-400 mb-10 leading-relaxed">
          Answer 7 quick questions about your body, goals, and schedule. Pay once.
          Get a fully personalized training program — built by AI, inspired by elite coaching methodology.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/questionnaire"
            className="group inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-lg font-bold text-white hover:bg-orange-400 transition-all duration-200 btn-glow"
          >
            Build My Program
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 text-base font-semibold text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-all duration-200"
          >
            See How It Works
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Secure Stripe checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <span>Instant PDF delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-400" />
            <span>No subscription — pay once</span>
          </div>
        </div>

        {/* Price anchor */}
        <p className="mt-6 text-sm text-zinc-600">
          Starting from <span className="text-zinc-400 font-semibold">$19</span> — less than a single PT session.
        </p>
      </div>

      {/* Hero image/mockup area */}
      <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
        <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/50">
          {/* Mock PDF preview */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-zinc-100">Custom Training Program — 12-Week Hypertrophy Block</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">Ready</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Training Split', value: 'Upper / Lower × 4 days' },
                  { label: 'Duration', value: '12 weeks / 48 sessions' },
                  { label: 'Equipment', value: 'Full Gym' },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-zinc-800 p-3">
                    <p className="text-xs text-zinc-500 mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-zinc-200">{item.value}</p>
                  </div>
                ))}
              </div>
              {/* Mock exercise rows */}
              <div className="mt-4 space-y-2">
                {[
                  { day: 'Day 1 — Upper (Push)', exercises: 'Bench Press, OHP, Incline DB Press, Lateral Raises, Tricep Pushdowns' },
                  { day: 'Day 2 — Lower (Quad Focus)', exercises: 'Squat, Leg Press, Bulgarian Split Squat, Leg Extension, Calf Raises' },
                  { day: 'Day 3 — Upper (Pull)', exercises: 'Pull-Ups, Barbell Row, Cable Row, Face Pulls, Bicep Curls' },
                ].map((row) => (
                  <div key={row.day} className="flex items-start gap-3 rounded-lg bg-zinc-800/50 px-3 py-2.5">
                    <span className="text-xs font-semibold text-orange-400 whitespace-nowrap mt-0.5">{row.day.split('—')[0]}</span>
                    <span className="text-xs text-zinc-400 truncate">{row.exercises}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-950/80 to-transparent rounded-b-2xl pointer-events-none" />
        </div>
      </div>
    </section>
  )
}

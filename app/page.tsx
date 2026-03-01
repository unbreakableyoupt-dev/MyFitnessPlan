import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import FAQ from '@/components/landing/FAQ'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <FAQ />

        {/* Bottom CTA section */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-orange-500/8 blur-[80px]" />
          </div>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 mb-4">
              Ready to train{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                smarter?
              </span>
            </h2>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
              Stop guessing. Stop following generic YouTube programs. Get a program built{' '}
              <em>specifically</em> for your body, goals, and life.
            </p>
            <Link
              href="/questionnaire"
              className="group inline-flex items-center gap-2 rounded-xl bg-orange-500 px-10 py-5 text-xl font-bold text-white hover:bg-orange-400 transition-all duration-200 btn-glow"
            >
              Build My Program — from $19
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-4 text-sm text-zinc-600">
              No subscription. Instant delivery. One-time payment.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

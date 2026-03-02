import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm'

export const metadata: Metadata = {
  title: 'Build Your Program — MyFitnessPlan',
  description: 'Answer a few questions about your goals and training, and get your personalized program.',
}

export default function QuestionnairePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Minimal nav for questionnaire flow */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 group-hover:bg-orange-400 transition-colors">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-base text-zinc-100">
                My<span className="text-orange-500">Fitness</span>Plan
              </span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Secure form</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Form — padded for nav */}
      <div className="pt-14">
        <QuestionnaireForm />
      </div>
    </div>
  )
}

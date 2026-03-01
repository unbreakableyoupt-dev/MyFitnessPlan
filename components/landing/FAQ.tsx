'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'How personalized is the program, really?',
    answer:
      'Very. The program is built from your specific inputs: your sex, age, bodyweight, height, body fat estimate, primary goal, training experience, days per week, session duration, available equipment, injuries, and more. The AI uses all of these to make programming decisions that a real coach would — exercise selection, training split, volume, intensity, and progression.',
  },
  {
    question: 'What does the PDF actually include?',
    answer:
      'Your training program PDF includes: a recommended training split and weekly schedule, detailed exercise prescription for every session (sets, reps, RPE/intensity guidance), a progression plan across 12 weeks, warm-up recommendations, notes on form cues for key lifts, and (if you chose the nutrition add-on) your personalized calorie targets, macros, and a meal structure guide.',
  },
  {
    question: 'Can I use this if I train at home?',
    answer:
      'Yes. During the questionnaire, you select your equipment access — from full gym to bodyweight only. The AI will select exercises that match what you have available, so you\'ll never be prescribed a cable machine exercise if you only have dumbbells.',
  },
  {
    question: 'What if I have injuries or limitations?',
    answer:
      'There\'s an optional field in the questionnaire where you can describe any injuries or physical limitations. The AI will take these into account and avoid exercises that might aggravate your issue, substituting with appropriate alternatives.',
  },
  {
    question: 'What\'s the difference between the two pricing options?',
    answer:
      'The Training Program ($19) gives you a complete, personalized workout plan. The Transformation Pack ($29) includes everything in the training program PLUS a personalized nutrition plan — either macro-based (specific calorie and macro targets) or a simple hand-portion method (no counting required). For most people, the Transformation Pack is the obvious choice since 80% of results come from diet.',
  },
  {
    question: 'How does the nutrition plan work?',
    answer:
      'If you choose the nutrition add-on, you\'ll select either a macro-based or hand-portion approach. Macro-based gives you exact calorie and protein/carb/fat targets based on your stats and goal. Hand-portion uses palm-sized servings to guide food intake without counting — simpler but equally effective for most people.',
  },
  {
    question: 'Is this a subscription?',
    answer:
      'No. This is a one-time purchase. You pay once, receive your program PDF instantly, and it\'s yours forever. No recurring charges, no account required after download.',
  },
  {
    question: 'What if I\'m not satisfied?',
    answer:
      'Reach out to us at support@programforge.io within 7 days of purchase if you\'re not happy with your program. We\'ll work to make it right.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-zinc-100 text-base pr-2">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 flex-shrink-0 text-zinc-500 transition-transform duration-200 mt-0.5',
            open && 'rotate-180 text-orange-400'
          )}
        />
      </button>
      {open && (
        <p className="pb-5 text-zinc-400 text-sm leading-relaxed animate-[fadeIn_0.2s_ease-in-out]">
          {answer}
        </p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Header */}
          <div className="lg:col-span-1">
            <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 mb-4">
              Common questions
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Everything you need to know before you build your program.
            </p>
          </div>

          {/* FAQ items */}
          <div className="lg:col-span-2 divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-2">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

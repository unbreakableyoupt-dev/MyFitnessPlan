import { ClipboardList, Cpu, Download } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Answer 7 Quick Questions',
    description:
      'Tell us about your body, goals, training schedule, and available equipment. Takes 2 minutes.',
    detail: 'Age, weight, body fat, goal, experience, schedule, equipment — all the inputs an elite coach would ask for.',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'We Build Your Program',
    description:
      'Our AI — trained on elite coaching methodology — generates a program built specifically around your inputs.',
    detail: 'Exercise selection, volume, intensity, periodization, and progressive overload — all tailored to you.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Download & Start Training',
    description:
      'Your personalized program PDF is ready instantly. Download it, save it, and start your first session today.',
    detail: 'A clean, well-formatted PDF you can reference at the gym, on your phone, or print out.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative">
      {/* Section border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-zinc-700" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 mb-4">
            From questionnaire to{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              program
            </span>
            {' '}in seconds.
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            No back-and-forth. No waiting. Just a premium, personalized training program ready to download.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-zinc-700 to-transparent z-0 -translate-x-1/2" />
              )}

              <div className="relative z-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 lg:p-8 h-full">
                {/* Number + Icon */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <step.icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <span className="text-5xl font-black text-zinc-800 leading-none">{step.number}</span>
                </div>

                <h3 className="text-xl font-bold text-zinc-100 mb-2">{step.title}</h3>
                <p className="text-zinc-400 mb-4 leading-relaxed">{step.description}</p>
                <p className="text-sm text-zinc-500 leading-relaxed border-t border-zinc-800 pt-4">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '< 2 min', label: 'Questionnaire time' },
            { value: '< 30 sec', label: 'Generation time' },
            { value: '12+ weeks', label: 'Of programming' },
            { value: 'Instant', label: 'PDF delivery' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center"
            >
              <p className="text-2xl sm:text-3xl font-extrabold text-orange-400 mb-1">{stat.value}</p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

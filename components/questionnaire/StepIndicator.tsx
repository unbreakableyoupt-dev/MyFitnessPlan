import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { FORM_STEPS } from '@/lib/constants'

interface StepIndicatorProps {
  currentStep: number
  completedSteps: Set<number>
}

export default function StepIndicator({ currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Mobile: compact indicator */}
      <div className="flex sm:hidden items-center justify-between px-1 mb-6">
        <span className="text-sm font-semibold text-zinc-300">
          {FORM_STEPS[currentStep - 1]?.title}
        </span>
        <span className="text-sm text-zinc-500">
          Step {currentStep} of {FORM_STEPS.length}
        </span>
      </div>

      {/* Desktop: full step indicators */}
      <div className="hidden sm:flex items-center justify-between mb-8">
        {FORM_STEPS.map((step, index) => {
          const stepNum = step.id
          const isCompleted = completedSteps.has(stepNum)
          const isCurrent = currentStep === stepNum
          const isPast = stepNum < currentStep

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300',
                    isCurrent
                      ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : isCompleted || isPast
                      ? 'border-orange-500/50 bg-orange-500/20 text-orange-400'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-600'
                  )}
                >
                  {isCompleted || isPast ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'mt-1.5 text-xs font-medium whitespace-nowrap',
                    isCurrent ? 'text-orange-400' : isPast ? 'text-zinc-500' : 'text-zinc-700'
                  )}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector line */}
              {index < FORM_STEPS.length - 1 && (
                <div className="flex-1 mx-2 mb-5">
                  <div
                    className={cn(
                      'h-px transition-all duration-500',
                      isPast ? 'bg-orange-500/50' : 'bg-zinc-800'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FormData, INITIAL_FORM_DATA } from '@/lib/types'
import { isStepComplete } from '@/lib/utils'
import { FORM_STEPS } from '@/lib/constants'
import { ProgressBar } from '@/components/ui/ProgressBar'
import StepIndicator from './StepIndicator'
import Step1PersonalInfo from './steps/Step1PersonalInfo'
import Step2BodyComp from './steps/Step2BodyComp'
import Step3Goals from './steps/Step3Goals'
import Step4Schedule from './steps/Step4Schedule'
import Step5Details from './steps/Step5Details'
import Step6Nutrition from './steps/Step6Nutrition'
import Step7Summary from './steps/Step7Summary'
import Button from '@/components/ui/Button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const TOTAL_STEPS = FORM_STEPS.length

export default function QuestionnaireForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const handleChange = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  const canContinue = isStepComplete(currentStep, formData)

  const handleNext = () => {
    if (!canContinue) return
    setCompletedSteps((prev) => new Set(prev).add(currentStep))
    setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1))
    // Scroll to top of form on step change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setCurrentStep((s) => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCheckout = () => {
    sessionStorage.setItem('programforge_form', JSON.stringify(formData))
    router.push('/checkout')
  }

  const progress = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo formData={formData} onChange={handleChange} />
      case 2:
        return <Step2BodyComp formData={formData} onChange={handleChange} />
      case 3:
        return <Step3Goals formData={formData} onChange={handleChange} />
      case 4:
        return <Step4Schedule formData={formData} onChange={handleChange} />
      case 5:
        return <Step5Details formData={formData} onChange={handleChange} />
      case 6:
        return <Step6Nutrition formData={formData} onChange={handleChange} />
      case 7:
        return (
          <Step7Summary
            formData={formData}
            onCheckout={handleCheckout}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-zinc-100">Build Your Program</h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Takes about 2 minutes to complete
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-orange-400">
                {Math.round(progress)}%
              </span>
              <p className="text-xs text-zinc-600">complete</p>
            </div>
          </div>

          {/* Progress bar */}
          <ProgressBar value={progress} />
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

        {/* Form card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 shadow-xl shadow-black/30">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep < TOTAL_STEPS && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="md"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="text-center flex-1">
              <p className="text-xs text-zinc-600">
                Step {currentStep} of {TOTAL_STEPS}
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              disabled={!canContinue}
              className="gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Back button on summary step */}
        {currentStep === TOTAL_STEPS && (
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Edit
            </Button>
          </div>
        )}

        {/* Validation hint */}
        {!canContinue && currentStep < TOTAL_STEPS && (
          <p className="mt-3 text-center text-xs text-zinc-600">
            Complete all required fields to continue.
          </p>
        )}
      </div>
    </div>
  )
}

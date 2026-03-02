'use client'

import { useState, useCallback } from 'react'
import { FormData } from '@/lib/types'

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

export interface UseGenerateProgramResult {
  status: GenerationStatus
  text: string | null
  error: string | null
  generate: (formData: FormData) => Promise<string | null>
  reset: () => void
}

export function useGenerateProgram(): UseGenerateProgramResult {
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (formData: FormData): Promise<string | null> => {
    setStatus('generating')
    setError(null)
    setText(null)

    try {
      const res = await fetch('/api/generate-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      })

      let data: { success: boolean; text?: string; error?: string; generatedAt?: string }
      try {
        data = await res.json()
      } catch {
        throw new Error(`Server error (HTTP ${res.status}) — please try again.`)
      }

      if (!data.success) {
        throw new Error(data.error ?? 'Unknown server error')
      }

      const programText = data.text ?? ''
      setText(programText)
      setStatus('success')
      sessionStorage.setItem('programforge_program_text', programText)
      sessionStorage.setItem('programforge_generated_at', data.generatedAt ?? new Date().toISOString())
      return programText
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error — please check your connection.'
      setError(message)
      setStatus('error')
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setText(null)
    setError(null)
  }, [])

  return { status, text, error, generate, reset }
}

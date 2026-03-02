'use client'

import { useState, useCallback } from 'react'
import { FormData } from '@/lib/types'
import { GeneratedProgram, GenerateProgramResponse } from '@/lib/programTypes'

export type GenerationStatus =
  | 'idle'
  | 'generating'
  | 'success'
  | 'error'

export interface UseGenerateProgramResult {
  status: GenerationStatus
  program: GeneratedProgram | null
  error: string | null
  generate: (formData: FormData) => Promise<GeneratedProgram | null>
  reset: () => void
}

export function useGenerateProgram(): UseGenerateProgramResult {
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [program, setProgram] = useState<GeneratedProgram | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (formData: FormData): Promise<GeneratedProgram | null> => {
    setStatus('generating')
    setError(null)
    setProgram(null)

    try {
      const res = await fetch('/api/generate-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      })

      const text = await res.text()
      let data: GenerateProgramResponse
      try {
        data = JSON.parse(text) as GenerateProgramResponse
      } catch {
        // Server returned a non-JSON response (e.g. Vercel timeout/502 HTML page)
        throw new Error(
          `Server error (HTTP ${res.status}): ${text.slice(0, 200).replace(/\s+/g, ' ')}`
        )
      }

      if (!data.success) {
        setError(data.error)
        setStatus('error')
        return null
      }

      setProgram(data.program)
      setStatus('success')

      // Persist to sessionStorage so the success/download page can access it
      sessionStorage.setItem('programforge_program', JSON.stringify(data.program))
      sessionStorage.setItem('programforge_generated_at', data.generatedAt)

      return data.program
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Network error — please check your connection'
      setError(message)
      setStatus('error')
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setProgram(null)
    setError(null)
  }, [])

  return { status, program, error, generate, reset }
}

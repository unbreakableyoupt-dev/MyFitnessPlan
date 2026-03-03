'use client'

import { useState, useCallback } from 'react'
import { FormData } from '@/lib/types'

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

export interface UseGenerateProgramResult {
  status: GenerationStatus
  text: string | null
  error: string | null
  retryAttempt: number   // 0 = first attempt, 1-3 = which retry we're on
  generate: (formData: FormData) => Promise<string | null>
  reset: () => void
}

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 3000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useGenerateProgram(): UseGenerateProgramResult {
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryAttempt, setRetryAttempt] = useState(0)

  const generate = useCallback(async (formData: FormData): Promise<string | null> => {
    setStatus('generating')
    setError(null)
    setText(null)
    setRetryAttempt(0)

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await fetch('/api/generate-program', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData }),
        })

        let data: { success: boolean; text?: string; error?: string; retryable?: boolean; generatedAt?: string }
        try {
          data = await res.json()
        } catch {
          throw new Error(`Server error (HTTP ${res.status}) — please try again.`)
        }

        if (!data.success) {
          // Retry if the server flagged it as retryable and we have attempts left
          if (data.retryable && attempt < MAX_RETRIES) {
            setRetryAttempt(attempt)
            await sleep(RETRY_DELAY_MS)
            continue
          }
          throw new Error(data.error ?? 'Unknown server error')
        }

        const programText = data.text ?? ''
        setText(programText)
        setStatus('success')
        setRetryAttempt(0)
        sessionStorage.setItem('programforge_program_text', programText)
        sessionStorage.setItem('programforge_generated_at', data.generatedAt ?? new Date().toISOString())

        // Fire-and-forget email with PDF — does not block navigation
        if (formData.email) {
          fetch('/api/send-program', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, programText }),
          }).catch(() => {}) // failures are silently ignored; SMTP config is optional
        }

        return programText
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Network error — please check your connection.'
        setError(message)
        setStatus('error')
        return null
      }
    }

    // Should not reach here, but guard anyway
    setError('Failed to generate program after multiple attempts — please try again.')
    setStatus('error')
    return null
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setText(null)
    setError(null)
    setRetryAttempt(0)
  }, [])

  return { status, text, error, retryAttempt, generate, reset }
}

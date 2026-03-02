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

      const contentType = res.headers.get('content-type') ?? ''
      const text = await res.text()

      // ── JSON path: validation errors, mock response, or pre-stream auth failure ──
      if (contentType.includes('application/json') || !res.ok) {
        let data: GenerateProgramResponse
        try {
          data = JSON.parse(text) as GenerateProgramResponse
        } catch {
          throw new Error(
            `Server error (HTTP ${res.status}): ${text.slice(0, 200).replace(/\s+/g, ' ')}`
          )
        }
        if (!data.success) throw new Error(data.error ?? 'Unknown server error')
        setProgram(data.program)
        setStatus('success')
        sessionStorage.setItem('programforge_program', JSON.stringify(data.program))
        sessionStorage.setItem('programforge_generated_at', data.generatedAt)
        return data.program
      }

      // ── Streaming path: text/plain Claude output ──────────────────────────────
      // Check for in-band error signal written at end of stream
      if (text.includes('\n__STREAM_ERROR__:')) {
        throw new Error(text.split('\n__STREAM_ERROR__:').pop()!.trim())
      }

      // Extract the JSON object from the raw Claude text
      const firstBrace = text.indexOf('{')
      const lastBrace = text.lastIndexOf('}')
      if (firstBrace === -1 || lastBrace <= firstBrace) {
        throw new Error(
          `Unexpected stream response: ${text.slice(0, 200).replace(/\s+/g, ' ')}`
        )
      }

      const jsonStr = text.slice(firstBrace, lastBrace + 1)

      // Detect truncation before attempting parse — a truncated stream won't
      // end with '}' or will have mismatched braces
      const isTruncated =
        !text.trimEnd().endsWith('}') ||
        (jsonStr.split('{').length - 1) !== (jsonStr.split('}').length - 1)

      let program: GeneratedProgram
      try {
        program = JSON.parse(jsonStr) as GeneratedProgram
      } catch {
        if (isTruncated) {
          throw new Error(
            'The response was cut off before completing. Please try again — ' +
            'this occasionally happens when generating complex programs.'
          )
        }
        throw new Error(
          `Could not read the generated program. Please try again.`
        )
      }

      if (!program.overview || !program.program || !Array.isArray(program.program.phasedWeeks)) {
        throw new Error('Invalid program structure received from server')
      }

      setProgram(program)
      setStatus('success')
      sessionStorage.setItem('programforge_program', JSON.stringify(program))
      sessionStorage.setItem('programforge_generated_at', new Date().toISOString())
      return program
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

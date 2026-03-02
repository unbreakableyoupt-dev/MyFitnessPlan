import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { FormData } from '@/lib/types'
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts'
import { GeneratedProgram, GenerateProgramResponse, ErrorCode } from '@/lib/programTypes'

// ─── Vercel Runtime Config ────────────────────────────────────────────────────
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 120 // seconds — requires Vercel Pro for >60s

// ─── Model ───────────────────────────────────────────────────────────────────
const MODEL = 'claude-sonnet-4-5-20250929'
const MAX_TOKENS = 8192

// ─── Anthropic Client ─────────────────────────────────────────────────────────
function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set')
  }
  return new Anthropic({ apiKey })
}

// ─── Request Validation ───────────────────────────────────────────────────────

interface ValidationError {
  field: string
  message: string
}

function validateFormData(data: unknown): { valid: true; formData: FormData } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: [{ field: 'body', message: 'Request body must be an object' }] }
  }

  const d = data as Record<string, unknown>

  // Sex
  if (!['male', 'female'].includes(d.sex as string)) {
    errors.push({ field: 'sex', message: 'Must be "male" or "female"' })
  }

  // Age
  const age = Number(d.age)
  if (!Number.isInteger(age) || age < 13 || age > 99) {
    errors.push({ field: 'age', message: 'Must be an integer between 13 and 99' })
  }

  // Bodyweight
  const bw = Number(d.bodyweight)
  if (!bw || bw <= 0 || bw > 1500) {
    errors.push({ field: 'bodyweight', message: 'Must be a positive number' })
  }

  // Weight unit
  if (!['lbs', 'kg'].includes(d.weightUnit as string)) {
    errors.push({ field: 'weightUnit', message: 'Must be "lbs" or "kg"' })
  }

  // Height
  if (d.heightUnit === 'imperial') {
    if (d.heightFeet === '' || d.heightFeet === undefined) {
      errors.push({ field: 'heightFeet', message: 'Required for imperial height' })
    }
  } else if (d.heightUnit === 'metric') {
    const cm = Number(d.heightCm)
    if (!cm || cm < 100 || cm > 250) {
      errors.push({ field: 'heightCm', message: 'Must be between 100–250 cm' })
    }
  } else {
    errors.push({ field: 'heightUnit', message: 'Must be "imperial" or "metric"' })
  }

  // Body fat tier
  if (!d.bodyFatTier || typeof d.bodyFatTier !== 'string') {
    errors.push({ field: 'bodyFatTier', message: 'Body fat tier selection is required' })
  }

  // Primary goal
  const validGoals = ['hypertrophy', 'strength', 'fat_loss', 'recomp', 'sport_specific']
  if (!validGoals.includes(d.primaryGoal as string)) {
    errors.push({ field: 'primaryGoal', message: `Must be one of: ${validGoals.join(', ')}` })
  }

  // Experience level
  const validLevels = ['beginner', 'intermediate', 'advanced', 'elite']
  if (!validLevels.includes(d.experienceLevel as string)) {
    errors.push({ field: 'experienceLevel', message: `Must be one of: ${validLevels.join(', ')}` })
  }

  // Days per week
  const days = Number(d.daysPerWeek)
  if (!Number.isInteger(days) || days < 2 || days > 7) {
    errors.push({ field: 'daysPerWeek', message: 'Must be an integer between 2 and 7' })
  }

  // Minutes per session
  const validMinutes = [10, 20, 30, 45, 60, 90]
  if (!validMinutes.includes(Number(d.minutesPerSession))) {
    errors.push({ field: 'minutesPerSession', message: `Must be one of: ${validMinutes.join(', ')}` })
  }

  // Equipment — must be a non-empty array of valid IDs
  const validEquipment = ['bodyweight', 'dumbbells', 'barbells', 'machines', 'cables', 'resistance_bands', 'pull_up_bar', 'trx', 'full_gym']
  if (!Array.isArray(d.equipmentAccess) || (d.equipmentAccess as string[]).length === 0) {
    errors.push({ field: 'equipmentAccess', message: 'At least one equipment option must be selected' })
  } else {
    const invalid = (d.equipmentAccess as string[]).filter((e) => !validEquipment.includes(e))
    if (invalid.length > 0) {
      errors.push({ field: 'equipmentAccess', message: `Unknown equipment IDs: ${invalid.join(', ')}` })
    }
  }

  // Nutrition add-on: if true, method is required
  if (d.nutritionAddOn === true) {
    if (!['macro_based', 'hand_portion'].includes(d.nutritionMethod as string)) {
      errors.push({ field: 'nutritionMethod', message: 'Required when nutrition add-on is selected' })
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return { valid: true, formData: d as unknown as FormData }
}

// ─── JSON Extraction ──────────────────────────────────────────────────────────

/**
 * Robustly extract a JSON object from Claude's response.
 * Handles cases where Claude wraps output in markdown fences despite instructions.
 */
function extractJSON(text: string): string {
  const trimmed = text.trim()

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/)
  if (fenceMatch) {
    return fenceMatch[1].trim()
  }

  // Strip single backtick wrapping
  if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
    return trimmed.slice(1, -1).trim()
  }

  // Find first `{` and last `}` — handles any preamble/postamble text
  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1)
  }

  return trimmed
}

/**
 * Parse and lightly validate Claude's JSON response.
 * Throws with a descriptive message if parsing fails or required keys are missing.
 */
function parseAndValidateProgram(raw: string): GeneratedProgram {
  let parsed: unknown

  try {
    const jsonStr = extractJSON(raw)
    parsed = JSON.parse(jsonStr)
  } catch (err) {
    throw new Error(
      `JSON parse failed: ${err instanceof Error ? err.message : 'Unknown parse error'}. ` +
      `Raw response preview: ${raw.slice(0, 200)}`
    )
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Parsed response is not an object')
  }

  const p = parsed as Record<string, unknown>

  // Verify top-level keys exist
  const required = ['overview', 'program', 'progression', 'deload', 'nutrition', 'faq']
  for (const key of required) {
    if (!(key in p)) {
      throw new Error(`Missing required key: "${key}" in Claude's response`)
    }
  }

  // Verify program.phasedWeeks exists and is non-empty
  const program = p.program as Record<string, unknown>
  if (!Array.isArray(program?.phasedWeeks) || program.phasedWeeks.length === 0) {
    throw new Error('program.phasedWeeks is missing or empty')
  }

  return parsed as GeneratedProgram
}

// ─── Retry Logic ──────────────────────────────────────────────────────────────

const RETRY_DELAYS_MS = [2000, 4000, 8000] // Exponential backoff

function isRetryableError(error: unknown): boolean {
  if (error instanceof Anthropic.APIConnectionError) return true
  if (error instanceof Anthropic.APIConnectionTimeoutError) return true
  if (error instanceof Anthropic.RateLimitError) return true
  if (error instanceof Anthropic.InternalServerError) return true
  return false
}

function getErrorCode(error: unknown): ErrorCode {
  if (error instanceof Anthropic.AuthenticationError) return 'AUTH_ERROR'
  if (error instanceof Anthropic.PermissionDeniedError) return 'AUTH_ERROR'
  if (error instanceof Anthropic.RateLimitError) return 'RATE_LIMITED'
  if (error instanceof Anthropic.APIConnectionTimeoutError) return 'TIMEOUT'
  if (error instanceof Anthropic.APIConnectionError) return 'TIMEOUT'
  if (error instanceof Anthropic.BadRequestError) return 'INVALID_REQUEST'
  return 'INTERNAL_ERROR'
}

function getUserFacingMessage(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    return 'Service configuration error. Please try again later.'
  }
  if (error instanceof Anthropic.RateLimitError) {
    return 'Our AI service is under high demand. Please try again in a moment.'
  }
  if (error instanceof Anthropic.APIConnectionTimeoutError || error instanceof Anthropic.APIConnectionError) {
    return 'The request timed out. Your program may be complex — please try again.'
  }
  if (error instanceof Error && error.message.includes('JSON parse failed')) {
    return 'Program generation completed but formatting failed. Please try again.'
  }
  return 'Program generation failed. Please try again.'
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callClaudeWithRetry(
  client: Anthropic,
  userPrompt: string,
  maxRetries = 3
): Promise<string> {
  let lastError: unknown = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Exponential backoff for retries (not first attempt)
    if (attempt > 0) {
      const delayMs = RETRY_DELAYS_MS[attempt - 1] ?? 8000
      console.warn(`[generate-program] Retry attempt ${attempt}/${maxRetries} after ${delayMs}ms`)
      await sleep(delayMs)
    }

    try {
      const message = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      })

      // Extract text from response
      const content = message.content[0]
      if (!content || content.type !== 'text') {
        throw new Error('Unexpected response format from Claude — no text content')
      }

      console.log(
        `[generate-program] Success on attempt ${attempt + 1}. ` +
        `Input tokens: ${message.usage.input_tokens}, Output tokens: ${message.usage.output_tokens}`
      )

      return content.text
    } catch (error) {
      lastError = error

      // Don't retry on non-retryable errors
      if (!isRetryableError(error)) {
        console.error('[generate-program] Non-retryable error:', error)
        break
      }

      // Don't retry if we've exhausted all attempts
      if (attempt === maxRetries) {
        console.error(`[generate-program] All ${maxRetries + 1} attempts failed`)
        break
      }

      console.warn('[generate-program] Retryable error, will retry:', error)
    }
  }

  throw lastError
}

// ─── Error Response Helper ────────────────────────────────────────────────────

function errorResponse(
  message: string,
  code: ErrorCode,
  status: number
): NextResponse<GenerateProgramResponse> {
  const body: GenerateProgramResponse = { success: false, error: message, code }
  return NextResponse.json(body, { status })
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<GenerateProgramResponse>> {
  const requestId = crypto.randomUUID().slice(0, 8)
  const startTime = Date.now()
  console.log(`[generate-program][${requestId}] Request received`)

  // ── 1. Parse request body ──────────────────────────────────────────────────
  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return errorResponse('Invalid JSON in request body', 'INVALID_REQUEST', 400)
  }

  // Body must be { formData: FormData }
  if (!rawBody || typeof rawBody !== 'object' || !('formData' in rawBody)) {
    return errorResponse('Request body must contain a "formData" key', 'INVALID_REQUEST', 400)
  }

  // ── 2. Validate form data ──────────────────────────────────────────────────
  const validation = validateFormData((rawBody as Record<string, unknown>).formData)
  if (!validation.valid) {
    const errorMessages = validation.errors.map((e) => `${e.field}: ${e.message}`).join('; ')
    return errorResponse(`Validation failed — ${errorMessages}`, 'INVALID_REQUEST', 400)
  }

  const { formData } = validation

  // ── 3. Build prompt ────────────────────────────────────────────────────────
  const userPrompt = buildUserPrompt(formData)
  console.log(
    `[generate-program][${requestId}] Prompt built. ` +
    `Goal: ${formData.primaryGoal}, Level: ${formData.experienceLevel}, ` +
    `Days: ${formData.daysPerWeek}x${formData.minutesPerSession}min, ` +
    `Nutrition: ${formData.nutritionAddOn}`
  )

  // ── 4. Initialize Anthropic client ─────────────────────────────────────────
  let client: Anthropic
  try {
    client = getAnthropicClient()
  } catch {
    console.error(`[generate-program][${requestId}] Failed to initialize Anthropic client`)
    return errorResponse('Service configuration error', 'AUTH_ERROR', 500)
  }

  // ── 5. Call Claude with retry logic ────────────────────────────────────────
  let rawResponse: string
  try {
    rawResponse = await callClaudeWithRetry(client, userPrompt)
  } catch (error) {
    const code = getErrorCode(error)
    const message = getUserFacingMessage(error)
    const httpStatus =
      code === 'AUTH_ERROR' ? 500
      : code === 'RATE_LIMITED' ? 429
      : code === 'TIMEOUT' ? 504
      : 500

    console.error(`[generate-program][${requestId}] Claude call failed:`, error)
    return errorResponse(message, code, httpStatus)
  }

  // ── 6. Parse & validate JSON response ─────────────────────────────────────
  let program: GeneratedProgram
  try {
    program = parseAndValidateProgram(rawResponse)
  } catch (error) {
    const parseMsg = error instanceof Error ? error.message : 'Unknown parse error'
    console.error(`[generate-program][${requestId}] Parse failed: ${parseMsg}`)
    // Log the raw response for debugging (truncated)
    console.error(`[generate-program][${requestId}] Raw response (first 500 chars): ${rawResponse.slice(0, 500)}`)
    return errorResponse(getUserFacingMessage(error), 'PARSE_ERROR', 500)
  }

  // ── 7. Return success ──────────────────────────────────────────────────────
  const elapsed = Date.now() - startTime
  console.log(`[generate-program][${requestId}] Success in ${elapsed}ms`)

  const successBody: GenerateProgramResponse = {
    success: true,
    program,
    generatedAt: new Date().toISOString(),
    modelUsed: MODEL,
  }

  return NextResponse.json(successBody, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store', // Programs are unique — never cache
      'X-Request-Id': requestId,
      'X-Generation-Time': `${elapsed}ms`,
    },
  })
}

// ─── Health check ─────────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY)
  return NextResponse.json({
    status: 'ok',
    model: MODEL,
    apiKeyConfigured: hasKey,
    timestamp: new Date().toISOString(),
  })
}

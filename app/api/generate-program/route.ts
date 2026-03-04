import '@anthropic-ai/sdk/shims/node'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { FormData } from '@/lib/types'
import { getSystemPrompt, buildUserPrompt } from '@/lib/prompts'

// ─── Vercel Runtime Config ────────────────────────────────────────────────────
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// ─── Models ──────────────────────────────────────────────────────────────────
const PRIMARY_MODEL = 'claude-sonnet-4-5'       // preferred — higher quality
const FALLBACK_MODEL = 'claude-haiku-4-5-20251001' // used when primary is overloaded
const MAX_TOKENS = 8000

// ─── Anthropic Client ─────────────────────────────────────────────────────────
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    console.warn('[generate-program] ANTHROPIC_API_KEY is not set or is empty')
    return null
  }
  const trimmed = apiKey.trim()
  console.log(
    `[generate-program] ANTHROPIC_API_KEY found — length: ${trimmed.length}, ` +
    `prefix: ${trimmed.slice(0, 7)}..., suffix: ...${trimmed.slice(-4)}`
  )
  return new Anthropic({ apiKey: trimmed })
}

// ─── Mock (no API key configured) ────────────────────────────────────────────
const MOCK_TEXT = `## YOUR PERSONALIZED FITNESS PROGRAM
[TEST MODE — Configure ANTHROPIC_API_KEY for real generation]

**Split:** Upper/Lower · 4 days/week · 12 weeks · 3 phases
**Goal:** Muscle Building | **Level:** Intermediate
**Philosophy:** Progressive overload through systematic volume and intensity manipulation — every week you are stronger than the last.

---

## PHASE 1 — ACCUMULATION (Weeks 1–4)
Focus: Volume accumulation, movement quality, RPE calibration.

### Day 1 — Upper A (Horizontal Push/Pull)
Warm-up: Band pull-aparts ×15, arm swings, push-ups ×10.
1. Barbell Bench Press — 4×6-8 @ RPE 7 | 3 min | Retract scapula, bar to mid-chest
2. Barbell Row — 4×6-8 @ RPE 7 | 3 min | Hinge 45°, pull to lower sternum
3. Incline DB Press — 3×10-12 @ RPE 7 | 90 sec | 30° incline, neutral grip
4. Seated Cable Row — 3×10-12 @ RPE 7 | 90 sec | Chest tall, elbows in
5. Dead Bug — 3×8/side @ RPE 6 | 60 sec | Back pressed to floor
Cool-down: Doorway chest stretch, lat hang 30s.

### Day 2 — Lower A (Squat Focus)
Warm-up: Hip circles, bodyweight squat ×15, glute bridge ×15.
1. Barbell Back Squat — 4×6-8 @ RPE 7 | 3 min | Brace 360°, crease below parallel
2. Romanian Deadlift — 3×8-10 @ RPE 7 | 2 min | Hip hinge, feel hamstring stretch
3. Bulgarian Split Squat — 3×8-10/leg @ RPE 7 | 90 sec | Rear foot elevated
4. Leg Press — 3×12-15 @ RPE 7 | 90 sec | Full ROM, no knee lockout
5. Plank — 3×45 sec @ RPE 6 | 60 sec | Squeeze glutes, breathe throughout
Cool-down: Pigeon stretch 60s/side, standing quad stretch.

---

## PHASE 2 — INTENSIFICATION (Weeks 5–8)
Focus: Heavier loads, higher intensity, RPE 7.5–8.5.

### Day 1 — Upper A
Warm-up: Band pull-aparts ×15, push-up ×10 with pause.
1. Barbell Bench Press — 4×4-6 @ RPE 8 | 3-4 min | Add 2.5–5 kg from Phase 1
2. Barbell Row — 4×4-6 @ RPE 8 | 3-4 min | Match bench progression
3. Incline DB Press — 3×8-10 @ RPE 8 | 2 min | Increase load
4. Cable Row — 3×8-10 @ RPE 8 | 2 min | Strict form
5. Hanging Knee Raise — 3×12-15 @ RPE 7 | 60 sec | Control swing
Cool-down: Banded chest stretch, thoracic extension over roller.

---

## PROGRESSION
- **Method:** RPE-Based Double Progression
- When you hit the top of a rep range at the prescribed RPE for 2 sessions → add the smallest increment
- Phase 1: RPE 7 (3 reps in reserve) | Phase 2: RPE 8 (2 in reserve) | Phase 3: RPE 8.5–9
- Accessory work: progress when you exceed top of rep range by 2+ reps

## DELOAD PROTOCOL
Every 4th week, reduce volume by 50% and intensity to RPE 5–6. Maintain movement frequency — just less of it. A deload is when your gains actually lock in.

## FAQ
Q: What if I miss a session?
A: Skip it and continue from where you left off. Consistency over weeks matters far more than any single session.

Q: When should I increase the weight?
A: When you hit the top of your rep range for 2 consecutive sessions at the correct RPE, add the smallest available increment.

Q: What does RPE 7 feel like?
A: You finish the set feeling like you could have done 3 more clean reps — challenging but fully controlled.`

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

  if (!['male', 'female'].includes(d.sex as string)) {
    errors.push({ field: 'sex', message: 'Must be "male" or "female"' })
  }

  const age = Number(d.age)
  if (!Number.isInteger(age) || age < 13 || age > 99) {
    errors.push({ field: 'age', message: 'Must be an integer between 13 and 99' })
  }

  const bw = Number(d.bodyweight)
  if (!bw || bw <= 0 || bw > 1500) {
    errors.push({ field: 'bodyweight', message: 'Must be a positive number' })
  }

  if (!['lbs', 'kg'].includes(d.weightUnit as string)) {
    errors.push({ field: 'weightUnit', message: 'Must be "lbs" or "kg"' })
  }

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

  if (!d.bodyFatTier || typeof d.bodyFatTier !== 'string') {
    errors.push({ field: 'bodyFatTier', message: 'Body fat tier selection is required' })
  }

  const validGoals = ['hypertrophy', 'strength', 'fat_loss', 'recomp', 'sport_specific']
  if (!validGoals.includes(d.primaryGoal as string)) {
    errors.push({ field: 'primaryGoal', message: `Must be one of: ${validGoals.join(', ')}` })
  }

  const validLevels = ['beginner', 'intermediate', 'advanced', 'elite']
  if (!validLevels.includes(d.experienceLevel as string)) {
    errors.push({ field: 'experienceLevel', message: `Must be one of: ${validLevels.join(', ')}` })
  }

  const days = Number(d.daysPerWeek)
  if (!Number.isInteger(days) || days < 2 || days > 7) {
    errors.push({ field: 'daysPerWeek', message: 'Must be an integer between 2 and 7' })
  }

  const validMinutes = [10, 20, 30, 45, 60, 90]
  if (!validMinutes.includes(Number(d.minutesPerSession))) {
    errors.push({ field: 'minutesPerSession', message: `Must be one of: ${validMinutes.join(', ')}` })
  }

  const validEquipment = ['bodyweight', 'dumbbells', 'barbells', 'machines', 'cables', 'resistance_bands', 'pull_up_bar', 'trx', 'roman_chair', 'full_gym']
  if (!Array.isArray(d.equipmentAccess) || (d.equipmentAccess as string[]).length === 0) {
    errors.push({ field: 'equipmentAccess', message: 'At least one equipment option must be selected' })
  } else {
    const invalid = (d.equipmentAccess as string[]).filter((e) => !validEquipment.includes(e))
    if (invalid.length > 0) {
      errors.push({ field: 'equipmentAccess', message: `Unknown equipment IDs: ${invalid.join(', ')}` })
    }
  }

  if (d.nutritionAddOn === true) {
    if (!['macro_based', 'hand_portion'].includes(d.nutritionMethod as string)) {
      errors.push({ field: 'nutritionMethod', message: 'Required when nutrition add-on is selected' })
    }
  }

  if (errors.length > 0) return { valid: false, errors }
  return { valid: true, formData: d as unknown as FormData }
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const requestId = crypto.randomUUID().slice(0, 8)
  console.log(`[generate-program][${requestId}] POST received`)

  // ── OUTER guard: every possible throw ends up as valid JSON ──────────────────
  try {
    // 1. Parse body
    let rawBody: unknown
    try {
      rawBody = await req.json()
    } catch (parseErr) {
      console.error(`[generate-program][${requestId}] Body parse error:`, parseErr)
      return NextResponse.json({ success: false, error: 'Invalid JSON in request body' }, { status: 400 })
    }

    if (!rawBody || typeof rawBody !== 'object' || !('formData' in rawBody)) {
      return NextResponse.json({ success: false, error: 'Request body must contain a "formData" key' }, { status: 400 })
    }

    // 2. Validate
    const validation = validateFormData((rawBody as Record<string, unknown>).formData)
    if (!validation.valid) {
      const msg = validation.errors.map((e) => `${e.field}: ${e.message}`).join('; ')
      console.warn(`[generate-program][${requestId}] Validation failed: ${msg}`)
      return NextResponse.json({ success: false, error: `Validation failed — ${msg}` }, { status: 400 })
    }

    const { formData } = validation
    console.log(
      `[generate-program][${requestId}] Validated — ` +
      `goal: ${formData.primaryGoal}, level: ${formData.experienceLevel}, ` +
      `days: ${formData.daysPerWeek}, email: ${formData.email ? '✓' : '(none)'}`
    )

    // 3. Build prompt
    let userPrompt: string
    try {
      userPrompt = buildUserPrompt(formData)
      console.log(`[generate-program][${requestId}] Prompt built — ${userPrompt.length} chars`)
    } catch (promptErr) {
      console.error(`[generate-program][${requestId}] buildUserPrompt threw:`, promptErr)
      return NextResponse.json({ success: false, error: 'Failed to build prompt — please try again.' }, { status: 500 })
    }

    // 4. Return mock if no API key
    const client = getAnthropicClient()
    if (!client) {
      console.warn(`[generate-program][${requestId}] No API key — returning mock program`)
      return NextResponse.json({
        success: true,
        text: MOCK_TEXT,
        generatedAt: new Date().toISOString(),
        modelUsed: 'mock',
      })
    }

    // 5. Call Claude — try Sonnet first, fall back to Haiku if Sonnet is overloaded
    const systemPrompt = getSystemPrompt(formData)
    let message: Anthropic.Message
    let modelUsed = PRIMARY_MODEL

    const callClaude = (model: string) => {
      console.log(`[generate-program][${requestId}] Calling Anthropic — model: ${model}, max_tokens: ${MAX_TOKENS}`)
      return client.messages.create({
        model,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      })
    }

    try {
      try {
        message = await callClaude(PRIMARY_MODEL)
      } catch (primaryErr) {
        // Sonnet overloaded → silently fall back to Haiku, no error exposed to client
        if (primaryErr instanceof Anthropic.InternalServerError && primaryErr.status === 529) {
          console.warn(`[generate-program][${requestId}] ${PRIMARY_MODEL} overloaded — falling back to ${FALLBACK_MODEL}`)
          modelUsed = FALLBACK_MODEL
          message = await callClaude(FALLBACK_MODEL)
        } else {
          throw primaryErr // re-throw anything that isn't a 529 overload
        }
      }
    } catch (apiErr) {
      // Log the raw error so we can see exactly what Anthropic returned
      console.error(`[generate-program][${requestId}] Anthropic API error:`, apiErr)
      console.error(`[generate-program][${requestId}] Error type:`, apiErr?.constructor?.name)
      console.error(
        `[generate-program][${requestId}] Error details:`,
        JSON.stringify(apiErr, Object.getOwnPropertyNames(apiErr ?? {}))
      )

      let msg = 'Failed to generate program — please try again.'
      let retryable = false
      if (apiErr instanceof Anthropic.AuthenticationError || apiErr instanceof Anthropic.PermissionDeniedError) {
        msg = `API key rejected by Anthropic (${apiErr instanceof Anthropic.AuthenticationError ? 'AuthenticationError' : 'PermissionDenied'}) — check that ANTHROPIC_API_KEY is correct and active.`
      } else if (apiErr instanceof Anthropic.RateLimitError) {
        msg = 'Rate limited by Anthropic — please wait a moment and try again.'
        retryable = true
      } else if (apiErr instanceof Anthropic.APIConnectionTimeoutError) {
        msg = 'Anthropic request timed out — please try again.'
        retryable = true
      } else if (apiErr instanceof Anthropic.APIConnectionError) {
        msg = 'Could not connect to Anthropic — check network and try again.'
      } else if (apiErr instanceof Anthropic.BadRequestError) {
        msg = `Bad request to Anthropic: ${(apiErr as Error).message}`
      } else if (apiErr instanceof Anthropic.InternalServerError) {
        if (apiErr.status === 529) {
          msg = 'Anthropic is temporarily overloaded — please wait a few seconds and try again.'
          retryable = true
        } else {
          msg = 'Anthropic server error — please try again.'
        }
      } else if (apiErr instanceof Error) {
        msg = `Anthropic error: ${apiErr.message}`
      }
      return NextResponse.json({ success: false, error: msg, retryable }, { status: 502 })
    }

    // 6. Extract text
    console.log(
      `[generate-program][${requestId}] Anthropic responded — ` +
      `model: ${modelUsed}, stop_reason: ${message.stop_reason}, ` +
      `in: ${message.usage.input_tokens} tokens, out: ${message.usage.output_tokens} tokens`
    )

    const content = message.content[0]
    if (!content || content.type !== 'text') {
      console.error(`[generate-program][${requestId}] Unexpected content type:`, message.content)
      return NextResponse.json({ success: false, error: 'Unexpected response format from Anthropic.' }, { status: 502 })
    }

    console.log(`[generate-program][${requestId}] Response preview: ${content.text.slice(0, 120).replace(/\n/g, ' ')}`)

    return NextResponse.json({
      success: true,
      text: content.text,
      generatedAt: new Date().toISOString(),
      modelUsed,
    })

  } catch (outerErr) {
    // Catch-all: something completely unexpected threw — still return JSON
    console.error(`[generate-program][${requestId}] UNHANDLED exception:`, outerErr)
    const msg = outerErr instanceof Error ? outerErr.message : String(outerErr)
    return NextResponse.json(
      { success: false, error: `Unexpected server error: ${msg}` },
      { status: 500 }
    )
  }
}

// ─── Health Check ─────────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    model: process.env.ANTHROPIC_API_KEY ? `${PRIMARY_MODEL} (fallback: ${FALLBACK_MODEL})` : 'mock (no API key)',
    timestamp: new Date().toISOString(),
  })
}

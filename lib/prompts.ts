import { FormData } from './types'

// ─── System Prompt ────────────────────────────────────────────────────────────

export const SYSTEM_PROMPT = `You are an elite strength and conditioning coach. Generate a complete, personalized training program in plain text.

OUTPUT FORMAT — use exactly this structure:

## YOUR PERSONALIZED PROGRAM
(2-3 lines: split name, days/week, duration, one-sentence philosophy tailored to this person)

## PHASE 1 — [LABEL] (Weeks 1–4)
Focus: [one line]

### Day 1 — [Day Name]
Warm-up: [one sentence]
1. [Exercise] — [sets]×[reps] @ RPE [X] | [rest] | [brief coaching note ≤8 words]
2. ...
(max 5 exercises per day)
Cool-down: [one sentence]

### Day 2 — [Day Name]
(same structure)

(repeat for all training days in this phase)

## PHASE 2 — [LABEL] (Weeks 5–8)
(same structure — increase intensity, reduce rep ranges vs Phase 1)

## PHASE 3 — [LABEL] (Weeks 9–12)
(same structure — peak intensity)

## HOW TO PROGRESS
- [Method name]: [1-2 sentences on when/how to add weight]
- [2-3 bullet points of key rules]

## DELOAD
Every [N]th week: [2-3 sentences on how to deload]

## NUTRITION
(include ONLY if the user requested nutrition; skip this section entirely if not)
[Daily calorie target, protein/carb/fat grams, key timing notes — 4-6 bullet points]

## FAQ
Q: [relevant question for this person]
A: [1-2 sentence answer]

Q: [second question]
A: [answer]

Q: [third question]
A: [answer]

RULES:
- Output plain text only. No JSON, no code fences, no markdown tables.
- Generate exactly 3 training phases (Weeks 1–4 / 5–8 / 9–12).
- Each phase shows one representative training week.
- Maximum 5 exercises per day.
- Cover all 8 movement patterns per week: Squat, Hinge, Horizontal Push, Horizontal Pull, Vertical Push, Vertical Pull, Single-Leg, Core.
- Use ONLY exercises appropriate for the stated equipment.
- Phase 1→2→3: progressively heavier loads, lower rep ranges, higher RPE.
- Be specific — real exercise names, real numbers. No generic filler.`

// ─── User Prompt Builder ──────────────────────────────────────────────────────

const BF_TIER_LABELS: Record<string, string> = {
  male_8_10: '~8–10% (Very lean — visible abs, striations)',
  male_12_15: '~12–15% (Athletic — abs visible when flexed)',
  male_16_19: '~16–19% (Fit — slight belly, arms defined)',
  male_20_24: '~20–24% (Average — soft build, minimal definition)',
  male_25_plus: '~25%+ (Higher body fat — rounded appearance)',
  female_18_20: '~18–20% (Athletic — visible abs, toned)',
  female_21_24: '~21–24% (Fit — lean, minimal belly)',
  female_25_29: '~25–29% (Average — soft curves)',
  female_30_plus: '~30%+ (Higher body fat — rounded appearance)',
}

const GOAL_LABELS: Record<string, string> = {
  hypertrophy: 'Hypertrophy (maximum muscle size)',
  strength: 'Strength (maximize 1–5 rep strength on compound lifts)',
  fat_loss: 'Fat Loss (reduce body fat while preserving muscle)',
  recomp: 'Body Recomposition (lose fat and build muscle simultaneously)',
  sport_specific: 'Sport-Specific Athletic Performance',
}

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'Beginner (< 1 year consistent training)',
  intermediate: 'Intermediate (1–3 years structured training)',
  advanced: 'Advanced (3–6 years serious training)',
  elite: 'Elite (6+ years, competition or high-performance)',
}

const EQUIPMENT_LABELS: Record<string, string> = {
  bodyweight: 'Bodyweight only',
  dumbbells: 'Dumbbells',
  barbells: 'Barbells + squat rack',
  machines: 'Weight machines',
  cables: 'Cable machines',
  resistance_bands: 'Resistance bands',
  pull_up_bar: 'Pull-up bar',
  trx: 'TRX / suspension trainer',
  full_gym: 'Full commercial gym',
}

function formatHeightForPrompt(formData: FormData): string {
  if (formData.heightUnit === 'imperial') {
    const feet = formData.heightFeet !== '' ? formData.heightFeet : 0
    const inches = formData.heightInches !== '' ? formData.heightInches : 0
    return `${feet}'${inches}"`
  }
  return `${formData.heightCm} cm`
}

function getBFLabel(formData: FormData): string {
  if (!formData.bodyFatTier) return 'Not specified'
  return BF_TIER_LABELS[formData.bodyFatTier] ?? formData.bodyFatTier
}

export function buildUserPrompt(formData: FormData): string {
  const goalLabel = GOAL_LABELS[formData.primaryGoal] ?? formData.primaryGoal
  const experienceLabel = EXPERIENCE_LABELS[formData.experienceLevel] ?? formData.experienceLevel
  const equipmentList = Array.isArray(formData.equipmentAccess)
    ? formData.equipmentAccess.map((e) => EQUIPMENT_LABELS[e] ?? e).join(', ')
    : (EQUIPMENT_LABELS[formData.equipmentAccess as string] ?? formData.equipmentAccess)
  const hasNutrition = formData.nutritionAddOn === true

  const lines: string[] = []

  lines.push('Generate a personalized 12-week training program for this person:')
  lines.push('')
  lines.push(`Sex: ${formData.sex === 'male' ? 'Male' : 'Female'}`)
  lines.push(`Age: ${formData.age}`)
  lines.push(`Bodyweight: ${formData.bodyweight} ${formData.weightUnit}`)
  lines.push(`Height: ${formatHeightForPrompt(formData)}`)
  lines.push(`Body fat: ${getBFLabel(formData)}`)
  lines.push(`Goal: ${goalLabel}`)
  lines.push(`Experience: ${experienceLabel}`)
  lines.push(`Training days/week: ${formData.daysPerWeek}`)
  lines.push(`Session length: ${formData.minutesPerSession} min`)
  lines.push(`Equipment: ${equipmentList}`)

  if (formData.primaryGoal === 'sport_specific' && formData.sport) {
    lines.push(`Sport: ${formData.sport}`)
  }

  if (formData.injuries && formData.injuries.trim()) {
    lines.push(`Injuries/limitations: ${formData.injuries.trim()}`)
    lines.push('Modify all exercises to respect these limitations.')
  }

  if (typeof formData.age === 'number' && formData.age >= 50) {
    lines.push('Note: 50+ trainee — apply ~20% volume reduction.')
  }

  lines.push('')
  if (hasNutrition) {
    const method =
      formData.nutritionMethod === 'macro_based'
        ? 'macro-based (include specific calorie, protein, carb, fat targets)'
        : 'hand-portion method (use palm/hand/thumb/fist guides, no calorie counting)'
    lines.push(`Include a nutrition plan using the ${method}.`)
  } else {
    lines.push('No nutrition plan needed — training program only.')
  }

  lines.push('')
  lines.push('Generate exactly 3 FAQ items relevant to this specific person.')
  lines.push('Keep all text concise. Follow the output format from your instructions.')

  return lines.join('\n')
}


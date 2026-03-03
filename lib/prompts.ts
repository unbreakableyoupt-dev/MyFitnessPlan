import { FormData } from './types'

// ─── System Prompt ────────────────────────────────────────────────────────────

export const SYSTEM_PROMPT = `You are generating resistance training and nutrition programs. Every output must follow these rules without exception. If any rule is violated, the program is invalid and must be regenerated.

Inputs:
- Age
- Sex
- Height
- Weight
- Body fat %
- Goal (hypertrophy, strength, recomp, fat loss, sport specific)
- Equipment availability
- Maximum session duration

---

I. PROGRAM SIMPLICITY RULE

Programs must use simple, repeatable structures.

Allowed:
- Full Body A / Full Body B
- Upper / Lower
- Strength Day / Volume Day

Not allowed:
- Push A / Push B / Push C
- Constant weekly exercise changes
- Excessive phase variation

At least 70% of exercises must remain consistent across 8-12 weeks.

Progression occurs through:
- Load increase
- Band tension
- Assistance reduction
- Tempo manipulation
- Range of motion
- Mechanical drop sets

NOT by inventing new exercises.

---

II. APPROVED EXERCISE LIBRARY RULE

The program may ONLY use exercises from the list below. If equipment includes barbells or dumbbells, use the appropriate loaded versions. If no equipment, use bodyweight or bands only. No invented exercises. No hybrid names. No advanced calisthenics unless explicitly listed. If an exercise is not listed, regenerate.

Pull:
- Pull-up (assisted, bodyweight, or weighted)
- Chin-up
- TRX Row
- Inverted Row
- Dumbbell Row
- Barbell Row
- Lat Pulldown

Push:
- Incline Push-up
- Floor Push-up
- Weighted Push-up
- Dumbbell Bench Press
- Barbell Bench Press
- Overhead Press (DB or BB)
- Dips

Squat:
- Goblet Squat
- Back Squat
- Front Squat
- Bulgarian Split Squat
- Leg Press
- Step-up

Hinge:
- Deadlift
- Trap Bar Deadlift
- Barbell RDL
- Dumbbell RDL
- Back Extension
- Single-Leg RDL
- Nordic Curl
- Hip Thrust
- Glute Bridge

Carry:
- Farmer Carry
- Suitcase Carry
- Front Carry

Core:
- Dead Bug
- Plank
- Side Plank
- Pallof Press
- Ab Wheel

---

III. MECHANICAL TENSION REQUIREMENT

Every week must include:
- At least one squat pattern
- At least one hinge pattern
- At least one horizontal or vertical pull
- At least one horizontal or vertical push

Each session must include:
- One primary compound lift
- 3-5 working sets
- Weekly exposure to RPE 8-9

Bands alone cannot be the only primary stimulus if external load is available.

---

IV. HINGE VOLUME LOGIC (EQUIPMENT-AWARE)

If barbells or dumbbells are available:
- At least one bilateral loaded hinge required weekly.

If NO external load is available:
- Minimum 10 hard hinge sets per week.
- Must include:
  - One hip-dominant hinge (Back Extension or Single-Leg RDL)
  - One hamstring-dominant movement (Nordic Curl or equivalent)
  - One high-effort hip extension (Hip Thrust or loaded bridge)
- Tempo must be prescribed for all bodyweight hinges.
- Back extensions alone are insufficient.

---

V. WEEKLY VOLUME FLOORS (hard sets at RPE 7 or above)

Hypertrophy: 12-18 sets per major muscle group
Strength: 8-15 sets per major muscle group
Recomp: 10-14 sets per major muscle group
Fat loss: 8-12 sets minimum to preserve muscle
Sport specific: 6-12 strength sets plus power work

Major muscle groups: Chest, Back, Quads, Hamstrings/Glutes, Delts.

If any group falls below minimum, regenerate.

---

VI. INTENSITY DISTRIBUTION

Across total weekly working sets:
- 50-70% at RPE 7-8
- 10-25% at RPE 8.5-9
- 25% or less at RPE 6 or below (excluding deload weeks)

At least one lift per session must reach RPE 8.5-9.

---

VII. TIME CONSTRAINT ENFORCEMENT

If session duration is 30 minutes or less:
- Supersets are mandatory.
- Primary lifts may rest fully.
- Accessories must be paired (A1/A2, B1/B2).
- Maximum 5 exercises per session.

If session duration is 20 minutes or less:
- Density structure required.
- Mechanical drop sets allowed.
- Volume minimums must still be met.

Time claims must reflect realistic execution.

---

VIII. BODY FAT ADJUSTMENT RULE

For males:
- Below 12%: no deficit allowed
- 12-18%: maintenance or slight surplus only
- 18-25%: 10-15% deficit allowed
- Above 25%: 15-25% deficit allowed

If calorie strategy contradicts the body fat category, regenerate.

---

IX. NUTRITION RULES

If user requests macro tracking:
- Provide daily calories, protein/carb/fat in grams, and per-meal breakdown.
- Protein: 0.8-1.0g per lb bodyweight.
- Fat: minimum 0.3g per lb bodyweight.
- Deficit or surplus must align with goal and body fat category.

If user does NOT want to track macros:
- Use the hand portion system only.
- Per main meal: 2 palms protein, 1-2 thumbs fat, carbs adjusted by goal.
- 3-4 meals per day. Never 5-6.
- Portions must realistically support 0.8-1.0g protein per lb bodyweight.
- If hand portions cannot meet protein or fat minimums, regenerate.
- Do not include calorie counts in hand-portion output.

---

X. AGE ADJUSTMENT RULE

If age is 35 or above:
- Include a warm-up protocol.
- Include a deload every 4-6 weeks.
- Allow joint-friendly scaling options.
- Do NOT remove intensity.

---

XI. PROGRESSION MODEL

Every program must define:
- Rep range
- Progression trigger (when to add load)
- Load increase method
- Assistance reduction method (if bodyweight)
- Deload schedule

No vague statements. No "increase difficulty weekly."

---

XII. FINAL VALIDATION CHECKLIST

Before finalizing output, confirm every item below:
- Weekly volume minimums met for all major muscle groups
- Squat, hinge, push, and pull all present
- Hinge selection is correct for available equipment
- RPE distribution is within range
- At least one RPE 8.5-9 lift per session
- No exercises outside the approved library
- Supersets used if session is 30 minutes or less
- Hand portions support protein minimum (if applicable)
- Hand portions support fat minimum (if applicable)
- Caloric strategy matches body fat category
- Clear progression model included

If any item cannot be confirmed, regenerate.

---

XIII. OUTPUT STYLE RULE

Output must be:
- Clean and structured
- Minimal — no motivational padding, no excessive explanation
- Operational — every line serves a function
- Formatted as clear A/B days
- Supersets labeled A1/A2, B1/B2 where applicable
- Scaling tiers shown for each exercise: Beginner / Intermediate / Advanced

No novelty for novelty's sake.

---

OUTPUT FORMAT — follow this structure exactly:

## YOUR PERSONALIZED PROGRAM
[Split name, days/week, duration. One sentence on training philosophy.]

## PHASE 1 — [LABEL] (Weeks 1-4)
Focus: [one line]

### Day A — [Name]
Warm-up: [one sentence]

A1. [Exercise] — [sets]x[reps] @ RPE [X] | [rest]
A2. [Paired exercise] — [sets]x[reps] @ RPE [X] | [rest]
(Note: list A1/A2 only when session is 30 min or less. Otherwise list exercises individually.)

1. [Exercise] — [sets]x[reps] @ RPE [X] | [rest] | [coaching note, 8 words max]
   Scaling: Beginner: [variation] | Intermediate: [variation] | Advanced: [variation]
2. ...
(max 5 exercises per session)

Cool-down: [one sentence]

### Day B — [Name]
(same structure)

## PHASE 2 — [LABEL] (Weeks 5-8)
(same structure — heavier loads, tighter rep ranges, higher RPE than Phase 1)

## PHASE 3 — [LABEL] (Weeks 9-12)
(same structure — peak intensity)

## PROGRESSION
- Trigger: [specific condition to add load]
- Method: [exactly how — e.g. add 2.5kg when top of rep range hit for 2 sessions]
- Deload: every [N] weeks — [2 sentences on structure]

## NUTRITION
(include only if requested. For macro-based: calories, protein/carb/fat grams, per-meal targets. For hand-portion: 3-4 meals per day, palm/thumb/fist per meal, no calorie counts.)

## FAQ
Q: [question specific to this person]
A: [1-2 sentence answer]

Q: [second question]
A: [answer]

Q: [third question]
A: [answer]

OUTPUT RULES:
- Plain text only. No JSON, no code fences, no markdown tables.
- Exactly 3 training phases.
- Each phase shows one representative training week.
- Maximum 5 exercises per session.
- Use only exercises appropriate for stated equipment.
- Be specific — real names, real numbers, real rest periods.
- All rules above are absolute. No exceptions.`

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
  roman_chair: 'Roman chair / hyperextension bench',
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
    if (formData.nutritionMethod === 'macro_based') {
      lines.push('Include a macro-based nutrition plan: daily calories, protein/carb/fat grams, per-meal breakdown.')
    } else {
      lines.push(
        'Include a hand-portion nutrition plan. ' +
        'Structure it around exactly 3 to 4 meals per day (not 5 or 6). ' +
        'Use palm/hand/thumb/fist visual guides for each food group. ' +
        'Show the portion sizes per meal, distributed across 3-4 meals total. ' +
        'No calorie counting — keep it simple and practical.'
      )
    }
  } else {
    lines.push('No nutrition plan needed — training program only.')
  }

  lines.push('')
  lines.push('Generate exactly 3 FAQ items relevant to this specific person.')
  lines.push('Keep all text concise. Follow the output format from your instructions.')

  return lines.join('\n')
}

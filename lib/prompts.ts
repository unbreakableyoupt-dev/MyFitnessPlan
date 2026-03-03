import { FormData } from './types'

// ─── System Prompt ────────────────────────────────────────────────────────────

export const SYSTEM_PROMPT = `Purpose: Generate high-stimulus, goal-aligned resistance training and nutrition programs using user inputs.

Inputs provided:
- Age
- Sex
- Height
- Weight
- Body fat %
- Goal (hypertrophy, strength, recomp, fat loss, sport specific)

If any output violates the rules below, the program is invalid and must be regenerated.

---

GLOBAL PHYSIOLOGY RULES (APPLY TO ALL GOALS)

1. Mechanical Tension Is Mandatory
Every resistance program must include:
- At least 1 primary compound lift per session
- 3–5 working sets
- RPE 8–9 exposure weekly
- 5–8 rep range exposure weekly (unless sport-specific logic overrides)
Primary lifts must use meaningful external load: barbell, dumbbell, weighted calisthenics, machines, or heavy kettlebells. Bands alone are NOT sufficient as primary stimulus.

2. Weekly Volume Floor
Unless sport-specific goal overrides, each major muscle group must receive:
- Minimum 10 hard sets/week (RPE ≥7)
- Hypertrophy goal: 12–18 sets/week
- Strength goal: 8–15 sets/week (higher intensity)
- Recomp goal: 10–14 sets/week
- Fat loss goal: 8–12 sets/week minimum
Major muscle groups: Chest, Back, Quads, Hamstrings/Glutes, Delts.
If volume is below minimum, program is invalid.

3. Intensity Distribution Standard
Across total weekly working sets:
- 50–70% at RPE 7–8
- 10–25% at RPE 8.5–9
- ≤25% at RPE ≤6
Programs that remain in RPE 4–6 zones are invalid except during deload.

4. Posterior Chain Requirement
Each week must include:
- At least one loaded hinge (RDL, deadlift variant)
- At least one loaded squat pattern
- At least one heavy vertical or horizontal pull
- At least one unilateral lower movement
Programs missing posterior chain loading are invalid.

5. Core Allocation Limit
Direct core training may not exceed 20% of weekly total sets.
Core must emphasize anti-extension, anti-rotation, and loaded carries.
Core novelty may not replace compound lifts.

6. Progressive Overload Must Be Explicit
Program must specify:
- Rep range
- Load progression trigger
- Deload frequency
- Clear overload model (double progression, % based, density, etc.)
Vague instructions invalidate output.

---

GOAL-SPECIFIC RULES

HYPERTROPHY GOAL
Training Rules:
- 12–18 sets per muscle group/week
- 6–12 rep exposure minimum
- 0–2 RIR on final sets of key movements
- Isolation allowed but cannot replace compounds
- At least one heavy compound per muscle group weekly
Nutrition Rules:
- Surplus capped at 10–15% above maintenance
- Protein: 0.8–1.0g/lb bodyweight
- Fat: minimum 0.3g/lb
- Carbs adjusted upward for performance
- Aggressive bulking is prohibited

STRENGTH GOAL
Training Rules:
- 3–6 rep exposure weekly
- At least one lift trained at RPE 8–9 weekly
- Volume moderate (8–15 sets per muscle group)
- Rest periods 2–4 minutes for primary lifts
Nutrition Rules:
- Maintenance to slight surplus
- Protein ≥0.8g/lb
- Fat ≥0.3g/lb
- No crash deficits allowed

RECOMP GOAL (body fat ~15–25%)
Training Rules:
- 10–14 sets per muscle group/week
- 5–10 rep exposure
- 10–20% of sets at RPE 8.5–9
- At least one heavy compound per session
- Density methods allowed but not primary stimulus
Nutrition Rules:
- Deficit capped at 10–15% below maintenance
- Protein ≥0.9g/lb
- Fat ≥0.3g/lb
- Carbs timed around training
- Deficits >20% invalidate program

FAT LOSS GOAL (BF% above 20% men / 28% women)
Training Rules:
- 8–12 sets per muscle group/week
- Maintain heavy compound exposure
- RPE 7–9 required weekly
- No circuit-only programs allowed
- Conditioning is additive, not a replacement
Nutrition Rules:
- Deficit 15–25% max
- Protein ≥1.0g/lb lean mass
- Fat ≥0.3g/lb bodyweight
- Minimum calories must not drop below 10× bodyweight (absolute floor)
- Crash dieting is invalid

SPORT-SPECIFIC GOAL
Must include:
- Strength base (minimum 6–10 sets per muscle group)
- Power exposure (jumps, throws, sprints)
- Sport-relevant movement patterns
- Injury resilience work
- Conditioning may not replace strength

---

BODY FAT ADJUSTMENT LOGIC

If male:
- <12% BF → no deficit allowed
- 12–18% BF → recomp or lean gain
- 18–25% BF → moderate deficit allowed
- >25% BF → fat loss protocol
If program ignores BF% context, regenerate.

---

AGE ADJUSTMENT RULES

If age ≥35:
- Include joint-friendly variation options
- Include warm-up protocol
- Include deload every 4–6 weeks
- Volume moderate unless advanced trainee
Intensity must not be removed entirely.

---

SESSION DURATION RULE

If session ≤30 min:
- Supersets or density blocks required
- Total weekly volume must still meet minimums
Time constraint does NOT justify under-stimulation.

---

NUTRITION HARD FLOORS

For males:
- Protein <0.8g/lb = invalid
- Fat <0.3g/lb = invalid
- Deficit >25% = invalid
For females:
- Protein <0.7g/lb = invalid
- Fat <0.3g/lb = invalid

---

OUTPUT VALIDATION CHECKLIST

Before finalizing program, verify:
- Weekly volume per muscle group meets goal-specific minimum
- RPE distribution verified
- Posterior chain loaded sufficiently
- At least one heavy compound per session
- Progressive overload clearly defined
- Protein meets bodyweight requirement
- Fat meets hormonal minimum
- Caloric adjustment aligns with BF% and goal
- Deficit/surplus within allowed range
- Core volume ≤20% total sets
If any box cannot be checked → regenerate output.

---

DESIGN PHILOSOPHY

Programs must prioritize:
- Mechanical tension over novelty
- Progressive overload over fatigue
- Hormonal sustainability over crash dieting
- Transformation over safety-only programming
The objective is measurable physique and performance improvement within 12 weeks.

---

PROGRAM SIMPLICITY RULE

Programs must follow a simple A/B structure. Allowed splits:
- Full Body A / Full Body B
- Upper A / Lower A
- Strength Day / Volume Day
- Power Day / Strength Day
Not allowed: Push A / Push B / Push C, excessive phase-based exercise rotation, constant weekly exercise changes.
The same core movement patterns must repeat weekly.

---

MOVEMENT PATTERN CONSISTENCY RULE

For each major movement pattern (Squat, Hinge, Push, Pull, Carry, Core):
- Select ONE primary movement per pattern and keep it consistent for at least 4–8 weeks
Progress by: load, leverage, tempo, assistance reduction, or rep progression — NOT by switching exercises.
Example — Hinge: DB RDL → heavier DB RDL → barbell RDL (not: SL RDL → back extension → band hinge rotation)
Example — Push: Incline push-up → floor push-up → weighted push-up (not: incline → band press → TRX fly → dips)

---

SCALABILITY RULE

Every exercise must include 3 clear scaling tiers that modify load, leverage, assistance, or range of motion — NOT complexity.
- Beginner: lower load / higher leverage / more assistance
- Intermediate: standard version
- Advanced: added load / reduced assistance / extended ROM
Example — Push: Beginner: Incline push-up | Intermediate: Floor push-up | Advanced: Weighted push-up
NOT: Beginner: Push-up | Intermediate: TRX atomic push-up | Advanced: Ring archer push-up

---

BEGINNER STIMULUS LOGIC

If body fat >25% (male) or >33% (female) and training age is beginner:
- Use basic movements only (incline push-ups, goblet squats, DB RDL, assisted pull-ups)
- Avoid advanced intensity techniques
- Moderate RPE (6–8)
- Allow faster linear progression
Overweight beginners receive adequate stimulus from simple loaded movements. Do NOT overcomplicate.

---

EXERCISE VARIATION CAP

Across a 12-week program:
- No more than 2 variations per movement pattern per phase
- At least 70% of movements remain consistent for the entire program
If more than 30% of exercises change between phases → regenerate.

---

OUTPUT FORMAT — use exactly this structure:

## YOUR PERSONALIZED PROGRAM
(2-3 lines: split name, days/week, duration, one-sentence philosophy tailored to this person)

## PHASE 1 — [LABEL] (Weeks 1–4)
Focus: [one line]

### Day 1 — [Day Name]
Warm-up: [one sentence]
1. [Exercise] — [sets]×[reps] @ RPE [X] | [rest] | [brief coaching note ≤8 words]
   Scaling → Beginner: [easier variation] | Intermediate: [standard] | Advanced: [harder variation]
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
For macro-based: daily calories, protein/carb/fat grams, per-meal targets — 4-6 bullet points.
For hand-portion: structure around exactly 3-4 meals per day (never 5-6). Show portion sizes per meal using palm/hand/thumb/fist guides. Keep it simple and actionable.

## FAQ
Q: [relevant question for this person]
A: [1-2 sentence answer]

Q: [second question]
A: [answer]

Q: [third question]
A: [answer]

OUTPUT RULES:
- Output plain text only. No JSON, no code fences, no markdown tables.
- Generate exactly 3 training phases (Weeks 1–4 / 5–8 / 9–12).
- Each phase shows one representative training week.
- Maximum 5 exercises per day.
- Use ONLY exercises appropriate for the stated equipment.
- Phase 1→2→3: progressively heavier loads, lower rep ranges, higher RPE.
- Be specific — real exercise names, real numbers. No generic filler.
- All physiology rules above take precedence over any conflicting instructions.

---

APPROVED EXERCISE LIBRARY RULE

The program may ONLY use exercises from the approved movement library below. If an exercise is not explicitly listed, it is prohibited. Do not invent variations, combine names, create hybrid movements, or use advanced calisthenics variations unless explicitly listed. If no exercise from the list fits the requirement, select the closest simple movement from the list.

Approved Push Movements:
- Incline Push-up
- Floor Push-up
- Weighted Push-up
- Dumbbell Bench Press
- Barbell Bench Press
- Dumbbell Overhead Press
- Barbell Overhead Press
- Dips (assisted or weighted)
- Machine Chest Press

Approved Pull Movements:
- TRX Row
- Inverted Row
- Pull-up (assisted, bodyweight, or weighted)
- Chin-up
- Dumbbell Row
- Barbell Row
- Lat Pulldown
- Seated Cable Row

Approved Squat Movements:
- Goblet Squat
- Barbell Back Squat
- Front Squat
- Leg Press
- Bulgarian Split Squat
- Step-up

Approved Hinge Movements:
- Dumbbell RDL
- Barbell RDL
- Deadlift (conventional or trap bar)
- Hip Thrust
- Glute Bridge
- Back Extension

Approved Carry Movements:
- Farmer Carry
- Suitcase Carry
- Front Carry

Approved Core Movements:
- Dead Bug
- Plank
- Side Plank
- Pallof Press
- Hanging Knee Raise
- Ab Wheel Rollout

If any exercise in the output is not on this list → regenerate output.

---

NO NOVELTY RULE

The following are prohibited unless explicitly requested:
- Pseudo planche variations
- Archer variations
- Atomic/TRX instability combinations
- Hybrid names (e.g. "pseudo planche row")
- Unstable surface exercises
- BOSU/ball variations
- Advanced calisthenics movements not on the approved list

Progression must occur via load increase, leverage adjustment, assistance reduction, rep progression, or tempo — not by inventing new movements.

---

SIMPLE LANGUAGE ENFORCEMENT

Exercise names must be written exactly as listed in the approved library. Do not add adjectives such as: explosive, deficit, chaos, advanced, hybrid, complex, or rotational variation — unless that exact term appears in the approved list.

---

FAIL-SAFE VALIDATION

Before finalizing output, verify:
- All exercises appear in the approved library
- No invented names
- No hybrid naming
- No unnecessary complexity
If any violation occurs → regenerate.`

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

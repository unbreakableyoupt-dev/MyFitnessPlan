// ─── Exercise & Day ────────────────────────────────────────────────────────

export type MovementPattern =
  | 'Squat'
  | 'Hinge'
  | 'Horizontal Push'
  | 'Horizontal Pull'
  | 'Vertical Push'
  | 'Vertical Pull'
  | 'Single-Leg'
  | 'Core'
  | string

export interface Exercise {
  order: number
  name: string
  pattern: MovementPattern
  sets: number
  reps: string // e.g. "4-6", "8-10", "AMRAP"
  rpe: string // e.g. "7-8"
  rir: string // e.g. "2-3"
  rest: string // e.g. "3 min", "90 sec"
  notes: string
}

export interface TrainingDay {
  dayNumber: number
  dayName: string // e.g. "Upper A — Strength Focus"
  focus: string // e.g. "Horizontal Push/Pull + Vertical Push"
  sessionDuration: number // minutes
  warmup: string
  exercises: Exercise[]
  cooldown: string
}

// ─── Program Structure ───────────────────────────────────────────────────────

export interface ProgramPhase {
  phase: number
  phaseLabel: string // e.g. "Accumulation (Weeks 1-4)"
  focus: string // e.g. "Volume accumulation, technique refinement"
  days: TrainingDay[]
}

export interface ProgramBlock {
  split: string // e.g. "Upper/Lower", "Push/Pull/Legs"
  daysPerWeek: number
  phasedWeeks: ProgramPhase[]
}

// ─── Progression ─────────────────────────────────────────────────────────────

export interface ProgressionPlan {
  method: string // e.g. "Double Progression"
  overview: string
  rules: string[]
  rpeExplanation: string
  rirExplanation: string
  weeklyGoals: string[] // e.g. ["Week 1-2: Learn RPE, stay conservative", ...]
}

// ─── Deload ──────────────────────────────────────────────────────────────────

export interface DeloadProtocol {
  frequency: string // e.g. "Every 4th week"
  rationale: string
  protocol: string
  deloadWeekExample: {
    adjustments: string[]
    mindset: string
  }
}

// ─── Nutrition ───────────────────────────────────────────────────────────────

export interface MacroDetail {
  grams: number
  calories: number
  perMeal: string // e.g. "40-45g"
}

export interface Macros {
  protein: MacroDetail
  carbs: MacroDetail
  fats: MacroDetail
}

export interface HandPortions {
  protein: string // e.g. "1-2 palms per meal"
  carbs: string
  fats: string
  vegetables: string
}

export interface SupplementStack {
  foundational: string[] // e.g. ["Creatine monohydrate: 5g daily"]
  optional: string[]
}

export interface NutritionPlan {
  included: boolean
  method: 'macro_based' | 'hand_portion' | null
  dailyCalories: number | null
  calorieSplit: string | null // explanation of how cals were derived
  macros: Macros | null
  handPortions: HandPortions | null
  mealTiming: string[] | null
  bodyFatNotes: string | null
  supplements: SupplementStack | null
}

// ─── Overview & FAQ ──────────────────────────────────────────────────────────

export interface ProgramOverview {
  philosophy: string
  approach: string
  keyPrinciples: string[]
  weeklyStructure: string
  programDuration: string // e.g. "12 weeks / 3 phases"
}

export interface FAQItem {
  question: string
  answer: string
}

// ─── Top-Level Generated Program ────────────────────────────────────────────

export interface GeneratedProgram {
  overview: ProgramOverview
  program: ProgramBlock
  progression: ProgressionPlan
  deload: DeloadProtocol
  nutrition: NutritionPlan
  faq: FAQItem[]
}

// ─── API Request / Response ───────────────────────────────────────────────────

export interface GenerateProgramRequest {
  formData: import('./types').FormData
}

export type GenerateProgramResponse =
  | {
      success: true
      program: GeneratedProgram
      generatedAt: string
      modelUsed: string
    }
  | {
      success: false
      error: string
      code: ErrorCode
    }

export type ErrorCode =
  | 'INVALID_REQUEST'
  | 'AUTH_ERROR'
  | 'RATE_LIMITED'
  | 'TIMEOUT'
  | 'GENERATION_FAILED'
  | 'PARSE_ERROR'
  | 'INTERNAL_ERROR'

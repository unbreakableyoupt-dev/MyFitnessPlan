export type Sex = 'male' | 'female' | ''
export type WeightUnit = 'lbs' | 'kg'
export type HeightUnit = 'imperial' | 'metric'
export type PrimaryGoal =
  | 'hypertrophy'
  | 'strength'
  | 'fat_loss'
  | 'recomp'
  | 'sport_specific'
  | ''
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite' | ''
// Multi-select equipment IDs
export type EquipmentId =
  | 'bodyweight'
  | 'dumbbells'
  | 'barbells'
  | 'machines'
  | 'cables'
  | 'resistance_bands'
  | 'pull_up_bar'
  | 'trx'
  | 'full_gym'
export type MinutesPerSession = 10 | 20 | 30 | 45 | 60 | 90 | ''
export type NutritionMethod = 'macro_based' | 'hand_portion' | ''

export interface FormData {
  // Step 1: Personal Info
  sex: Sex
  age: number | ''
  bodyweight: number | ''
  weightUnit: WeightUnit
  heightFeet: number | ''
  heightInches: number | ''
  heightCm: number | ''
  heightUnit: HeightUnit

  // Step 2: Body Composition
  bodyFatTier: string // e.g. 'male_8_10', 'female_21_24', etc.

  // Step 3: Goals & Experience
  primaryGoal: PrimaryGoal
  experienceLevel: ExperienceLevel

  // Step 4: Schedule & Equipment
  daysPerWeek: number | ''
  minutesPerSession: MinutesPerSession
  equipmentAccess: EquipmentId[] // multi-select — at least one required

  // Step 5: Details
  sport: string
  injuries: string

  // Step 6: Nutrition Add-on
  nutritionAddOn: boolean | null
  nutritionMethod: NutritionMethod
}

export const INITIAL_FORM_DATA: FormData = {
  sex: '',
  age: '',
  bodyweight: '',
  weightUnit: 'lbs',
  heightFeet: '',
  heightInches: '',
  heightCm: '',
  heightUnit: 'imperial',
  bodyFatTier: '',
  primaryGoal: '',
  experienceLevel: '',
  daysPerWeek: '',
  minutesPerSession: '',
  equipmentAccess: [],
  sport: '',
  injuries: '',
  nutritionAddOn: null,
  nutritionMethod: '',
}

export interface PricingTier {
  id: string
  name: string
  price: number
  priceId: string // Stripe price ID (placeholder)
  description: string
  features: string[]
  highlighted: boolean
  badge?: string
}

export interface OrderSummary {
  formData: FormData
  selectedTier: PricingTier
  totalPrice: number
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { FormData } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`
}

export function formatHeight(formData: FormData): string {
  if (formData.heightUnit === 'imperial') {
    const feet = formData.heightFeet !== '' ? formData.heightFeet : 0
    const inches = formData.heightInches !== '' ? formData.heightInches : 0
    return `${feet}'${inches}"`
  }
  return `${formData.heightCm} cm`
}

export function formatWeight(formData: FormData): string {
  if (formData.bodyweight === '') return 'Not provided'
  return `${formData.bodyweight} ${formData.weightUnit}`
}

export function getGoalLabel(goal: string): string {
  const map: Record<string, string> = {
    hypertrophy: 'Hypertrophy (Muscle Building)',
    strength: 'Strength',
    fat_loss: 'Fat Loss',
    recomp: 'Body Recomposition',
    sport_specific: 'Sport-Specific Performance',
  }
  return map[goal] ?? goal
}

export function getExperienceLabel(level: string): string {
  const map: Record<string, string> = {
    beginner: 'Beginner (< 1 year)',
    intermediate: 'Intermediate (1–3 years)',
    advanced: 'Advanced (3–6 years)',
    elite: 'Elite (6+ years)',
  }
  return map[level] ?? level
}

const EQUIPMENT_LABEL_MAP: Record<string, string> = {
  bodyweight: 'Bodyweight',
  dumbbells: 'Dumbbells',
  barbells: 'Barbells',
  machines: 'Machines',
  cables: 'Cables',
  resistance_bands: 'Resistance Bands',
  pull_up_bar: 'Pull Up Bar',
  trx: 'TRX / Suspension',
  roman_chair: 'Roman Chair',
  full_gym: 'Full Gym',
}

export function getEquipmentLabel(equipment: string | string[]): string {
  if (Array.isArray(equipment)) {
    if (equipment.length === 0) return 'None selected'
    return equipment.map((e) => EQUIPMENT_LABEL_MAP[e] ?? e).join(', ')
  }
  return EQUIPMENT_LABEL_MAP[equipment] ?? equipment
}

export function isStepComplete(step: number, formData: FormData): boolean {
  switch (step) {
    case 1:
      return (
        formData.sex !== '' &&
        formData.age !== '' &&
        formData.bodyweight !== '' &&
        (formData.heightUnit === 'imperial'
          ? formData.heightFeet !== ''
          : formData.heightCm !== '')
      )
    case 2:
      return formData.bodyFatTier !== ''
    case 3:
      return formData.primaryGoal !== '' && formData.experienceLevel !== ''
    case 4:
      return (
        formData.daysPerWeek !== '' &&
        formData.minutesPerSession !== '' &&
        formData.equipmentAccess.length > 0
      )
    case 5:
      return true // optional fields
    case 6:
      return (
        formData.nutritionAddOn !== null &&
        (formData.nutritionAddOn === false || formData.nutritionMethod !== '')
      )
    case 7:
      return true
    default:
      return false
  }
}

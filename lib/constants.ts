import { PricingTier } from './types'

export interface BFTier {
  id: string
  label: string
  range: string
  description: string
  visual: string // emoji/icon representation
  gradient: string
}

export const MALE_BF_TIERS: BFTier[] = [
  {
    id: 'male_8_10',
    label: '8–10%',
    range: '8–10%',
    description: 'Visible abs, muscle striations & veins. Competition-ready lean.',
    visual: '🔥',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'male_12_15',
    label: '12–15%',
    range: '12–15%',
    description: 'Athletic. Abs visible when flexed. Defined arms and shoulders.',
    visual: '💪',
    gradient: 'from-orange-400 to-amber-500',
  },
  {
    id: 'male_16_19',
    label: '16–19%',
    range: '16–19%',
    description: 'Fit but soft. Slight belly, arms defined. Average gym-goer.',
    visual: '🏋️',
    gradient: 'from-amber-400 to-yellow-500',
  },
  {
    id: 'male_20_24',
    label: '20–24%',
    range: '20–24%',
    description: 'Soft build. Belly present, minimal muscle definition visible.',
    visual: '🧍',
    gradient: 'from-zinc-500 to-zinc-600',
  },
  {
    id: 'male_25_plus',
    label: '25%+',
    range: '25%+',
    description: 'Significant extra weight. Rounded appearance, no visible muscle.',
    visual: '⚡',
    gradient: 'from-zinc-600 to-zinc-700',
  },
]

export const FEMALE_BF_TIERS: BFTier[] = [
  {
    id: 'female_18_20',
    label: '18–20%',
    range: '18–20%',
    description: 'Athletic & toned. Visible abs, very low body fat. Competition-lean.',
    visual: '🔥',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'female_21_24',
    label: '21–24%',
    range: '21–24%',
    description: 'Fit & lean. Toned muscles, minimal belly. Fitness model range.',
    visual: '💪',
    gradient: 'from-orange-400 to-amber-500',
  },
  {
    id: 'female_25_29',
    label: '25–29%',
    range: '25–29%',
    description: 'Average. Soft curves, some belly. Typical healthy female range.',
    visual: '🧘',
    gradient: 'from-amber-400 to-yellow-500',
  },
  {
    id: 'female_30_plus',
    label: '30%+',
    range: '30%+',
    description: 'Higher body fat. Rounded appearance, carrying extra weight.',
    visual: '⚡',
    gradient: 'from-zinc-500 to-zinc-700',
  },
]

export const PRIMARY_GOALS = [
  {
    id: 'hypertrophy',
    label: 'Hypertrophy',
    description: 'Build maximum muscle size',
    icon: '💪',
  },
  {
    id: 'strength',
    label: 'Strength',
    description: 'Get stronger on the big lifts',
    icon: '🏋️',
  },
  {
    id: 'fat_loss',
    label: 'Fat Loss',
    description: 'Lose fat while preserving muscle',
    icon: '🔥',
  },
  {
    id: 'recomp',
    label: 'Body Recomp',
    description: 'Lose fat AND gain muscle simultaneously',
    icon: '⚡',
  },
  {
    id: 'sport_specific',
    label: 'Sport-Specific',
    description: 'Train for athletic performance',
    icon: '🏆',
  },
]

export const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'Less than 1 year of consistent training',
    timeframe: '< 1 year',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: '1–3 years of consistent training',
    timeframe: '1–3 years',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: '3–6 years of serious training',
    timeframe: '3–6 years',
  },
  {
    id: 'elite',
    label: 'Elite',
    description: '6+ years with competition experience',
    timeframe: '6+ years',
  },
]

export const EQUIPMENT_OPTIONS = [
  {
    id: 'bodyweight',
    label: 'Bodyweight',
    description: 'No equipment needed — just your body',
    icon: '🤸',
  },
  {
    id: 'dumbbells',
    label: 'Dumbbells',
    description: 'Adjustable or fixed dumbbell set',
    icon: '💪',
  },
  {
    id: 'barbells',
    label: 'Barbells',
    description: 'Barbell with plates — squat rack optional',
    icon: '🏋️',
  },
  {
    id: 'machines',
    label: 'Machines',
    description: 'Leg press, chest press, lat pulldown, etc.',
    icon: '⚙️',
  },
  {
    id: 'cables',
    label: 'Cables',
    description: 'Cable machine / functional trainer',
    icon: '〰️',
  },
  {
    id: 'resistance_bands',
    label: 'Resistance Bands',
    description: 'Loop bands, tube bands, or pull-apart bands',
    icon: '🔗',
  },
  {
    id: 'pull_up_bar',
    label: 'Pull Up Bar',
    description: 'Doorframe or mounted pull-up bar',
    icon: '🔧',
  },
  {
    id: 'trx',
    label: 'TRX / Suspension',
    description: 'Suspension trainer (TRX, rings, etc.)',
    icon: '🎯',
  },
  {
    id: 'roman_chair',
    label: 'Roman Chair',
    description: 'Back extension / hyperextension bench',
    icon: '⬇️',
  },
  {
    id: 'full_gym',
    label: 'Full Gym',
    description: 'Access to everything — commercial gym',
    icon: '🏢',
  },
]

export const SESSION_DURATIONS: Array<{ value: number; label: string }> = [
  { value: 10, label: '10 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' },
  { value: 90, label: '90 min' },
]

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'training_only',
    name: 'Training Program',
    price: 19,
    priceId: 'price_training_only', // Replace with real Stripe price ID
    description: 'A fully personalized training program built for your exact body and goals.',
    features: [
      'Custom training split & schedule',
      'Exercise selection for your equipment',
      'Sets, reps & progressive overload plan',
      'Warm-up & mobility recommendations',
      'Instant PDF download',
      'Email delivery',
    ],
    highlighted: false,
  },
  {
    id: 'transformation_pack',
    name: 'Transformation Pack',
    price: 29,
    priceId: 'price_transformation_pack', // Replace with real Stripe price ID
    description: 'Training + nutrition — everything you need to completely transform your body.',
    features: [
      'Everything in Training Program',
      'Personalized nutrition plan',
      'Custom calorie & macro targets',
      'Macro-based OR hand-portion method',
      'Meal timing recommendations',
      'Supplement suggestions',
      'Instant PDF download',
      'Email delivery',
    ],
    highlighted: true,
    badge: 'Best Value',
  },
]

export const FORM_STEPS = [
  { id: 1, title: 'About You', description: 'Basic info' },
  { id: 2, title: 'Body Comp', description: 'Estimate your body fat' },
  { id: 3, title: 'Your Goal', description: 'What you want to achieve' },
  { id: 4, title: 'Schedule', description: 'When & where you train' },
  { id: 5, title: 'Details', description: 'Any specific considerations' },
  { id: 6, title: 'Nutrition', description: 'Optional add-on' },
  { id: 7, title: 'Summary', description: 'Review your order' },
]

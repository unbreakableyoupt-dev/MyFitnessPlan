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
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  return new Anthropic({ apiKey })
}

// ─── Mock Program (returned when ANTHROPIC_API_KEY is not configured) ─────────
const MOCK_PROGRAM: GeneratedProgram = {
  overview: {
    philosophy:
      'Progressive overload through systematic volume and intensity manipulation — every week you are stronger than the last.',
    approach:
      'This Upper/Lower split balances frequency and recovery, hitting each muscle group twice per week with complementary stimulus. Phase 1 builds your work capacity; Phase 2 drives intensity; Phase 3 peaks strength before a planned deload.',
    keyPrinciples: [
      'Every session includes all 8 movement patterns distributed across the week',
      'RPE targets increase by 0.5 each phase — you earn the right to train harder',
      'Rest periods are non-negotiable — they dictate the quality of your next set',
      'Log every rep and weight; if you cannot track it, you cannot progress it',
      'Deload weeks are programmed, not optional — fatigue masks fitness',
    ],
    weeklyStructure:
      'Mon: Upper A (Horizontal focus) | Tue: Lower A (Squat) | Thu: Upper B (Vertical focus) | Fri: Lower B (Hinge) | Wed/Sat/Sun: active recovery or rest',
    programDuration: '12 weeks / 3 phases',
  },
  program: {
    split: 'Upper/Lower',
    daysPerWeek: 4,
    phasedWeeks: [
      {
        phase: 1,
        phaseLabel: 'Phase 1 — Accumulation (Weeks 1–4)',
        focus: 'Volume accumulation, movement quality, RPE calibration',
        days: [
          {
            dayNumber: 1,
            dayName: 'Upper A — Horizontal Push/Pull',
            focus: 'Horizontal Push · Horizontal Pull · Core',
            sessionDuration: 60,
            warmup: '5 min: band pull-aparts × 15, shoulder circles, arm swings, push-up × 10',
            exercises: [
              { order: 1, name: 'Barbell Bench Press', pattern: 'Horizontal Push', sets: 4, reps: '6-8', rpe: '7', rir: '3', rest: '3 min', notes: 'Retract scapula, slight arch, bar touches mid-chest' },
              { order: 2, name: 'Barbell Bent-Over Row', pattern: 'Horizontal Pull', sets: 4, reps: '6-8', rpe: '7', rir: '3', rest: '3 min', notes: 'Hinge to 45°, pull to lower sternum, pause 1s at top' },
              { order: 3, name: 'Incline Dumbbell Press', pattern: 'Horizontal Push', sets: 3, reps: '10-12', rpe: '7', rir: '3', rest: '90 sec', notes: '30° incline, neutral grip, full stretch at bottom' },
              { order: 4, name: 'Seated Cable Row', pattern: 'Horizontal Pull', sets: 3, reps: '10-12', rpe: '7', rir: '3', rest: '90 sec', notes: 'Chest tall, elbows brush ribs, 1s squeeze' },
              { order: 5, name: 'Tricep Rope Pushdown', pattern: 'Vertical Push', sets: 3, reps: '12-15', rpe: '7', rir: '3', rest: '60 sec', notes: 'Lock elbows at sides, full extension' },
              { order: 6, name: 'Cable Curl', pattern: 'Vertical Pull', sets: 3, reps: '12-15', rpe: '7', rir: '3', rest: '60 sec', notes: 'Supinate at top, slow eccentric 3s' },
              { order: 7, name: 'Dead Bug', pattern: 'Core', sets: 3, reps: '8/side', rpe: '6', rir: '4', rest: '60 sec', notes: 'Lower back pressed to floor, breathe out on extension' },
            ],
            cooldown: '5 min: doorway chest stretch, lat hang 30s, thoracic extension over foam roller',
          },
          {
            dayNumber: 2,
            dayName: 'Lower A — Squat Focus',
            focus: 'Squat · Single-Leg · Core',
            sessionDuration: 60,
            warmup: '5 min: hip circles, bodyweight squat × 15, leg swings forward/lateral, glute bridge × 15',
            exercises: [
              { order: 1, name: 'Barbell Back Squat', pattern: 'Squat', sets: 4, reps: '6-8', rpe: '7', rir: '3', rest: '3 min', notes: 'Brace 360°, knees track toes, crease below parallel' },
              { order: 2, name: 'Romanian Deadlift', pattern: 'Hinge', sets: 3, reps: '8-10', rpe: '7', rir: '3', rest: '2 min', notes: 'Hip hinge, soft knee, feel hamstring stretch at bottom' },
              { order: 3, name: 'Bulgarian Split Squat', pattern: 'Single-Leg', sets: 3, reps: '8-10/leg', rpe: '7', rir: '3', rest: '90 sec', notes: 'Rear foot elevated, front shin vertical, torso upright' },
              { order: 4, name: 'Leg Press', pattern: 'Squat', sets: 3, reps: '12-15', rpe: '7', rir: '3', rest: '90 sec', notes: 'Full ROM, do not lock knees at top' },
              { order: 5, name: 'Leg Curl', pattern: 'Hinge', sets: 3, reps: '12-15', rpe: '7', rir: '3', rest: '60 sec', notes: 'Plantarflex at top to fully contract hamstrings' },
              { order: 6, name: 'Standing Calf Raise', pattern: 'Single-Leg', sets: 4, reps: '15-20', rpe: '8', rir: '2', rest: '60 sec', notes: 'Full range, 2s pause at top and bottom' },
              { order: 7, name: 'Plank', pattern: 'Core', sets: 3, reps: '45 sec', rpe: '6', rir: '4', rest: '60 sec', notes: 'Squeeze glutes, posterior pelvic tilt, breathe throughout' },
            ],
            cooldown: '5 min: pigeon stretch 60s/side, standing quad stretch, hamstring hang',
          },
          {
            dayNumber: 3,
            dayName: 'Upper B — Vertical Push/Pull',
            focus: 'Vertical Push · Vertical Pull · Horizontal Pull',
            sessionDuration: 60,
            warmup: '5 min: face pulls × 15, band pull-apart × 15, wall slides × 10, dead hang 20s',
            exercises: [
              { order: 1, name: 'Overhead Press (Barbell)', pattern: 'Vertical Push', sets: 4, reps: '6-8', rpe: '7', rir: '3', rest: '3 min', notes: 'Squeeze glutes, brace core, bar path slightly back over head' },
              { order: 2, name: 'Weighted Pull-Up', pattern: 'Vertical Pull', sets: 4, reps: '5-7', rpe: '7', rir: '3', rest: '3 min', notes: 'Full dead hang, chin clears bar, slow 3s descent' },
              { order: 3, name: 'Dumbbell Lateral Raise', pattern: 'Vertical Push', sets: 4, reps: '12-15', rpe: '8', rir: '2', rest: '60 sec', notes: 'Slight forward lean, lead with elbow, control eccentric' },
              { order: 4, name: 'Lat Pulldown', pattern: 'Vertical Pull', sets: 3, reps: '10-12', rpe: '7', rir: '3', rest: '90 sec', notes: 'Lean 15° back, pull to upper chest, stretch fully overhead' },
              { order: 5, name: 'Face Pull', pattern: 'Horizontal Pull', sets: 3, reps: '15-20', rpe: '7', rir: '3', rest: '60 sec', notes: 'External rotation, thumbs to ears, keep elbows high' },
              { order: 6, name: 'Hammer Curl', pattern: 'Vertical Pull', sets: 3, reps: '12-15', rpe: '7', rir: '3', rest: '60 sec', notes: 'Neutral grip, curl both or alternating, no swinging' },
              { order: 7, name: 'Pallof Press', pattern: 'Core', sets: 3, reps: '10/side', rpe: '6', rir: '4', rest: '60 sec', notes: 'Resist rotation, press fully, hold 1s at extension' },
            ],
            cooldown: '5 min: lat stretch doorway, chest/shoulder open stretch, neck rolls',
          },
          {
            dayNumber: 4,
            dayName: 'Lower B — Hinge Focus',
            focus: 'Hinge · Squat · Single-Leg',
            sessionDuration: 60,
            warmup: '5 min: hip hinge PVC × 10, banded clamshells × 15, good morning × 10 bodyweight',
            exercises: [
              { order: 1, name: 'Conventional Deadlift', pattern: 'Hinge', sets: 4, reps: '4-6', rpe: '7', rir: '3', rest: '3-4 min', notes: 'Lats tight, push floor away, lock hips and knees simultaneously' },
              { order: 2, name: 'Front Squat', pattern: 'Squat', sets: 3, reps: '6-8', rpe: '7', rir: '3', rest: '2 min', notes: 'Elbows high, torso upright, depth below parallel' },
              { order: 3, name: 'Hip Thrust (Barbell)', pattern: 'Hinge', sets: 3, reps: '10-12', rpe: '7', rir: '3', rest: '90 sec', notes: 'Chin tucked, squeeze glutes at top, 1s hold' },
              { order: 4, name: 'Walking Lunge', pattern: 'Single-Leg', sets: 3, reps: '10/leg', rpe: '7', rir: '3', rest: '90 sec', notes: 'Long stride, knee barely touches floor, drive front heel' },
              { order: 5, name: 'Good Morning', pattern: 'Hinge', sets: 3, reps: '10-12', rpe: '6', rir: '4', rest: '90 sec', notes: 'Light weight, stretch-focused, maintain neutral spine throughout' },
              { order: 6, name: 'Leg Extension', pattern: 'Single-Leg', sets: 3, reps: '15-20', rpe: '8', rir: '2', rest: '60 sec', notes: 'VMO focus — squeeze hard at full extension' },
              { order: 7, name: 'Ab Wheel Rollout', pattern: 'Core', sets: 3, reps: '8-10', rpe: '7', rir: '3', rest: '90 sec', notes: 'Posterior pelvic tilt throughout, do not let lumbar cave' },
            ],
            cooldown: "5 min: world's greatest stretch 5/side, figure-4 glute stretch, cobra pose 30s",
          },
        ],
      },
      {
        phase: 2,
        phaseLabel: 'Phase 2 — Intensification (Weeks 5–8)',
        focus: 'Increased intensity, heavier loads, RPE 7.5–8.5',
        days: [
          {
            dayNumber: 1,
            dayName: 'Upper A — Horizontal Push/Pull',
            focus: 'Horizontal Push · Horizontal Pull · Core',
            sessionDuration: 60,
            warmup: '5 min: band pull-aparts × 15, shoulder circles, push-up × 10 with pause',
            exercises: [
              { order: 1, name: 'Barbell Bench Press', pattern: 'Horizontal Push', sets: 4, reps: '4-6', rpe: '8', rir: '2', rest: '3-4 min', notes: 'Add 2.5–5 kg from Phase 1 top sets' },
              { order: 2, name: 'Barbell Bent-Over Row', pattern: 'Horizontal Pull', sets: 4, reps: '4-6', rpe: '8', rir: '2', rest: '3-4 min', notes: 'Match bench progression, pull to lower chest' },
              { order: 3, name: 'Dumbbell Floor Press', pattern: 'Horizontal Push', sets: 3, reps: '8-10', rpe: '8', rir: '2', rest: '2 min', notes: 'Limits shoulder impingement, great mid-range strength' },
              { order: 4, name: 'T-Bar Row', pattern: 'Horizontal Pull', sets: 3, reps: '8-10', rpe: '8', rir: '2', rest: '2 min', notes: 'Wide grip for upper back thickness' },
              { order: 5, name: 'Close-Grip Bench Press', pattern: 'Horizontal Push', sets: 3, reps: '10-12', rpe: '7.5', rir: '2-3', rest: '90 sec', notes: 'Tricep emphasis, elbows 45° from torso' },
              { order: 6, name: 'EZ-Bar Curl', pattern: 'Vertical Pull', sets: 3, reps: '10-12', rpe: '7.5', rir: '2-3', rest: '90 sec', notes: 'Slower eccentric (3s), peak squeeze at top' },
              { order: 7, name: 'Hanging Knee Raise', pattern: 'Core', sets: 3, reps: '12-15', rpe: '7', rir: '3', rest: '60 sec', notes: 'Control the swing, posterior tilt at top' },
            ],
            cooldown: '5 min: banded chest stretch, thoracic extension over foam roller, wrist circles',
          },
          {
            dayNumber: 2,
            dayName: 'Lower A — Squat Focus',
            focus: 'Squat · Hinge · Single-Leg',
            sessionDuration: 60,
            warmup: '5 min: hip CARs, goblet squat × 10, tempo squat × 5 @ 30X0',
            exercises: [
              { order: 1, name: 'Barbell Back Squat', pattern: 'Squat', sets: 5, reps: '4-5', rpe: '8', rir: '2', rest: '4 min', notes: 'Reset between reps, take the slack out of the bar' },
              { order: 2, name: 'Romanian Deadlift', pattern: 'Hinge', sets: 4, reps: '6-8', rpe: '8', rir: '2', rest: '2-3 min', notes: 'Slow 4s eccentric for maximum hamstring tension' },
              { order: 3, name: 'Hack Squat', pattern: 'Squat', sets: 3, reps: '8-10', rpe: '8', rir: '2', rest: '2 min', notes: 'Feet shoulder-width, heels slightly elevated if needed' },
              { order: 4, name: 'Nordic Hamstring Curl', pattern: 'Hinge', sets: 3, reps: '5-8', rpe: '8', rir: '2', rest: '2 min', notes: 'Use hands to assist on concentric, max eccentric control' },
              { order: 5, name: 'Step-Up with Knee Drive', pattern: 'Single-Leg', sets: 3, reps: '10/leg', rpe: '7.5', rir: '2-3', rest: '90 sec', notes: 'Drive opposite knee high, stay tall through the hip' },
              { order: 6, name: 'Seated Calf Raise', pattern: 'Single-Leg', sets: 4, reps: '15-20', rpe: '8', rir: '2', rest: '60 sec', notes: 'Soleus focus, slow and controlled' },
              { order: 7, name: 'Cable Pull-Through', pattern: 'Hinge', sets: 3, reps: '15', rpe: '7', rir: '3', rest: '60 sec', notes: 'Hip hinge pattern, glute squeeze at top' },
            ],
            cooldown: '5 min: pigeon pose 90s/side, kneeling hip flexor stretch, prone quad stretch',
          },
          {
            dayNumber: 3,
            dayName: 'Upper B — Vertical Push/Pull',
            focus: 'Vertical Push · Vertical Pull · Core',
            sessionDuration: 60,
            warmup: '5 min: band pull-aparts × 20, dead hang 30s × 2, shoulder controlled CARs',
            exercises: [
              { order: 1, name: 'Overhead Press (Barbell)', pattern: 'Vertical Push', sets: 5, reps: '4-5', rpe: '8', rir: '2', rest: '3-4 min', notes: 'Strict — no leg drive, add 2.5 kg from Phase 1' },
              { order: 2, name: 'Weighted Pull-Up', pattern: 'Vertical Pull', sets: 4, reps: '4-6', rpe: '8', rir: '2', rest: '3-4 min', notes: 'Add belt weight, full dead hang each rep' },
              { order: 3, name: 'Arnold Press', pattern: 'Vertical Push', sets: 3, reps: '10-12', rpe: '8', rir: '2', rest: '90 sec', notes: 'Slow rotation, full shoulder ROM' },
              { order: 4, name: 'Chest-Supported Row', pattern: 'Horizontal Pull', sets: 3, reps: '10-12', rpe: '8', rir: '2', rest: '90 sec', notes: 'Chest pad eliminates momentum, strict form' },
              { order: 5, name: 'Cable Lateral Raise', pattern: 'Vertical Push', sets: 4, reps: '15-20', rpe: '8', rir: '2', rest: '60 sec', notes: 'Constant tension vs dumbbells, lead with elbow' },
              { order: 6, name: 'Incline Dumbbell Curl', pattern: 'Vertical Pull', sets: 3, reps: '10-12', rpe: '7.5', rir: '2-3', rest: '90 sec', notes: 'Long bicep head stretch, full supination' },
              { order: 7, name: 'Hollow Body Hold', pattern: 'Core', sets: 3, reps: '30 sec', rpe: '7', rir: '3', rest: '60 sec', notes: 'Press low back to floor, arms and legs extended' },
            ],
            cooldown: '5 min: lat hang 30s, doorway chest stretch, neck side bend with hand assist',
          },
          {
            dayNumber: 4,
            dayName: 'Lower B — Hinge Focus',
            focus: 'Hinge · Squat · Single-Leg',
            sessionDuration: 60,
            warmup: '5 min: banded hip abduction × 15, single-leg RDL × 8/side bodyweight, hip circle × 10',
            exercises: [
              { order: 1, name: 'Sumo Deadlift', pattern: 'Hinge', sets: 4, reps: '4-6', rpe: '8', rir: '2', rest: '4 min', notes: 'Wide stance, toes out, drive knees out throughout' },
              { order: 2, name: 'Safety Bar Squat', pattern: 'Squat', sets: 3, reps: '6-8', rpe: '8', rir: '2', rest: '3 min', notes: 'More upright torso, great for quad development' },
              { order: 3, name: 'Single-Leg Hip Thrust', pattern: 'Hinge', sets: 3, reps: '10-12/leg', rpe: '8', rir: '2', rest: '90 sec', notes: 'Correct pelvic tilt and asymmetry' },
              { order: 4, name: 'Reverse Lunge', pattern: 'Single-Leg', sets: 3, reps: '10/leg', rpe: '7.5', rir: '2-3', rest: '90 sec', notes: 'Less quad dominant than forward lunge, easier on knees' },
              { order: 5, name: 'Trap Bar Deadlift', pattern: 'Hinge', sets: 3, reps: '5-6', rpe: '7.5', rir: '2-3', rest: '3 min', notes: 'More quad involvement, great for rate of force development' },
              { order: 6, name: 'Tibialis Raise', pattern: 'Single-Leg', sets: 3, reps: '20', rpe: '7', rir: '3', rest: '45 sec', notes: 'Anterior shin strength, injury prevention for knees' },
              { order: 7, name: 'Suitcase Carry', pattern: 'Core', sets: 3, reps: '30m/side', rpe: '7', rir: '3', rest: '90 sec', notes: 'Lateral core stability, stay tall and square' },
            ],
            cooldown: "5 min: figure-4 glute stretch, world's greatest stretch, foam roll quads 60s/side",
          },
        ],
      },
      {
        phase: 3,
        phaseLabel: 'Phase 3 — Peaking + Deload (Weeks 9–12)',
        focus: 'Max intensity weeks 9–11, structured deload week 12',
        days: [
          {
            dayNumber: 1,
            dayName: 'Upper A — Horizontal Push/Pull',
            focus: 'Horizontal Push · Horizontal Pull',
            sessionDuration: 60,
            warmup: '8 min: thorough shoulder prep, multiple warm-up sets on bench',
            exercises: [
              { order: 1, name: 'Barbell Bench Press', pattern: 'Horizontal Push', sets: 5, reps: '3-5', rpe: '8.5', rir: '1-2', rest: '4-5 min', notes: 'Peak strength — push personal records on final set' },
              { order: 2, name: 'Barbell Bent-Over Row', pattern: 'Horizontal Pull', sets: 4, reps: '4-5', rpe: '8.5', rir: '1-2', rest: '4 min', notes: 'Match bench load increases, strength PR attempt week 11' },
              { order: 3, name: 'Dumbbell Incline Press', pattern: 'Horizontal Push', sets: 3, reps: '8-10', rpe: '8', rir: '2', rest: '2 min', notes: 'Back-off volume work after heavy main lift' },
              { order: 4, name: 'One-Arm Dumbbell Row', pattern: 'Horizontal Pull', sets: 3, reps: '8-10/side', rpe: '8', rir: '2', rest: '2 min', notes: 'Full stretch, drive elbow to ceiling' },
              { order: 5, name: 'Tricep Dip', pattern: 'Vertical Push', sets: 3, reps: '10-12', rpe: '7.5', rir: '2-3', rest: '90 sec', notes: 'Add weight if bodyweight too easy' },
              { order: 6, name: 'Preacher Curl', pattern: 'Vertical Pull', sets: 3, reps: '10-12', rpe: '7.5', rir: '2-3', rest: '90 sec', notes: 'Eliminate cheating, pure bicep isolation' },
              { order: 7, name: 'Dragon Flag (Eccentric)', pattern: 'Core', sets: 3, reps: '5-6', rpe: '8', rir: '2', rest: '90 sec', notes: 'Lower only, use hands to return — advanced core skill' },
            ],
            cooldown: '5 min: thoracic extension, doorway chest stretch, wrist flexor/extensor stretch',
          },
          {
            dayNumber: 2,
            dayName: 'Lower A — Squat Focus',
            focus: 'Squat · Hinge · Core',
            sessionDuration: 60,
            warmup: '10 min: full hip/ankle mobility circuit, multiple progressive warm-up sets',
            exercises: [
              { order: 1, name: 'Barbell Back Squat', pattern: 'Squat', sets: 5, reps: '2-4', rpe: '8.5-9', rir: '1-2', rest: '5 min', notes: 'Competition-style attempt week 11 — treat like a meet' },
              { order: 2, name: 'Paused Romanian Deadlift', pattern: 'Hinge', sets: 3, reps: '5-6', rpe: '8', rir: '2', rest: '3 min', notes: '2s pause at stretch, maximizes hamstring time under tension' },
              { order: 3, name: 'Belt Squat', pattern: 'Squat', sets: 3, reps: '8-10', rpe: '8', rir: '2', rest: '2 min', notes: 'Spinal deload while maintaining quad volume' },
              { order: 4, name: 'Single-Leg RDL', pattern: 'Single-Leg', sets: 3, reps: '8/leg', rpe: '7.5', rir: '2-3', rest: '90 sec', notes: 'Balance + unilateral hamstring strength' },
              { order: 5, name: 'Leg Press (High Foot)', pattern: 'Hinge', sets: 3, reps: '10-12', rpe: '8', rir: '2', rest: '90 sec', notes: 'High foot placement = glute/hamstring emphasis' },
              { order: 6, name: 'Calf Raise (Single Leg)', pattern: 'Single-Leg', sets: 4, reps: '10-12', rpe: '8.5', rir: '1-2', rest: '90 sec', notes: 'Progress to single leg for greater strength' },
              { order: 7, name: 'L-Sit Hold', pattern: 'Core', sets: 3, reps: '15-20 sec', rpe: '8', rir: '2', rest: '90 sec', notes: 'Advanced compression strength' },
            ],
            cooldown: '8 min: extended lower body mobility, 90/90 hip stretch, PNF hamstring stretch',
          },
          {
            dayNumber: 3,
            dayName: 'Upper B — Vertical Push/Pull',
            focus: 'Vertical Push · Vertical Pull',
            sessionDuration: 60,
            warmup: '8 min: rotator cuff activation, dead hang progressions, shoulder CARs',
            exercises: [
              { order: 1, name: 'Overhead Press (Barbell)', pattern: 'Vertical Push', sets: 5, reps: '2-4', rpe: '8.5-9', rir: '1-2', rest: '4-5 min', notes: 'PR attempt week 11 — build to heavy single then back-off sets' },
              { order: 2, name: 'Weighted Pull-Up', pattern: 'Vertical Pull', sets: 4, reps: '3-5', rpe: '8.5', rir: '1-2', rest: '4 min', notes: 'Max added weight for reps — note bodyweight for tracking' },
              { order: 3, name: 'Push Press', pattern: 'Vertical Push', sets: 3, reps: '4-5', rpe: '8', rir: '2', rest: '3 min', notes: 'Leg drive allowed — more load overhead' },
              { order: 4, name: 'Meadows Row', pattern: 'Horizontal Pull', sets: 3, reps: '8-10/side', rpe: '8', rir: '2', rest: '2 min', notes: 'Elite back builder — hip loading gives huge stretch' },
              { order: 5, name: 'Bradford Press', pattern: 'Vertical Push', sets: 3, reps: '10-12', rpe: '7.5', rir: '2-3', rest: '90 sec', notes: 'Alternating front/back, rotator cuff strength' },
              { order: 6, name: 'Supinated Pulldown', pattern: 'Vertical Pull', sets: 3, reps: '10-12', rpe: '8', rir: '2', rest: '90 sec', notes: 'Underhand grip, stronger bicep contribution' },
              { order: 7, name: 'Copenhagen Plank', pattern: 'Core', sets: 3, reps: '20 sec/side', rpe: '8', rir: '2', rest: '60 sec', notes: 'Adductor strength + lateral core stability' },
            ],
            cooldown: '5 min: shoulder cross-body stretch, lat stretch in doorway, thoracic open book',
          },
          {
            dayNumber: 4,
            dayName: 'Lower B — Hinge Focus',
            focus: 'Hinge · Squat · Single-Leg',
            sessionDuration: 60,
            warmup: '10 min: hip mobility circuit, deadlift-specific warm-up sets',
            exercises: [
              { order: 1, name: 'Conventional Deadlift', pattern: 'Hinge', sets: 4, reps: '2-4', rpe: '8.5-9', rir: '1-2', rest: '5 min', notes: 'Week 11 PR attempt — current 1RM estimation: 90% × 4 reps' },
              { order: 2, name: 'Deficit Deadlift', pattern: 'Hinge', sets: 3, reps: '4-5', rpe: '8', rir: '2', rest: '3 min', notes: '5 cm deficit, builds off-the-floor strength' },
              { order: 3, name: 'Zercher Squat', pattern: 'Squat', sets: 3, reps: '6-8', rpe: '8', rir: '2', rest: '3 min', notes: 'Elbows cradle bar, maximally upright torso' },
              { order: 4, name: 'Rear-Foot-Elevated Hip Thrust', pattern: 'Hinge', sets: 3, reps: '8-10/leg', rpe: '8', rir: '2', rest: '2 min', notes: 'Elevate rear foot for deeper hip flexor stretch' },
              { order: 5, name: 'Dumbbell Goblet Lunge', pattern: 'Single-Leg', sets: 3, reps: '10/leg', rpe: '7.5', rir: '2-3', rest: '90 sec', notes: 'Goblet hold improves torso position' },
              { order: 6, name: 'Glute Ham Raise', pattern: 'Hinge', sets: 3, reps: '5-8', rpe: '8.5', rir: '1-2', rest: '2 min', notes: 'Most demanding hamstring exercise — use assistance if needed' },
              { order: 7, name: 'Landmine Rotation', pattern: 'Core', sets: 3, reps: '10/side', rpe: '7', rir: '3', rest: '60 sec', notes: 'Rotational power, brace hard through the turn' },
            ],
            cooldown: '8 min: extensive hip flexor and glute stretch, supine twist, decompression hang',
          },
        ],
      },
    ],
  },
  progression: {
    method: 'RPE-Based Double Progression',
    overview:
      'Each phase increases the RPE target by 0.5–1 point while reducing rep ranges slightly. When you hit the top of a rep range at the prescribed RPE, add load next session. This ensures every week produces a measurable training stimulus without guessing.',
    rules: [
      'Phase 1 (Weeks 1–4): RPE 7, hit top of rep range 2 sessions in a row → add load next session',
      'Phase 2 (Weeks 5–8): RPE 8, same progression rule — expect 2.5–5 kg per main lift',
      'Phase 3 (Weeks 9–11): RPE 8.5–9, prioritize quality over load; attempt PRs in week 11',
      'Week 12 is a structured deload — drop to 60% of Phase 3 loads, 2–3 sets, no failure',
      'Accessory work: when you exceed top of rep range by 2+ reps at RPE, add the minimum increment',
      'If you miss the bottom of the rep range, reduce load 5–10% and build back up',
    ],
    rpeExplanation:
      'RPE (Rate of Perceived Exertion) is a scale from 1–10. RPE 7 means 3 reps in reserve — you could have done 3 more. RPE 8 = 2 in reserve. RPE 9 = 1 in reserve. RPE 10 = absolute maximum. Use this to auto-regulate daily — if you slept poorly or are stressed, the same RPE at a lower weight is correct.',
    rirExplanation:
      'RIR (Reps In Reserve) is the inverse of RPE and more intuitive for some lifters. RIR 3 = you could have done 3 more reps. RIR 1 = you had 1 rep left. RPE 7 = RIR 3. RPE 8 = RIR 2. RPE 9 = RIR 1. Use whichever system clicks — they mean the same thing.',
    weeklyGoals: [
      'Weeks 1–2: Calibrate your RPE. Be conservative — it is better to leave more in the tank early',
      'Weeks 3–4: Start confidently pushing to RPE 7. Note weights for all main lifts',
      'Weeks 5–6: RPE 8 — this is where real strength is built. Expect new rep PRs',
      'Weeks 7–8: Consolidate gains. Hit top-of-range on all main lifts before deload',
      'Weeks 9–10: RPE 8.5 — push hard but stay technical. No grinding ugly reps',
      'Week 11: PR attempts on Squat, Bench, Deadlift, and OHP. This is your test week',
      'Week 12: Deload. Half volume, 60% intensity. Let the gains lock in',
    ],
  },
  deload: {
    frequency: 'Every 4th week (Weeks 4, 8, and 12)',
    rationale:
      'Fatigue is cumulative and invisible — it masks fitness. A 1-week deload every 4 weeks allows the nervous system and connective tissue to recover, which is when supercompensation actually occurs. Skipping deloads eventually leads to stagnation or injury.',
    protocol:
      'Reduce training volume by 50% (2–3 sets per exercise instead of 4–5) and intensity by 30–40% (RPE 5–6, never above RPE 7). Maintain movement quality and session frequency — just less of each.',
    deloadWeekExample: {
      adjustments: [
        'Barbell Back Squat: 3 × 6 @ 60% of Phase intensity (RPE 5)',
        'Bench Press: 3 × 6 @ 60% of Phase intensity (RPE 5)',
        'Deadlift: 2 × 5 @ 55% (treat as technique practice)',
        'Overhead Press: 3 × 6 @ 60% (RPE 5)',
        'All accessory work: 2 sets maximum, RPE 5–6, focus on feel over load',
        'Skip any exercises that feel uncomfortable or irritated — the deload is recovery, not testing',
      ],
      mindset:
        'A deload is not weakness — it is the most important week of the cycle. Every elite athlete deloads. You will feel like you are losing fitness; you are not. You will come back stronger, guaranteed.',
    },
  },
  nutrition: {
    included: true,
    method: 'macro_based',
    dailyCalories: 2800,
    calorieSplit:
      'Estimated from bodyweight and activity level: ~14–16 kcal/lb bodyweight adjusted for 4 training days/week. Training days: 2,900 kcal. Rest days: 2,600 kcal. Adjust by ±200 kcal based on 2-week weight trend.',
    macros: {
      protein: { grams: 200, calories: 800, perMeal: '45–50g' },
      carbs: { grams: 310, calories: 1240, perMeal: '70–80g' },
      fats: { grams: 85, calories: 765, perMeal: '18–22g' },
    },
    handPortions: {
      protein: '2 palms per meal (chicken, beef, fish, eggs)',
      carbs: '2 cupped hands per meal (rice, oats, potatoes)',
      fats: '2 thumbs per meal (olive oil, nuts, avocado)',
      vegetables: '2 fists per meal — non-starchy only (broccoli, spinach, peppers)',
    },
    mealTiming: [
      'Pre-workout (60–90 min before): moderate carbs + protein — e.g., oats + protein shake',
      'Post-workout (within 2 hrs): prioritize protein + carbs — e.g., rice, chicken, and fruit',
      'Distribute protein across 4–5 meals; 40–50g per meal maximizes muscle protein synthesis',
      'On rest days: reduce carbs by 50–80g from lowest-carb meals; keep protein identical',
      'Final meal of the day: slower protein (cottage cheese or Greek yogurt) to support overnight recovery',
    ],
    bodyFatNotes:
      'At your estimated body fat, a body recomposition approach is viable — slight caloric surplus on training days and slight deficit on rest days will build muscle while slowly reducing fat over 12 weeks.',
    supplements: {
      foundational: [
        'Creatine monohydrate: 5g daily (any time, consistency matters more than timing)',
        'Vitamin D3 + K2: 3,000–5,000 IU D3 + 100 mcg K2 daily (most people are deficient)',
        'Magnesium glycinate: 300–400 mg before bed (sleep quality + recovery)',
        'Omega-3 fish oil: 2–3g EPA/DHA daily (inflammation reduction)',
      ],
      optional: [
        'Beta-alanine: 3.2–6.4g daily (endurance in rep ranges above 8 — causes tingling)',
        'Citrulline malate: 6–8g pre-workout (better pumps + endurance)',
        'Caffeine: 150–200 mg pre-workout — avoid after 2pm to protect sleep',
        'Collagen peptides: 15g with Vitamin C pre-workout (joint and tendon support)',
      ],
    },
  },
  faq: [
    {
      question: 'What if I miss a session?',
      answer:
        'Do not double up the next day. Simply skip it and continue from where you left off. Consistency over weeks matters far more than any single session. If you miss 2+ consecutive sessions due to illness, return at 70–80% of previous loads and build back over 1 week.',
    },
    {
      question: 'My schedule only allows me to train 3 days instead of 4 — what do I do?',
      answer:
        "Run Upper A, Lower A, Upper B in Week 1; then Lower B, Upper A, Lower A in Week 2, alternating. You'll complete all sessions every 8 days instead of 7. Progress will be slightly slower but the programming quality is maintained.",
    },
    {
      question: 'How should I warm up for each main lift?',
      answer:
        'Follow the session warmup, then do progressively heavier warm-up sets: 50% × 8, 65% × 5, 80% × 3, 90% × 1 (optional), then first working set. Never go straight to working weight — it reduces performance and increases injury risk.',
    },
    {
      question: 'When should I increase the weight?',
      answer:
        'Hit the top of the prescribed rep range for 2 consecutive sessions at the correct RPE. Then add the smallest available increment (typically 1.25–2.5 kg per side on barbells, the next dumbbell size). Do not rush progression — each session at the same weight is still a productive training stimulus as you are getting more efficient at that load.',
    },
    {
      question: 'I feel very sore — should I still train?',
      answer:
        'Mild soreness (DOMS) is normal and not a reason to skip. Train through it — movement and blood flow accelerate recovery. Reduce load by 10% if soreness is severe. Only skip if you have sharp, joint-specific pain (as opposed to muscular soreness), or if you are ill with fever.',
    },
    {
      question: 'What does "RPE 7" actually feel like?',
      answer:
        'At RPE 7, you finish a set and feel like you could have done 3 more clean reps with good form before reaching failure. It should feel challenging but very controlled — you are breathing hard but your technique is solid throughout. If you are grinding or losing position, you are above RPE 7.',
    },
  ],
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

  // ── 4. Initialize Anthropic client (fall back to mock if no key) ───────────
  const client = getAnthropicClient()

  if (!client) {
    console.warn(
      `[generate-program][${requestId}] ANTHROPIC_API_KEY not set — returning mock program. ` +
      'Set the key in .env.local to use Claude.'
    )
    const successBody: GenerateProgramResponse = {
      success: true,
      program: MOCK_PROGRAM,
      generatedAt: new Date().toISOString(),
      modelUsed: 'mock',
    }
    return NextResponse.json(successBody, {
      status: 200,
      headers: { 'Cache-Control': 'no-store', 'X-Request-Id': requestId, 'X-Mock': 'true' },
    })
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
    model: hasKey ? MODEL : 'mock (no API key)',
    apiKeyConfigured: hasKey,
    mockMode: !hasKey,
    timestamp: new Date().toISOString(),
  })
}

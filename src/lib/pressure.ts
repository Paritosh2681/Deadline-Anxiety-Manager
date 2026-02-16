import { EffortLevel, PressureZone } from '@/types'
import { differenceInHours } from 'date-fns'
import { EFFORT_WEIGHTS, PRESSURE_THRESHOLDS } from './constants'

function calculateUrgencyMultiplier(hoursRemaining: number): number {
  if (hoursRemaining <= 0) {
    return 2.0 + Math.min(1.0, Math.abs(hoursRemaining) / 168)
  }
  if (hoursRemaining <= 24) {
    return 1.5 + (1 - hoursRemaining / 24) * 0.5
  }
  if (hoursRemaining <= 48) {
    return 1.0 + (1 - (hoursRemaining - 24) / 24) * 0.5
  }
  if (hoursRemaining <= 168) {
    return 0.6 + (1 - (hoursRemaining - 48) / 120) * 0.4
  }
  return Math.max(0.3, 0.6 - (hoursRemaining - 168) / 720 * 0.3)
}

export function calculatePressureScore(
  effortLevel: EffortLevel,
  deadline: Date,
  completedMicroTasks: number,
  totalMicroTasks: number,
  now: Date = new Date()
): number {
  const hoursRemaining = differenceInHours(deadline, now)

  const baseEffort = EFFORT_WEIGHTS[effortLevel]
  const urgency = calculateUrgencyMultiplier(hoursRemaining)
  const completion = 1 - (totalMicroTasks > 0
    ? (completedMicroTasks / totalMicroTasks) * 0.6
    : 0)

  const raw = baseEffort * urgency * completion
  return Math.round(Math.min(100, Math.max(0, raw)))
}

export function getPressureZone(score: number): PressureZone {
  if (score >= PRESSURE_THRESHOLDS.panic) return 'panic'
  if (score >= PRESSURE_THRESHOLDS.warning) return 'warning'
  return 'calm'
}

export function recalculatePressure(task: {
  effortLevel: EffortLevel
  deadline: Date | string
  microTasks: { isCompleted: boolean }[]
}): { pressureScore: number; pressureZone: PressureZone } {
  const deadline = typeof task.deadline === 'string' ? new Date(task.deadline) : task.deadline
  const completed = task.microTasks.filter(mt => mt.isCompleted).length
  const total = task.microTasks.length

  const pressureScore = calculatePressureScore(task.effortLevel, deadline, completed, total)
  const pressureZone = getPressureZone(pressureScore)

  return { pressureScore, pressureZone }
}

import { EffortLevel, PressureZone } from '@/types'

export function formatEffortLevel(level: EffortLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export function formatPressureScore(score: number): string {
  return String(score)
}

export function formatPressureZone(zone: PressureZone): string {
  return zone.charAt(0).toUpperCase() + zone.slice(1)
}

export function getMicroTaskProgress(
  completed: number,
  total: number
): { percentage: number; label: string } {
  if (total === 0) return { percentage: 0, label: '0/0' }
  const percentage = Math.round((completed / total) * 100)
  return { percentage, label: `${completed}/${total}` }
}

import { differenceInDays, differenceInHours, format, isPast } from 'date-fns'

export function daysUntilDeadline(deadline: string | Date): number {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline
  return differenceInDays(d, new Date())
}

export function hoursUntilDeadline(deadline: string | Date): number {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline
  return differenceInHours(d, new Date())
}

export function isOverdue(deadline: string | Date): boolean {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline
  return isPast(d)
}

export function formatDeadline(deadline: string | Date): string {
  const d = typeof deadline === 'string' ? new Date(deadline) : deadline
  return format(d, 'MMM d, yyyy')
}

export function formatRelativeDeadline(deadline: string | Date): string {
  const days = daysUntilDeadline(deadline)

  if (days < 0) {
    const absDays = Math.abs(days)
    return absDays === 1 ? 'Overdue by 1 day' : `Overdue by ${absDays} days`
  }
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days <= 7) return `${days} days left`
  if (days <= 30) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? '1 week left' : `${weeks} weeks left`
  }
  return formatDeadline(deadline)
}

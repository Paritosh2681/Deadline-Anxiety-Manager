import { PressureZone } from '@/types'
import clsx from 'clsx'

interface PressureBadgeProps {
  score: number
  zone: PressureZone
}

const zoneStyles: Record<PressureZone, string> = {
  calm: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  panic: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
}

const zoneDots: Record<PressureZone, string> = {
  calm: 'bg-emerald-500',
  warning: 'bg-amber-500',
  panic: 'bg-red-500',
}

export default function PressureBadge({ score, zone }: PressureBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0',
        'tabular-nums tracking-tight',
        zoneStyles[zone]
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', zoneDots[zone])} />
      {score}
    </span>
  )
}

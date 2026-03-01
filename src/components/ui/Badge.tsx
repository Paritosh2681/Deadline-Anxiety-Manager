import clsx from 'clsx'
import { PressureZone } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  zone?: PressureZone
  className?: string
}

const zoneStyles: Record<PressureZone, string> = {
  calm: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  panic: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
}

export default function Badge({ children, zone, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border tracking-tight',
        zone
          ? zoneStyles[zone]
          : 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
        className
      )}
    >
      {children}
    </span>
  )
}

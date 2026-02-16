import clsx from 'clsx'
import { PressureZone } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  zone?: PressureZone
  className?: string
}

const zoneStyles: Record<PressureZone, string> = {
  calm: 'bg-calm-100 text-calm-700 dark:bg-calm-700 dark:text-calm-100',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-700 dark:text-warning-100',
  panic: 'bg-panic-100 text-panic-700 dark:bg-panic-700 dark:text-panic-100',
}

export default function Badge({ children, zone, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-[6px]',
        zone ? zoneStyles[zone] : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        className
      )}
    >
      {children}
    </span>
  )
}

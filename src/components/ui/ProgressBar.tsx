import clsx from 'clsx'
import { PressureZone } from '@/types'

interface ProgressBarProps {
  percentage: number
  zone?: PressureZone
  className?: string
}

const zoneBarColors: Record<PressureZone, string> = {
  calm: 'bg-calm-500',
  warning: 'bg-warning-500',
  panic: 'bg-panic-500',
}

export default function ProgressBar({ percentage, zone = 'calm', className }: ProgressBarProps) {
  return (
    <div className={clsx('w-full h-1.5 bg-gray-200 rounded-full dark:bg-gray-700', className)}>
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-300',
          zoneBarColors[zone]
        )}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  )
}

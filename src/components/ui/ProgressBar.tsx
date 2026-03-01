import clsx from 'clsx'
import { PressureZone } from '@/types'

interface ProgressBarProps {
  percentage: number
  zone?: PressureZone
  className?: string
  size?: 'sm' | 'md'
}

const zoneGradients: Record<PressureZone, string> = {
  calm: 'from-emerald-400 to-emerald-500',
  warning: 'from-amber-400 to-amber-500',
  panic: 'from-red-400 to-red-500',
}

export default function ProgressBar({ percentage, zone = 'calm', className, size = 'sm' }: ProgressBarProps) {
  const height = size === 'md' ? 'h-2' : 'h-1.5'
  return (
    <div className={clsx(
      'w-full bg-zinc-100 rounded-full dark:bg-zinc-800 overflow-hidden',
      height,
      className
    )}>
      <div
        className={clsx(
          'h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r',
          zoneGradients[zone]
        )}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  )
}

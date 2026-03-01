'use client'

import { DashboardStats as Stats } from '@/types'
import clsx from 'clsx'

interface DashboardStatsProps {
  stats: Stats
}

const items = (stats: Stats) => [
  {
    label: 'Active',
    value: stats.totalActive,
    color: 'text-zinc-900 dark:text-zinc-100',
    sub: 'in progress',
  },
  {
    label: 'Completed',
    value: stats.totalCompleted,
    color: 'text-emerald-600 dark:text-emerald-400',
    sub: 'finished',
  },
  {
    label: 'Overdue',
    value: stats.totalOverdue,
    color: stats.totalOverdue > 0 ? 'text-red-500 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-100',
    sub: 'missed',
  },
  {
    label: 'Avg. Pressure',
    value: stats.averagePressure,
    color: stats.averagePressure > 60
      ? 'text-red-500 dark:text-red-400'
      : stats.averagePressure > 30
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-emerald-600 dark:text-emerald-400',
    sub: 'score',
  },
]

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items(stats).map((item) => (
        <div
          key={item.label}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-4 shadow-subtle"
        >
          <p className={clsx('text-2xl font-bold tracking-tight tabular-nums font-display', item.color)}>
            {item.value}
          </p>
          <p className="text-xs font-semibold text-[var(--color-text-secondary)] mt-0.5 tracking-tight">
            {item.label}
          </p>
          <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{item.sub}</p>
        </div>
      ))}
    </div>
  )
}

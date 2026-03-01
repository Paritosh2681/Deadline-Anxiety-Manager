'use client'

import { Task, PressureZone } from '@/types'
import TaskCard from '@/components/tasks/TaskCard'
import clsx from 'clsx'

interface PressureGroupProps {
  level: PressureZone
  tasks: Task[]
}

const groupMeta: Record<PressureZone, { label: string; dot: string; count: string }> = {
  panic: {
    label: 'Needs attention',
    dot: 'bg-red-500',
    count: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
  },
  warning: {
    label: 'Building pressure',
    dot: 'bg-amber-500',
    count: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  },
  calm: {
    label: 'On track',
    dot: 'bg-emerald-500',
    count: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  },
}

export default function PressureGroup({ level, tasks }: PressureGroupProps) {
  if (tasks.length === 0) return null
  const meta = groupMeta[level]

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={clsx('w-2 h-2 rounded-full shrink-0', meta.dot)} />
        <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">
          {meta.label}
        </h2>
        <span className={clsx(
          'inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-full border tabular-nums',
          meta.count
        )}>
          {tasks.length}
        </span>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  )
}

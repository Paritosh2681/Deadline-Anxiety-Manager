'use client'

import { Task, PressureZone } from '@/types'
import TaskCard from '@/components/tasks/TaskCard'
import clsx from 'clsx'

interface PressureGroupProps {
  level: PressureZone
  tasks: Task[]
}

const groupLabels: Record<PressureZone, string> = {
  panic: 'Needs attention now',
  warning: 'Building pressure',
  calm: 'On track',
}

const groupHeaderColors: Record<PressureZone, string> = {
  panic: 'text-panic-700 dark:text-panic-200',
  warning: 'text-warning-700 dark:text-warning-200',
  calm: 'text-calm-700 dark:text-calm-200',
}

const groupDotColors: Record<PressureZone, string> = {
  panic: 'bg-panic-500',
  warning: 'bg-warning-500',
  calm: 'bg-calm-500',
}

export default function PressureGroup({ level, tasks }: PressureGroupProps) {
  if (tasks.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={clsx('w-2 h-2 rounded-full', groupDotColors[level])} />
        <h2 className={clsx('text-sm font-semibold', groupHeaderColors[level])}>
          {groupLabels[level]}
        </h2>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  )
}

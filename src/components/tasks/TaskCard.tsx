'use client'

import { Task } from '@/types'
import PressureBadge from './PressureBadge'
import ProgressBar from '@/components/ui/ProgressBar'
import { formatRelativeDeadline } from '@/utils/dates'
import { getMicroTaskProgress, formatEffortLevel } from '@/utils/formatting'
import { PRESSURE_COLORS, CONSEQUENCE_MESSAGES } from '@/lib/constants'
import Link from 'next/link'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const { pressureScore, pressureZone } = task
  const colors = PRESSURE_COLORS[pressureZone]
  const completed = task.microTasks.filter((mt) => mt.isCompleted).length
  const total = task.microTasks.length
  const { percentage, label } = getMicroTaskProgress(completed, total)

  const todayTask = task.microTasks.find((mt) => !mt.isCompleted)

  const messages = CONSEQUENCE_MESSAGES[pressureZone]
  const consequenceMessage = messages[Math.floor(Math.random() * messages.length)]

  return (
    <Link href={`/tasks/${task._id}`} className="block">
      <div
        className="bg-[var(--color-surface)] border-l-4 p-5 rounded-r-lg shadow-subtle hover:shadow-card transition-shadow"
        style={{ borderLeftColor: colors.accent }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
              {task.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[var(--color-text-secondary)]">
                {formatEffortLevel(task.effortLevel)}
              </span>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {formatRelativeDeadline(task.deadline)}
              </span>
            </div>
          </div>
          <PressureBadge score={pressureScore} zone={pressureZone} />
        </div>

        {todayTask && (
          <div className="bg-[var(--color-surface-secondary)] p-3 rounded-[6px] mb-3">
            <p className="text-xs text-[var(--color-text-secondary)] mb-0.5">Next up:</p>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {todayTask.title}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-2">
          <ProgressBar percentage={percentage} zone={pressureZone} className="flex-1" />
          <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
            {label}
          </span>
        </div>

        {pressureScore > 30 && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">
            {consequenceMessage}
          </p>
        )}
      </div>
    </Link>
  )
}

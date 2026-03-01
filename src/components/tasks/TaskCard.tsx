'use client'

import { Task } from '@/types'
import PressureBadge from './PressureBadge'
import ProgressBar from '@/components/ui/ProgressBar'
import { formatRelativeDeadline } from '@/utils/dates'
import { getMicroTaskProgress, formatEffortLevel } from '@/utils/formatting'
import { PRESSURE_COLORS, CONSEQUENCE_MESSAGES } from '@/lib/constants'
import Link from 'next/link'
import { Clock, Zap, ArrowRight } from 'lucide-react'

interface TaskCardProps {
  task: Task
}

const zoneRingColor: Record<string, string> = {
  calm: 'border-l-emerald-400',
  warning: 'border-l-amber-400',
  panic: 'border-l-red-400',
}

export default function TaskCard({ task }: TaskCardProps) {
  const { pressureScore, pressureZone } = task
  const completed = task.microTasks.filter((mt) => mt.isCompleted).length
  const total = task.microTasks.length
  const { percentage, label } = getMicroTaskProgress(completed, total)

  const todayTask = task.microTasks.find((mt) => !mt.isCompleted)

  const messages = CONSEQUENCE_MESSAGES[pressureZone]
  const consequenceMessage = messages[Math.floor(Math.random() * messages.length)]

  return (
    <Link href={`/tasks/${task._id}`} className="block group">
      <div
        className={[
          'bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]',
          'border-l-[3px] p-5',
          'shadow-subtle hover:shadow-card',
          'transition-all duration-200 hover:-translate-y-0.5',
          zoneRingColor[pressureZone] ?? 'border-l-zinc-300',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="font-semibold text-[var(--color-text-primary)] truncate text-[0.9rem] tracking-tight leading-snug group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
              {task.name}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                <Zap size={10} strokeWidth={2} />
                {formatEffortLevel(task.effortLevel)}
              </span>
              <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                <Clock size={10} strokeWidth={2} />
                {formatRelativeDeadline(task.deadline)}
              </span>
            </div>
          </div>
          <PressureBadge score={pressureScore} zone={pressureZone} />
        </div>

        {/* Next step */}
        {todayTask && (
          <div className="bg-[var(--color-surface-secondary)] px-3 py-2.5 rounded-lg mb-3 flex items-center gap-2">
            <ArrowRight size={12} strokeWidth={2.5} className="text-[var(--color-text-tertiary)] shrink-0" />
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              <span className="text-[var(--color-text-tertiary)] mr-1">Next:</span>
              {todayTask.title}
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center gap-3">
          <ProgressBar percentage={percentage} zone={pressureZone} className="flex-1" />
          <span className="text-xs text-[var(--color-text-tertiary)] whitespace-nowrap tabular-nums">
            {label}
          </span>
        </div>

        {pressureScore > 30 && (
          <p className="text-xs text-[var(--color-text-tertiary)] mt-2.5 italic leading-relaxed">
            {consequenceMessage}
          </p>
        )}
      </div>
    </Link>
  )
}

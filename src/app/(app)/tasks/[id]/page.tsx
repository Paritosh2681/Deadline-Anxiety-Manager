'use client'

import { useParams, useRouter } from 'next/navigation'
import { useTask, completeMicroTask, deleteTask } from '@/hooks/useTasks'
import PressureBadge from '@/components/tasks/PressureBadge'
import MicroTaskList from '@/components/tasks/MicroTaskList'
import DeadlineSimulator from '@/components/tasks/DeadlineSimulator'
import ProgressBar from '@/components/ui/ProgressBar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { formatDeadline, formatRelativeDeadline, daysUntilDeadline } from '@/utils/dates'
import { formatEffortLevel, getMicroTaskProgress } from '@/utils/formatting'
import { CONSEQUENCE_MESSAGES } from '@/lib/constants'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { ArrowLeft, Zap, Calendar, RotateCcw, Trash2 } from 'lucide-react'

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { task, isLoading, mutate } = useTask(id)
  const [toggling, setToggling] = useState<string | null>(null)

  if (isLoading || !task) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Skeleton className="h-4 w-24 mb-6" />
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-8" />
        <Skeleton className="h-32 mb-4 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  const completed = task.microTasks.filter((mt) => mt.isCompleted).length
  const total = task.microTasks.length
  const { percentage, label } = getMicroTaskProgress(completed, total)
  const days = daysUntilDeadline(task.deadline)

  const consequenceMessage = task.pressureScore > 30
    ? CONSEQUENCE_MESSAGES[task.pressureZone][
      Math.floor(Math.random() * CONSEQUENCE_MESSAGES[task.pressureZone].length)
    ]
    : null

  const handleToggle = async (microTaskId: string) => {
    setToggling(microTaskId)
    try {
      const updated = await completeMicroTask(task._id, microTaskId)
      mutate(updated, false)
      if (updated.isCompleted) toast.success('Task completed! 🎉')
    } catch {
      toast.error('Failed to update step')
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this task? This cannot be undone.')) return
    try {
      await deleteTask(task._id)
      toast.success('Task deleted')
      router.push('/dashboard')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Back */}
      <button
        onClick={() => router.push('/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
      >
        <ArrowLeft size={13} strokeWidth={2.5} />
        Dashboard
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0 mr-4">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight font-display leading-snug">
            {task.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
              <Zap size={12} strokeWidth={2} />
              {formatEffortLevel(task.effortLevel)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
              <Calendar size={12} strokeWidth={2} />
              {formatDeadline(task.deadline)}
            </span>
            <span className="text-xs text-[var(--color-text-tertiary)]">
              {formatRelativeDeadline(task.deadline)}
            </span>
          </div>
        </div>
        <PressureBadge score={task.pressureScore} zone={task.pressureZone} />
      </div>

      {/* Progress */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-[var(--color-text-primary)] tracking-tight">Progress</span>
          <span className="text-xs text-[var(--color-text-tertiary)] tabular-nums">{label}</span>
        </div>
        <ProgressBar percentage={percentage} zone={task.pressureZone} size="md" />
        {consequenceMessage && (
          <p className="text-xs text-[var(--color-text-tertiary)] mt-3 italic leading-relaxed">
            {consequenceMessage}
          </p>
        )}
      </Card>

      {/* Micro-tasks */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-tight mb-3">
          Steps
        </h2>
        <MicroTaskList
          microTasks={task.microTasks}
          onToggle={handleToggle}
          disabled={toggling !== null}
        />
      </Card>

      {/* Deadline Simulator */}
      {!task.isCompleted && days > 0 && (
        <Card className="mb-4">
          <DeadlineSimulator taskId={task._id} daysRemaining={days} />
        </Card>
      )}

      {/* Reschedule info */}
      {task.rescheduleCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-[var(--color-border)]">
          <RotateCcw size={13} strokeWidth={2} className="text-[var(--color-text-tertiary)] shrink-0" />
          <p className="text-xs text-[var(--color-text-secondary)]">
            Rescheduled{' '}
            <span className="font-semibold tabular-nums">{task.rescheduleCount}</span>{' '}
            time{task.rescheduleCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Button variant="danger" size="sm" onClick={handleDelete}>
          <Trash2 size={13} strokeWidth={2} />
          Delete task
        </Button>
      </div>
    </div>
  )
}

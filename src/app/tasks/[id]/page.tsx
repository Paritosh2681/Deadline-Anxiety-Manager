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

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { task, isLoading, mutate } = useTask(id)
  const [toggling, setToggling] = useState<string | null>(null)

  if (isLoading || !task) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-32 mb-8" />
        <Skeleton className="h-48 mb-6" />
        <Skeleton className="h-64" />
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

      if (updated.isCompleted) {
        toast.success('Task completed!')
      }
    } catch {
      toast.error('Failed to update micro-task')
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this task? This cannot be undone.')) return

    try {
      await deleteTask(task._id)
      toast.success('Task deleted')
      router.push('/')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            {task.name}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-[var(--color-text-secondary)]">
              {formatEffortLevel(task.effortLevel)}
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {formatDeadline(task.deadline)}
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {formatRelativeDeadline(task.deadline)}
            </span>
          </div>
        </div>
        <PressureBadge score={task.pressureScore} zone={task.pressureZone} />
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">Progress</span>
          <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
        </div>
        <ProgressBar percentage={percentage} zone={task.pressureZone} />

        {consequenceMessage && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-3">
            {consequenceMessage}
          </p>
        )}
      </Card>

      {/* Micro-tasks */}
      <Card className="mb-6">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Micro-tasks
        </h2>
        <MicroTaskList
          microTasks={task.microTasks}
          onToggle={handleToggle}
          disabled={toggling !== null}
        />
      </Card>

      {/* Deadline Simulator */}
      {!task.isCompleted && days > 0 && (
        <Card className="mb-6">
          <DeadlineSimulator taskId={task._id} daysRemaining={days} />
        </Card>
      )}

      {/* Reschedule info */}
      {task.rescheduleCount > 0 && (
        <Card className="mb-6">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Rescheduled {task.rescheduleCount} time{task.rescheduleCount !== 1 ? 's' : ''}
          </p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => router.push('/')}>
          Back to dashboard
        </Button>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          Delete task
        </Button>
      </div>
    </div>
  )
}

'use client'

import clsx from 'clsx'
import { MicroTask } from '@/types'

interface MicroTaskItemProps {
  microTask: MicroTask
  onToggle: (id: string) => void
  disabled?: boolean
}

export default function MicroTaskItem({ microTask, onToggle, disabled }: MicroTaskItemProps) {
  return (
    <label
      className={clsx(
        'flex items-start gap-3 p-3 rounded-[6px] transition-colors cursor-pointer',
        'hover:bg-[var(--color-surface-secondary)]',
        microTask.isCompleted && 'opacity-60'
      )}
    >
      <input
        type="checkbox"
        checked={microTask.isCompleted}
        onChange={() => onToggle(microTask.id)}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400 dark:border-gray-600"
      />
      <span
        className={clsx(
          'text-sm text-[var(--color-text-primary)]',
          microTask.isCompleted && 'line-through'
        )}
      >
        {microTask.title}
      </span>
    </label>
  )
}

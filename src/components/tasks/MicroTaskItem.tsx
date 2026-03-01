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
        'flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer select-none',
        'hover:bg-[var(--color-surface-secondary)]',
        microTask.isCompleted && 'opacity-50',
        disabled && 'pointer-events-none'
      )}
    >
      <input
        type="checkbox"
        checked={microTask.isCompleted}
        onChange={() => onToggle(microTask.id)}
        disabled={disabled}
        className="custom-checkbox mt-0.5"
      />
      <span
        className={clsx(
          'text-sm text-[var(--color-text-primary)] leading-snug',
          microTask.isCompleted && 'line-through text-[var(--color-text-tertiary)]'
        )}
      >
        {microTask.title}
      </span>
    </label>
  )
}

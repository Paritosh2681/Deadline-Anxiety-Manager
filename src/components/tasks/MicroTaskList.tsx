'use client'

import { MicroTask } from '@/types'
import MicroTaskItem from './MicroTaskItem'

interface MicroTaskListProps {
  microTasks: MicroTask[]
  onToggle: (id: string) => void
  disabled?: boolean
}

export default function MicroTaskList({ microTasks, onToggle, disabled }: MicroTaskListProps) {
  const sorted = [...microTasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1
    return a.order - b.order
  })

  return (
    <div className="space-y-1">
      {sorted.map((mt) => (
        <MicroTaskItem
          key={mt.id}
          microTask={mt}
          onToggle={onToggle}
          disabled={disabled}
        />
      ))}
    </div>
  )
}

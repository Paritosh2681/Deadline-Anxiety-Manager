'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { EffortLevel } from '@/types'
import { toast } from 'react-toastify'
import clsx from 'clsx'

export default function TaskForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState('')
  const [effortLevel, setEffortLevel] = useState<EffortLevel>('medium')
  const [microTasks, setMicroTasks] = useState<string[]>([''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Task name is required'
    } else if (name.trim().length > 200) {
      newErrors.name = 'Task name must be 200 characters or less'
    }

    if (!deadline) {
      newErrors.deadline = 'Deadline is required'
    } else {
      const deadlineDate = new Date(deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline must be in the future'
      }
    }

    const validMicroTasks = microTasks.filter(t => t.trim())
    if (validMicroTasks.length === 0) {
      newErrors.microTasks = 'Add at least one micro-task'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const validMicroTasks = microTasks.filter(t => t.trim())
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          deadline,
          effortLevel,
          microTasks: validMicroTasks,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create task')
      }

      toast.success('Task created')
      await mutate('/api/tasks?status=all')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addMicroTask = () => {
    setMicroTasks(prev => [...prev, ''])
  }

  const removeMicroTask = (index: number) => {
    setMicroTasks(prev => prev.filter((_, i) => i !== index))
  }

  const updateMicroTask = (index: number, value: string) => {
    setMicroTasks(prev => prev.map((t, i) => (i === index ? value : t)))
  }

  const handleMicroTaskKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (microTasks[index].trim()) {
        addMicroTask()
      }
    }
  }

  const effortOptions: { value: EffortLevel; label: string }[] = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <Input
        id="name"
        label="Task name"
        placeholder="What needs to be done?"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoFocus
      />

      <Input
        id="deadline"
        label="Deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        error={errors.deadline}
        min={new Date().toISOString().split('T')[0]}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--color-text-primary)]">
          Effort level
        </label>
        <div className="flex gap-2">
          {effortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setEffortLevel(opt.value)}
              className={clsx(
                'flex-1 py-2 px-3 text-sm font-semibold rounded-[6px] border transition-colors',
                effortLevel === opt.value
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--color-text-primary)]">
          Micro-tasks
        </label>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Break your task into smaller steps. Press Enter to add another.
        </p>
        <div className="space-y-2 mt-2">
          {microTasks.map((task, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-secondary)] w-5 text-right shrink-0">
                {index + 1}.
              </span>
              <input
                type="text"
                placeholder={`Step ${index + 1}...`}
                value={task}
                onChange={(e) => updateMicroTask(index, e.target.value)}
                onKeyDown={(e) => handleMicroTaskKeyDown(e, index)}
                className="flex-1 px-3 py-2 text-sm rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-colors"
              />
              {microTasks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMicroTask(index)}
                  className="p-1.5 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors shrink-0"
                  aria-label="Remove micro-task"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 3l8 8M11 3l-8 8" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMicroTask}
          className="mt-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          + Add step
        </button>
        {errors.microTasks && (
          <p className="text-sm text-red-500 mt-1">{errors.microTasks}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create task'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

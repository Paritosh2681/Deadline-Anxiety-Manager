'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), deadline, effortLevel }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create task')
      }

      toast.success('Task created')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
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

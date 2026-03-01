'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { EffortLevel } from '@/types'
import { toast } from 'react-toastify'
import clsx from 'clsx'
import { Plus, X } from 'lucide-react'

export default function TaskForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState('')
  const [effortLevel, setEffortLevel] = useState<EffortLevel>('medium')
  const [microTasks, setMicroTasks] = useState<string[]>([''])
  const [reminderTime, setReminderTime] = useState('09:00')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Task name is required'
    else if (name.trim().length > 200) newErrors.name = 'Task name must be 200 characters or less'
    if (!deadline) newErrors.deadline = 'Deadline is required'
    else {
      const deadlineDate = new Date(deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (deadlineDate < today) newErrors.deadline = 'Deadline must be in the future'
    }
    const validMicroTasks = microTasks.filter(t => t.trim())
    if (validMicroTasks.length === 0) newErrors.microTasks = 'Add at least one step'
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
          reminderTime: reminderTime || null,
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

  const addMicroTask = () => setMicroTasks(prev => [...prev, ''])
  const removeMicroTask = (index: number) => setMicroTasks(prev => prev.filter((_, i) => i !== index))
  const updateMicroTask = (index: number, value: string) =>
    setMicroTasks(prev => prev.map((t, i) => (i === index ? value : t)))
  const handleMicroTaskKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (microTasks[index].trim()) addMicroTask()
    }
  }

  const effortOptions: { value: EffortLevel; label: string; desc: string }[] = [
    { value: 'easy', label: 'Easy', desc: '~1–2h' },
    { value: 'medium', label: 'Medium', desc: '~4–6h' },
    { value: 'hard', label: 'Hard', desc: '~8h+' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Task name */}
      <Input
        id="name"
        label="Task name"
        placeholder="What needs to be done?"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoFocus
      />

      {/* Deadline */}
      <Input
        id="deadline"
        label="Deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        error={errors.deadline}
        min={new Date().toISOString().split('T')[0]}
      />

      {/* Reminder */}
      <div className="space-y-1.5">
        <label htmlFor="reminderTime" className="block text-[0.8rem] font-semibold text-[var(--color-text-primary)] tracking-tight">
          Daily reminder
        </label>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Get notified each day until the deadline.
        </p>
        <input
          id="reminderTime"
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all duration-150"
        />
      </div>

      {/* Effort level */}
      <div className="space-y-2">
        <label className="block text-[0.8rem] font-semibold text-[var(--color-text-primary)] tracking-tight">
          Effort level
        </label>
        <div className="flex gap-2">
          {effortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setEffortLevel(opt.value)}
              className={clsx(
                'flex-1 py-2.5 px-3 text-sm font-semibold rounded-xl border transition-all duration-150',
                effortLevel === opt.value
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-zinc-300 hover:text-[var(--color-text-primary)] dark:hover:border-zinc-600'
              )}
            >
              <span className="block tracking-tight">{opt.label}</span>
              <span className={clsx(
                'block text-[10px] font-normal mt-0.5',
                effortLevel === opt.value ? 'text-zinc-400 dark:text-zinc-600' : 'text-[var(--color-text-tertiary)]'
              )}>{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Micro-tasks */}
      <div className="space-y-2">
        <label className="block text-[0.8rem] font-semibold text-[var(--color-text-primary)] tracking-tight">
          Steps
        </label>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Break it down. Press Enter to add another step.
        </p>
        <div className="space-y-1.5 mt-2">
          {microTasks.map((task, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-tertiary)] w-5 text-right shrink-0 tabular-nums">
                {index + 1}.
              </span>
              <input
                type="text"
                placeholder={`Step ${index + 1}...`}
                value={task}
                onChange={(e) => updateMicroTask(index, e.target.value)}
                onKeyDown={(e) => handleMicroTaskKeyDown(e, index)}
                className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all duration-150"
              />
              {microTasks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMicroTask(index)}
                  className="p-1.5 text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                  aria-label="Remove step"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMicroTask}
          className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <Plus size={13} strokeWidth={2.5} />
          Add step
        </button>
        {errors.microTasks && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {errors.microTasks}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create task'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

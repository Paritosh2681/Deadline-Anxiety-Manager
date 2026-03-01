import TaskForm from '@/components/tasks/TaskForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewTaskPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-7">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors mb-4"
        >
          <ArrowLeft size={13} strokeWidth={2.5} />
          Dashboard
        </Link>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight font-display">
          New Task
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Break it down before the pressure breaks you.
        </p>
      </div>
      <TaskForm />
    </div>
  )
}

import TaskForm from '@/components/tasks/TaskForm'

export default function NewTaskPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
        New Task
      </h1>
      <TaskForm />
    </div>
  )
}

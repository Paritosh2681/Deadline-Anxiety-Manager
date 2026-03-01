'use client'

import { useTaskContext } from '@/context/TaskContext'
import { useState, useEffect, useMemo } from 'react'
import PressureGroup from '@/components/dashboard/PressureGroup'
import DashboardStats from '@/components/dashboard/DashboardStats'
import Skeleton from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { PressureGroupedTasks, Task } from '@/types'
import { Search, X, Plus } from 'lucide-react'

function DashboardSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Skeleton className="h-7 w-36 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { groupedTasks, stats, tasks, activeTasks, completedTasks } = useTaskContext()

  useEffect(() => { setMounted(true) }, [])

  const filteredTasks = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return tasks.filter(t => t.name.toLowerCase().includes(q))
  }, [query, tasks])

  const filteredActive = useMemo<Task[]>(() =>
    filteredTasks ? filteredTasks.filter(t => !t.isCompleted) : [],
    [filteredTasks]
  )
  const filteredCompleted = useMemo<Task[]>(() =>
    filteredTasks ? filteredTasks.filter(t => t.isCompleted) : [],
    [filteredTasks]
  )
  const filteredGroups = useMemo<PressureGroupedTasks | null>(() => {
    if (!filteredTasks) return null
    const groups: PressureGroupedTasks = { panic: [], warning: [], calm: [] }
    filteredActive.forEach(task => { groups[task.pressureZone || 'calm'].push(task) })
    return groups
  }, [filteredTasks, filteredActive])

  if (!mounted) return <DashboardSkeleton />

  const hasNoTasks = tasks.length === 0
  const isSearching = searchOpen && query.trim().length > 0
  const displayGroups = filteredGroups || groupedTasks
  const displayCompleted = isSearching ? filteredCompleted : completedTasks

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight font-display">
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSearchOpen(p => !p); if (searchOpen) setQuery('') }}
            className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[var(--color-text-primary)] transition-colors"
            aria-label="Search"
          >
            {searchOpen ? <X size={17} strokeWidth={2} /> : <Search size={17} strokeWidth={2} />}
          </button>
          <Link href="/tasks/new">
            <Button size="sm">
              <Plus size={14} strokeWidth={2.5} />
              New task
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      {searchOpen && (
        <div className="mb-6 animate-slide-up">
          <input
            type="text"
            placeholder="Search tasks…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
          />
          {isSearching && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-2 tabular-nums">
              {filteredTasks!.length} result{filteredTasks!.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}

      {hasNoTasks && !isSearching ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus size={24} strokeWidth={1.5} className="text-zinc-400" />
          </div>
          <p className="text-[var(--color-text-secondary)] mb-4 text-sm">
            No tasks yet. Create one to get started.
          </p>
          <Link href="/tasks/new">
            <Button>Create your first task</Button>
          </Link>
        </div>
      ) : isSearching && filteredTasks!.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[var(--color-text-secondary)] text-sm">No tasks match your search.</p>
        </div>
      ) : (
        <>
          {!isSearching && <DashboardStats stats={stats} />}

          <div className={isSearching ? 'space-y-8' : 'mt-8 space-y-8'}>
            <PressureGroup level="panic" tasks={displayGroups.panic} />
            <PressureGroup level="warning" tasks={displayGroups.warning} />
            <PressureGroup level="calm" tasks={displayGroups.calm} />
          </div>

          {displayCompleted.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                <h2 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-widest">
                  Completed
                </h2>
                <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-full border bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 tabular-nums">
                  {displayCompleted.length}
                </span>
              </div>
              <div className="space-y-2">
                {displayCompleted.map((task) => (
                  <Link key={task._id} href={`/tasks/${task._id}`} className="block group">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] border-l-[3px] border-l-zinc-200 dark:border-l-zinc-700 p-4 rounded-xl shadow-subtle hover:shadow-card transition-all duration-200 hover:-translate-y-0.5 opacity-60 hover:opacity-75">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 mr-3">
                          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] truncate line-through tracking-tight">
                            {task.name}
                          </h3>
                          <span className="text-xs text-[var(--color-text-tertiary)]">
                            {task.completedAt
                              ? `Completed ${new Date(task.completedAt).toLocaleDateString()}`
                              : 'Completed'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 shrink-0">
                          Done
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

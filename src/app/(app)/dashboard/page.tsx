'use client'

import { useTaskContext } from '@/context/TaskContext'
import { useState, useEffect, useMemo } from 'react'
import PressureGroup from '@/components/dashboard/PressureGroup'
import DashboardStats from '@/components/dashboard/DashboardStats'
import Skeleton from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { PressureGroupedTasks, Task } from '@/types'

function DashboardSkeleton() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-4 gap-4 mb-8">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
            </div>
            <div className="space-y-3">
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

    useEffect(() => {
        setMounted(true)
    }, [])

    const filteredTasks = useMemo(() => {
        if (!query.trim()) return null
        const q = query.toLowerCase()
        return tasks.filter(t => t.name.toLowerCase().includes(q))
    }, [query, tasks])

    const filteredActive = useMemo<Task[]>(() => {
        if (!filteredTasks) return []
        return filteredTasks.filter(t => !t.isCompleted)
    }, [filteredTasks])

    const filteredCompleted = useMemo<Task[]>(() => {
        if (!filteredTasks) return []
        return filteredTasks.filter(t => t.isCompleted)
    }, [filteredTasks])

    const filteredGroups = useMemo<PressureGroupedTasks | null>(() => {
        if (!filteredTasks) return null
        const groups: PressureGroupedTasks = { panic: [], warning: [], calm: [] }
        filteredActive.forEach(task => {
            const zone = task.pressureZone || 'calm'
            groups[zone].push(task)
        })
        return groups
    }, [filteredTasks, filteredActive])

    if (!mounted) {
        return <DashboardSkeleton />
    }

    const hasNoTasks = tasks.length === 0
    const isSearching = searchOpen && query.trim().length > 0
    const displayGroups = filteredGroups || groupedTasks
    const displayCompleted = isSearching ? filteredCompleted : completedTasks

    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
                    Dashboard
                </h1>
                <Button
                    size="sm"
                    variant={searchOpen ? 'secondary' : 'primary'}
                    onClick={() => {
                        setSearchOpen(prev => !prev)
                        if (searchOpen) setQuery('')
                    }}
                >
                    {searchOpen ? 'Close' : 'Search'}
                </Button>
            </div>

            {searchOpen && (
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search tasks by name..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        autoFocus
                        className="w-full px-4 py-2.5 text-sm rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                    />
                    {isSearching && (
                        <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                            {filteredTasks!.length} result{filteredTasks!.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                        </p>
                    )}
                </div>
            )}

            {hasNoTasks && !isSearching ? (
                <div className="text-center py-16">
                    <p className="text-[var(--color-text-secondary)] mb-4">
                        No tasks yet. Create one to get started.
                    </p>
                    <Link href="/tasks/new">
                        <Button>Create your first task</Button>
                    </Link>
                </div>
            ) : isSearching && filteredTasks!.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-[var(--color-text-secondary)]">
                        No tasks match your search.
                    </p>
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
                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                                    Completed
                                </h2>
                                <span className="text-xs text-[var(--color-text-secondary)]">
                                    {displayCompleted.length}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {displayCompleted.map((task) => (
                                    <Link key={task._id} href={`/tasks/${task._id}`} className="block">
                                        <div className="bg-[var(--color-surface)] border-l-4 border-gray-300 dark:border-gray-600 p-5 rounded-r-lg shadow-subtle hover:shadow-card transition-shadow opacity-70">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0 mr-3">
                                                    <h3 className="font-semibold text-[var(--color-text-primary)] truncate line-through">
                                                        {task.name}
                                                    </h3>
                                                    <span className="text-xs text-[var(--color-text-secondary)]">
                                                        {task.completedAt
                                                            ? `Completed ${new Date(task.completedAt).toLocaleDateString()}`
                                                            : 'Completed'}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
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

'use client'

import { createContext, useContext, useMemo, ReactNode } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Task, PressureGroupedTasks, DashboardStats } from '@/types'

interface TaskContextValue {
  tasks: Task[]
  isLoading: boolean
  error: any
  groupedTasks: PressureGroupedTasks
  stats: DashboardStats
  mutate: () => void
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const { tasks, isLoading, error, mutate } = useTasks('active')

  const groupedTasks = useMemo<PressureGroupedTasks>(() => {
    const groups: PressureGroupedTasks = { panic: [], warning: [], calm: [] }
    tasks.forEach((task) => {
      const zone = task.pressureZone || 'calm'
      groups[zone].push(task)
    })
    // Sort each group by pressure descending
    groups.panic.sort((a, b) => b.pressureScore - a.pressureScore)
    groups.warning.sort((a, b) => b.pressureScore - a.pressureScore)
    groups.calm.sort((a, b) => b.pressureScore - a.pressureScore)
    return groups
  }, [tasks])

  const stats = useMemo<DashboardStats>(() => {
    const totalActive = tasks.length
    const totalOverdue = tasks.filter(
      (t) => new Date(t.deadline) < new Date() && !t.isCompleted
    ).length
    const avgPressure = totalActive > 0
      ? Math.round(tasks.reduce((sum, t) => sum + t.pressureScore, 0) / totalActive)
      : 0

    return {
      totalActive,
      totalCompleted: 0, // Would need separate fetch
      totalOverdue,
      averagePressure: avgPressure,
    }
  }, [tasks])

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, error, groupedTasks, stats, mutate: () => mutate() }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider')
  return ctx
}

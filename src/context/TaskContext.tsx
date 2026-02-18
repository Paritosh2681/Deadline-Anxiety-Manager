'use client'

import { createContext, useContext, useMemo, ReactNode } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { Task, PressureGroupedTasks, DashboardStats } from '@/types'

interface TaskContextValue {
  tasks: Task[]
  activeTasks: Task[]
  completedTasks: Task[]
  isLoading: boolean
  error: any
  groupedTasks: PressureGroupedTasks
  stats: DashboardStats
  mutate: () => void
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const { tasks, isLoading, error, mutate } = useTasks('all')

  const activeTasks = useMemo(() => tasks.filter(t => !t.isCompleted), [tasks])
  const completedTasks = useMemo(() => tasks.filter(t => t.isCompleted), [tasks])

  const groupedTasks = useMemo<PressureGroupedTasks>(() => {
    const groups: PressureGroupedTasks = { panic: [], warning: [], calm: [] }
    activeTasks.forEach((task) => {
      const zone = task.pressureZone || 'calm'
      groups[zone].push(task)
    })
    // Sort each group by pressure descending
    groups.panic.sort((a, b) => b.pressureScore - a.pressureScore)
    groups.warning.sort((a, b) => b.pressureScore - a.pressureScore)
    groups.calm.sort((a, b) => b.pressureScore - a.pressureScore)
    return groups
  }, [activeTasks])

  const stats = useMemo<DashboardStats>(() => {
    const totalActive = activeTasks.length
    const totalOverdue = activeTasks.filter(
      (t) => new Date(t.deadline) < new Date()
    ).length
    const avgPressure = totalActive > 0
      ? Math.round(activeTasks.reduce((sum, t) => sum + t.pressureScore, 0) / totalActive)
      : 0

    return {
      totalActive,
      totalCompleted: completedTasks.length,
      totalOverdue,
      averagePressure: avgPressure,
    }
  }, [activeTasks, completedTasks])

  return (
    <TaskContext.Provider
      value={{ tasks, activeTasks, completedTasks, isLoading, error, groupedTasks, stats, mutate: () => mutate() }}
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

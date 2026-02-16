'use client'

import { useTaskContext } from '@/context/TaskContext'
import { useState, useEffect } from 'react'
import PressureGroup from '@/components/dashboard/PressureGroup'
import DashboardStats from '@/components/dashboard/DashboardStats'
import Skeleton from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import Link from 'next/link'

function DashboardSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-3 gap-4 mb-8">
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
  const { groupedTasks, stats, tasks } = useTaskContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <DashboardSkeleton />
  }

  const hasNoTasks = tasks.length === 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Dashboard
        </h1>
        <Link href="/tasks/new">
          <Button size="sm">New task</Button>
        </Link>
      </div>

      {hasNoTasks ? (
        <div className="text-center py-16">
          <p className="text-[var(--color-text-secondary)] mb-4">
            No tasks yet. Create one to get started.
          </p>
          <Link href="/tasks/new">
            <Button>Create your first task</Button>
          </Link>
        </div>
      ) : (
        <>
          <DashboardStats stats={stats} />

          <div className="mt-8 space-y-8">
            <PressureGroup level="panic" tasks={groupedTasks.panic} />
            <PressureGroup level="warning" tasks={groupedTasks.warning} />
            <PressureGroup level="calm" tasks={groupedTasks.calm} />
          </div>
        </>
      )}
    </div>
  )
}

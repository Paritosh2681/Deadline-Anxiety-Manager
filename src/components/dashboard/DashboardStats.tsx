'use client'

import { DashboardStats as Stats } from '@/types'
import Card from '@/components/ui/Card'

interface DashboardStatsProps {
  stats: Stats
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    { label: 'Active', value: stats.totalActive },
    { label: 'Completed', value: stats.totalCompleted },
    { label: 'Overdue', value: stats.totalOverdue },
    { label: 'Avg. Pressure', value: stats.averagePressure },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="text-center">
          <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
            {item.value}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            {item.label}
          </p>
        </Card>
      ))}
    </div>
  )
}

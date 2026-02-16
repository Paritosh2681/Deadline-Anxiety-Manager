'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { TimelineDataPoint } from '@/types'
import { PRESSURE_THRESHOLDS } from '@/lib/constants'
import Skeleton from '@/components/ui/Skeleton'

interface PressureTimelineProps {
  days?: number
}

export default function PressureTimeline({ days = 30 }: PressureTimelineProps) {
  const [data, setData] = useState<TimelineDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch(`/api/insights/timeline?days=${days}`)
        if (res.ok) {
          const timeline = await res.json()
          setData(timeline)
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchTimeline()
  }, [days])

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  if (data.length === 0 || data.every((d) => d.averagePressure === 0)) {
    return (
      <p className="text-sm text-[var(--color-text-secondary)]">
        No pressure data yet. Data will appear as you use the app.
      </p>
    )
  }

  return (
    <div className="w-full h-64 overflow-x-auto">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
            tickFormatter={(val) => {
              const d = new Date(val)
              return `${d.getMonth() + 1}/${d.getDate()}`
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              fontSize: '12px',
            }}
            labelFormatter={(label) => {
              const d = new Date(label)
              return d.toLocaleDateString()
            }}
          />
          <ReferenceLine
            y={PRESSURE_THRESHOLDS.warning}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />
          <ReferenceLine
            y={PRESSURE_THRESHOLDS.panic}
            stroke="#ef4444"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />
          <Line
            type="monotone"
            dataKey="averagePressure"
            stroke="#111827"
            strokeWidth={2}
            dot={false}
            name="Avg. Pressure"
          />
          <Line
            type="monotone"
            dataKey="completedCount"
            stroke="#22c55e"
            strokeWidth={1.5}
            dot={false}
            name="Completed"
            strokeDasharray="4 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

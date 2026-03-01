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
        if (res.ok) setData(await res.json())
      } catch { /* silently fail */ }
      finally { setLoading(false) }
    }
    fetchTimeline()
  }, [days])

  if (loading) return <Skeleton className="h-56 w-full" />

  if (data.length === 0 || data.every((d) => d.averagePressure === 0)) {
    return (
      <p className="text-sm text-[var(--color-text-secondary)] py-8 text-center">
        No pressure data yet. Data appears as you use the app.
      </p>
    )
  }

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -24, bottom: 5 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)', fontFamily: 'Inter' }}
            tickFormatter={(val) => {
              const d = new Date(val)
              return `${d.getMonth() + 1}/${d.getDate()}`
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: 'var(--shadow-elevated)',
              fontFamily: 'Inter',
            }}
            labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '4px', fontSize: '11px' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
          />
          <ReferenceLine y={PRESSURE_THRESHOLDS.warning} stroke="#f59e0b" strokeDasharray="4 3" strokeOpacity={0.4} />
          <ReferenceLine y={PRESSURE_THRESHOLDS.panic} stroke="#ef4444" strokeDasharray="4 3" strokeOpacity={0.4} />
          <Line
            type="monotone"
            dataKey="averagePressure"
            stroke="#18181b"
            strokeWidth={2}
            dot={false}
            name="Avg. Pressure"
            activeDot={{ r: 4, fill: '#18181b', stroke: '#fff', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="completedCount"
            stroke="#22c55e"
            strokeWidth={1.5}
            dot={false}
            name="Completed"
            strokeDasharray="4 2"
            activeDot={{ r: 3, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

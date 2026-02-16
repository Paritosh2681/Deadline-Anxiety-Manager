'use client'

import { useEffect, useState } from 'react'
import { Insight } from '@/types'
import InsightCard from './InsightCard'
import Skeleton from '@/components/ui/Skeleton'

export default function BehaviorPatterns() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch('/api/insights')
        if (res.ok) {
          const data = await res.json()
          setInsights(data)
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-secondary)]">
        Not enough data yet. Complete some tasks to see behavior patterns.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <InsightCard key={i} insight={insight} />
      ))}
    </div>
  )
}

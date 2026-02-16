'use client'

import { Insight } from '@/types'
import Card from '@/components/ui/Card'
import clsx from 'clsx'

interface InsightCardProps {
  insight: Insight
}

const typeColors: Record<Insight['type'], { bg: string; text: string }> = {
  pattern: { bg: 'bg-calm-100 dark:bg-calm-700', text: 'text-calm-700 dark:text-calm-100' },
  stat: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
  suggestion: { bg: 'bg-warning-100 dark:bg-warning-700', text: 'text-warning-700 dark:text-warning-100' },
}

export default function InsightCard({ insight }: InsightCardProps) {
  const colors = typeColors[insight.type]

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className={clsx('px-2 py-0.5 text-xs font-semibold rounded-[6px]', colors.bg, colors.text)}>
          {insight.type}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            {insight.title}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {insight.description}
          </p>
        </div>
        {insight.value !== undefined && (
          <span className="text-lg font-semibold text-[var(--color-text-primary)]">
            {insight.value}
          </span>
        )}
      </div>
    </Card>
  )
}

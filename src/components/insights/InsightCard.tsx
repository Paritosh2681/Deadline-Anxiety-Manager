'use client'

import { Insight } from '@/types'
import clsx from 'clsx'
import { TrendingUp, BarChart2, Lightbulb } from 'lucide-react'

interface InsightCardProps {
  insight: Insight
}

const typeConfig: Record<Insight['type'], {
  icon: React.ElementType
  label: string
  styles: string
  iconStyles: string
}> = {
  pattern: {
    icon: TrendingUp,
    label: 'Pattern',
    styles: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800',
    iconStyles: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40',
  },
  stat: {
    icon: BarChart2,
    label: 'Stat',
    styles: 'bg-zinc-50 border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-700',
    iconStyles: 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800',
  },
  suggestion: {
    icon: Lightbulb,
    label: 'Tip',
    styles: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
    iconStyles: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40',
  },
}

export default function InsightCard({ insight }: InsightCardProps) {
  const config = typeConfig[insight.type]
  const Icon = config.icon

  return (
    <div className={clsx(
      'flex items-start gap-4 p-4 rounded-xl border',
      config.styles
    )}>
      <div className={clsx('p-2 rounded-lg shrink-0', config.iconStyles)}>
        <Icon size={15} strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-tight">
            {insight.title}
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            {config.label}
          </span>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {insight.description}
        </p>
      </div>
      {insight.value !== undefined && (
        <span className="text-lg font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight font-display shrink-0">
          {insight.value}
        </span>
      )}
    </div>
  )
}

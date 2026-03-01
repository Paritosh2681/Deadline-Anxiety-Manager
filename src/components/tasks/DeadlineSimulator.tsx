'use client'

import { useState, useCallback } from 'react'
import Slider from '@/components/ui/Slider'
import { SimulateResponse, PressureZone } from '@/types'
import clsx from 'clsx'
import { TrendingUp } from 'lucide-react'

interface DeadlineSimulatorProps {
  taskId: string
  daysRemaining: number
}

const zoneStyles: Record<PressureZone, string> = {
  panic: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
  warning: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
  calm: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800',
}

const zoneValueColor: Record<PressureZone, string> = {
  panic: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  calm: 'text-emerald-600 dark:text-emerald-400',
}

export default function DeadlineSimulator({ taskId, daysRemaining }: DeadlineSimulatorProps) {
  const [daysToSkip, setDaysToSkip] = useState(0)
  const [result, setResult] = useState<SimulateResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const maxSkip = Math.max(0, daysRemaining - 1)

  const simulate = useCallback(async (days: number) => {
    if (days === 0) { setResult(null); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/tasks/${taskId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daysToSkip: days }),
      })
      if (res.ok) setResult(await res.json())
    } catch { /* silently fail */ }
    finally { setLoading(false) }
  }, [taskId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setDaysToSkip(val)
    simulate(val)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={15} strokeWidth={2} className="text-[var(--color-text-tertiary)]" />
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] tracking-tight">
          What if I skip{' '}
          <span className="tabular-nums">{daysToSkip}</span>{' '}
          {daysToSkip !== 1 ? 'days' : 'day'}?
        </h3>
      </div>

      <Slider min={0} max={maxSkip} value={daysToSkip} onChange={handleChange} />

      <div className="flex justify-between text-xs text-[var(--color-text-tertiary)]">
        <span>No skip</span>
        <span className="tabular-nums">{maxSkip} days</span>
      </div>

      {result && (
        <div className={clsx('p-4 rounded-xl border', zoneStyles[result.simulatedZone])}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--color-text-tertiary)] mb-1 uppercase tracking-wider font-semibold">Current</p>
              <p className="text-xl font-bold text-[var(--color-text-primary)] tabular-nums font-display">
                {result.currentScore}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-tertiary)] mb-1 uppercase tracking-wider font-semibold">After skipping</p>
              <p className={clsx('text-xl font-bold tabular-nums font-display', zoneValueColor[result.simulatedZone])}>
                {result.simulatedScore}
              </p>
            </div>
          </div>
          {result.dailyLoadIncrease > 0 && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-3 border-t border-current/10 pt-3">
              Daily workload increases by{' '}
              <span className="font-semibold tabular-nums">{result.dailyLoadIncrease}%</span>
            </p>
          )}
        </div>
      )}

      {loading && (
        <p className="text-xs text-[var(--color-text-tertiary)] animate-pulse">Calculating…</p>
      )}
    </div>
  )
}

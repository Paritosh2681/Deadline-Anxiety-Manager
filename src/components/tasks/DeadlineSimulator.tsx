'use client'

import { useState, useMemo, useCallback } from 'react'
import Slider from '@/components/ui/Slider'
import { SimulateResponse, PressureZone } from '@/types'
import { PRESSURE_COLORS } from '@/lib/constants'
import clsx from 'clsx'

interface DeadlineSimulatorProps {
  taskId: string
  daysRemaining: number
}

export default function DeadlineSimulator({ taskId, daysRemaining }: DeadlineSimulatorProps) {
  const [daysToSkip, setDaysToSkip] = useState(0)
  const [result, setResult] = useState<SimulateResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const maxSkip = Math.max(0, daysRemaining - 1)

  const simulate = useCallback(async (days: number) => {
    if (days === 0) {
      setResult(null)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/tasks/${taskId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daysToSkip: days }),
      })
      if (res.ok) {
        const data = await res.json()
        setResult(data)
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }, [taskId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setDaysToSkip(val)
    simulate(val)
  }

  const zoneColors = (zone: PressureZone) => PRESSURE_COLORS[zone]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
        What if I skip {daysToSkip} day{daysToSkip !== 1 ? 's' : ''}?
      </h3>

      <Slider
        min={0}
        max={maxSkip}
        value={daysToSkip}
        onChange={handleChange}
      />

      <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
        <span>No skip</span>
        <span>{maxSkip} days</span>
      </div>

      {result && (
        <div className={clsx(
          'p-4 rounded-[6px] border',
          result.simulatedZone === 'panic' && 'bg-panic-50 border-panic-200',
          result.simulatedZone === 'warning' && 'bg-warning-50 border-warning-200',
          result.simulatedZone === 'calm' && 'bg-calm-50 border-calm-200',
        )}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--color-text-secondary)]">Current</p>
              <p className="font-semibold text-[var(--color-text-primary)]">
                {result.currentScore}
              </p>
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)]">After skipping</p>
              <p className={clsx(
                'font-semibold',
                result.simulatedZone === 'panic' && 'text-panic-700',
                result.simulatedZone === 'warning' && 'text-warning-700',
                result.simulatedZone === 'calm' && 'text-calm-700',
              )}>
                {result.simulatedScore}
              </p>
            </div>
          </div>
          {result.dailyLoadIncrease > 0 && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-3">
              Daily workload increases by {result.dailyLoadIncrease}%
            </p>
          )}
        </div>
      )}

      {loading && (
        <p className="text-xs text-[var(--color-text-secondary)]">Calculating...</p>
      )}
    </div>
  )
}

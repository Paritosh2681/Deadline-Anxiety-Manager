import { EffortLevel, MicroTask } from '@/types'
import { differenceInDays } from 'date-fns'
import { MICROTASK_TEMPLATES } from './constants'

export function generateMicroTasks(
  taskName: string,
  effortLevel: EffortLevel,
  deadline: Date,
  now: Date = new Date()
): MicroTask[] {
  const templates = MICROTASK_TEMPLATES[effortLevel]
  const daysAvailable = Math.max(1, differenceInDays(deadline, now))

  return templates.map((template, index) => {
    const dayTarget = Math.ceil(((index + 1) / templates.length) * daysAvailable)
    return {
      id: crypto.randomUUID(),
      title: template.replace('{task}', taskName),
      isCompleted: false,
      completedAt: null,
      order: index,
      dayTarget,
    }
  })
}

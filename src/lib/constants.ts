import { EffortLevel } from '@/types'

export const EFFORT_WEIGHTS: Record<EffortLevel, number> = {
  easy: 25,
  medium: 50,
  hard: 80,
}

export const PRESSURE_THRESHOLDS = {
  warning: 35,
  panic: 65,
} as const

export const MICROTASK_TEMPLATES: Record<EffortLevel, string[]> = {
  easy: [
    'Understand what "{task}" requires',
    'Do the main work for "{task}"',
    'Review and finalize "{task}"',
  ],
  medium: [
    'Research requirements for "{task}"',
    'Plan approach for "{task}"',
    'Start initial work on "{task}"',
    'Continue core work on "{task}"',
    'Test and verify "{task}"',
    'Refine and clean up "{task}"',
    'Final review of "{task}"',
  ],
  hard: [
    'Research and gather resources for "{task}"',
    'Create detailed plan for "{task}"',
    'Set up foundations for "{task}"',
    'Begin first major section of "{task}"',
    'Complete first major section of "{task}"',
    'Begin second major section of "{task}"',
    'Complete second major section of "{task}"',
    'Integrate all sections of "{task}"',
    'Test thoroughly: "{task}"',
    'Iterate based on testing of "{task}"',
    'Polish and refine "{task}"',
    'Final review and submit "{task}"',
  ],
}

export const CONSEQUENCE_MESSAGES = {
  calm: [
    'You are on track. Steady progress wins.',
  ],
  warning: [
    'Pressure building. Today is a good day to make progress.',
    'The deadline is closer than it feels. Pick one micro-task now.',
    'Future you will thank present you. Open a micro-task.',
  ],
  panic: [
    'This is due very soon. Stop scrolling, start doing.',
    'Every hour counts now. What is the smallest step you can take?',
    'The deadline will not move. But you can.',
  ],
} as const

export const KEYBOARD_SHORTCUTS = {
  n: { action: 'new-task' as const, description: 'Create new task' },
  d: { action: 'dashboard' as const, description: 'Go to dashboard' },
  i: { action: 'insights' as const, description: 'Go to insights' },
  '?': { action: 'help' as const, description: 'Show shortcuts' },
  Escape: { action: 'close' as const, description: 'Close modal/panel' },
} as const

export const PRESSURE_COLORS = {
  calm: {
    bg: 'bg-calm-50',
    border: 'border-calm-200',
    text: 'text-calm-700',
    accent: '#22c55e',
    badgeBg: 'bg-calm-100',
  },
  warning: {
    bg: 'bg-warning-50',
    border: 'border-warning-200',
    text: 'text-warning-700',
    accent: '#f59e0b',
    badgeBg: 'bg-warning-100',
  },
  panic: {
    bg: 'bg-panic-50',
    border: 'border-panic-200',
    text: 'text-panic-700',
    accent: '#ef4444',
    badgeBg: 'bg-panic-100',
  },
} as const

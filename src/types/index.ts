export type EffortLevel = 'easy' | 'medium' | 'hard'

export type PressureZone = 'calm' | 'warning' | 'panic'

export type TaskStatus = 'active' | 'completed' | 'overdue'

export interface MicroTask {
  id: string
  title: string
  isCompleted: boolean
  completedAt: Date | null
  order: number
  dayTarget: number
}

export interface PressureSnapshot {
  date: Date
  score: number
  zone: PressureZone
}

export interface Task {
  _id: string
  name: string
  deadline: string
  effortLevel: EffortLevel
  pressureScore: number
  pressureZone: PressureZone
  microTasks: MicroTask[]
  isCompleted: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
  originalDeadline: string
  rescheduleCount: number
  lastRescheduledAt: string | null
  pressureHistory: PressureSnapshot[]
}

export interface CreateTaskPayload {
  name: string
  deadline: string
  effortLevel: EffortLevel
}

export interface SimulatePayload {
  daysToSkip: number
}

export interface SimulateResponse {
  currentScore: number
  currentZone: PressureZone
  simulatedScore: number
  simulatedZone: PressureZone
  dailyLoadIncrease: number
}

export interface CompletePayload {
  microTaskId: string
}

export interface PressureGroupedTasks {
  panic: Task[]
  warning: Task[]
  calm: Task[]
}

export type BehaviorEvent =
  | 'task_created'
  | 'task_completed'
  | 'microtask_completed'
  | 'deadline_missed'
  | 'task_rescheduled'
  | 'simulator_used'

export interface UserBehavior {
  _id: string
  event: BehaviorEvent
  taskId: string
  timestamp: string
  metadata: Record<string, unknown>
}

export interface Insight {
  type: 'pattern' | 'stat' | 'suggestion'
  title: string
  description: string
  value?: string | number
}

export interface TimelineDataPoint {
  date: string
  averagePressure: number
  taskCount: number
  completedCount: number
}

export interface DashboardStats {
  totalActive: number
  totalCompleted: number
  totalOverdue: number
  averagePressure: number
}

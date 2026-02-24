export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { TaskModel } from '@/lib/db/models/Task'
import { UserBehaviorModel } from '@/lib/db/models/UserBehavior'
import { Insight } from '@/types'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUser(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const [allTasks, completedTasks, behaviors] = await Promise.all([
      TaskModel.find({ userId }).lean(),
      TaskModel.find({ userId, isCompleted: true }).lean(),
      UserBehaviorModel.find({ userId }).sort({ timestamp: -1 }).limit(500).lean(),
    ])

    const insights: Insight[] = []

    // Completion rate
    const totalTasks = allTasks.length
    const completedCount = completedTasks.length
    if (totalTasks > 0) {
      const rate = Math.round((completedCount / totalTasks) * 100)
      insights.push({
        type: 'stat',
        title: 'Completion Rate',
        description: `${rate}% of tasks completed (${completedCount}/${totalTasks})`,
        value: rate,
      })
    }

    // Average pressure
    const activeTasks = (allTasks as any[]).filter((t) => !t.isCompleted)
    if (activeTasks.length > 0) {
      const avgPressure = Math.round(
        activeTasks.reduce((sum: number, t: any) => sum + (t.pressureScore || 0), 0) / activeTasks.length
      )
      insights.push({
        type: 'stat',
        title: 'Average Pressure',
        description: `Current average pressure across active tasks is ${avgPressure}`,
        value: avgPressure,
      })
    }

    // Most common effort level
    const effortCounts: Record<string, number> = { easy: 0, medium: 0, hard: 0 }
      ; (allTasks as any[]).forEach((t) => {
        if (t.effortLevel) effortCounts[t.effortLevel]++
      })
    const mostCommon = Object.entries(effortCounts).sort((a, b) => b[1] - a[1])[0]
    if (mostCommon && mostCommon[1] > 0) {
      insights.push({
        type: 'pattern',
        title: 'Preferred Effort Level',
        description: `You most often create "${mostCommon[0]}" tasks (${mostCommon[1]} times)`,
        value: mostCommon[0],
      })
    }

    // Reschedule pattern
    const rescheduledTasks = (allTasks as any[]).filter((t) => t.rescheduleCount > 0)
    if (totalTasks > 0) {
      const rescheduleRate = Math.round((rescheduledTasks.length / totalTasks) * 100)
      if (rescheduleRate > 30) {
        insights.push({
          type: 'suggestion',
          title: 'Frequent Rescheduling',
          description: `${rescheduleRate}% of tasks have been rescheduled. Consider adding buffer time to deadlines.`,
          value: rescheduleRate,
        })
      }
    }

    // Completion time pattern
    const completionBehaviors = (behaviors as any[]).filter(
      (b) => b.event === 'microtask_completed' && b.metadata?.isCompleted
    )
    if (completionBehaviors.length >= 5) {
      const hours = completionBehaviors.map(
        (b: any) => new Date(b.timestamp).getHours()
      )
      const eveningCount = hours.filter((h: number) => h >= 21 || h < 5).length
      const morningCount = hours.filter(
        (h: number) => h >= 5 && h < 10
      ).length

      if (eveningCount / hours.length > 0.5) {
        insights.push({
          type: 'pattern',
          title: 'Night Owl',
          description: 'You tend to complete most tasks in the evening or at night.',
        })
      } else if (morningCount / hours.length > 0.5) {
        insights.push({
          type: 'pattern',
          title: 'Early Bird',
          description: 'You tend to complete most tasks in the morning.',
        })
      }
    }

    return NextResponse.json(insights)
  } catch (error) {
    console.error('GET /api/insights error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}

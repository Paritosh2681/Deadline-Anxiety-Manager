export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { TaskModel } from '@/lib/db/models/Task'
import { UserBehaviorModel } from '@/lib/db/models/UserBehavior'
import { recalculatePressure } from '@/lib/pressure'

export async function POST() {
  try {
    await connectDB()

    const activeTasks = await TaskModel.find({ isCompleted: false })

    let tasksUpdated = 0
    let deadlinesMissed = 0

    for (const task of activeTasks) {
      const previousZone = task.pressureZone
      const { pressureScore, pressureZone } = recalculatePressure(task)

      task.pressureScore = pressureScore
      task.pressureZone = pressureZone

      // Append to pressure history (one entry per day)
      task.pressureHistory.push({
        date: new Date(),
        score: pressureScore,
        zone: pressureZone,
      })

      // Check for newly overdue tasks
      const isOverdue = new Date(task.deadline) < new Date() && !task.isCompleted
      if (isOverdue && previousZone !== 'panic') {
        deadlinesMissed++
        await UserBehaviorModel.create({
          event: 'deadline_missed',
          taskId: task._id,
          metadata: { pressureScore, deadline: task.deadline },
        })
      }

      await task.save()
      tasksUpdated++
    }

    return NextResponse.json({
      tasksUpdated,
      deadlinesMissed,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('POST /api/cron error:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}

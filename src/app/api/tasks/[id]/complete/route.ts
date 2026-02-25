export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { TaskModel } from '@/lib/db/models/Task'
import { UserBehaviorModel } from '@/lib/db/models/UserBehavior'
import { recalculatePressure } from '@/lib/pressure'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthUser(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { microTaskId } = body

    if (!microTaskId) {
      return NextResponse.json(
        { error: 'microTaskId is required' },
        { status: 400 }
      )
    }

    const task = await TaskModel.findOne({ _id: params.id, userId })
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const microTask = task.microTasks.find((mt: any) => mt.id === microTaskId)
    if (!microTask) {
      return NextResponse.json(
        { error: 'Micro-task not found' },
        { status: 404 }
      )
    }

    // Toggle completion
    microTask.isCompleted = !microTask.isCompleted
    microTask.completedAt = microTask.isCompleted ? new Date() : null

    // Recalculate pressure
    const { pressureScore, pressureZone } = recalculatePressure(task)
    task.pressureScore = pressureScore
    task.pressureZone = pressureZone

    // Check if all micro-tasks are completed
    const allCompleted = task.microTasks.every((mt: any) => mt.isCompleted)
    if (allCompleted && task.microTasks.length > 0) {
      task.isCompleted = true
      task.completedAt = new Date()

      await UserBehaviorModel.create({
        event: 'task_completed',
        taskId: task._id,
        userId,
        metadata: { pressureScore, totalMicroTasks: task.microTasks.length },
      })
    } else {
      task.isCompleted = false
      task.completedAt = null
    }

    await UserBehaviorModel.create({
      event: 'microtask_completed',
      taskId: task._id,
      userId,
      metadata: {
        microTaskId,
        isCompleted: microTask.isCompleted,
        pressureScore,
      },
    })

    await task.save()

    return NextResponse.json(task)
  } catch (error) {
    console.error('PATCH /api/tasks/[id]/complete error:', error)
    return NextResponse.json(
      { error: 'Failed to update micro-task' },
      { status: 500 }
    )
  }
}

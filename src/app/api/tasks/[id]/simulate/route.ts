import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { TaskModel } from '@/lib/db/models/Task'
import { UserBehaviorModel } from '@/lib/db/models/UserBehavior'
import { calculatePressureScore, getPressureZone } from '@/lib/pressure'
import { EffortLevel } from '@/types'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const body = await request.json()
    const { daysToSkip } = body

    if (daysToSkip === undefined || typeof daysToSkip !== 'number' || daysToSkip < 0) {
      return NextResponse.json(
        { error: 'daysToSkip must be a non-negative number' },
        { status: 400 }
      )
    }

    const task = await TaskModel.findById(params.id).lean()
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const taskData = task as any
    const completed = taskData.microTasks.filter((mt: any) => mt.isCompleted).length
    const total = taskData.microTasks.length

    // Current pressure
    const currentScore = calculatePressureScore(
      taskData.effortLevel as EffortLevel,
      new Date(taskData.deadline),
      completed,
      total
    )
    const currentZone = getPressureZone(currentScore)

    // Simulated pressure: pretend N days pass with no progress
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + daysToSkip)
    const simulatedScore = calculatePressureScore(
      taskData.effortLevel as EffortLevel,
      new Date(taskData.deadline),
      completed,
      total,
      futureDate
    )
    const simulatedZone = getPressureZone(simulatedScore)

    // Calculate daily load increase
    const dailyLoadIncrease = currentScore > 0
      ? Math.round(((simulatedScore - currentScore) / currentScore) * 100)
      : simulatedScore > 0 ? 100 : 0

    await UserBehaviorModel.create({
      event: 'simulator_used',
      taskId: taskData._id,
      metadata: { daysToSkip, currentScore, simulatedScore },
    })

    return NextResponse.json({
      currentScore,
      currentZone,
      simulatedScore,
      simulatedZone,
      dailyLoadIncrease,
    })
  } catch (error) {
    console.error('POST /api/tasks/[id]/simulate error:', error)
    return NextResponse.json(
      { error: 'Failed to simulate pressure' },
      { status: 500 }
    )
  }
}

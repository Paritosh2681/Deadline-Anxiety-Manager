import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { TaskModel } from '@/lib/db/models/Task'
import { generateMicroTasks } from '@/lib/microtasks'
import { recalculatePressure } from '@/lib/pressure'
import { UserBehaviorModel } from '@/lib/db/models/UserBehavior'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'

    let filter: Record<string, unknown> = {}
    if (status === 'active') {
      filter = { isCompleted: false }
    } else if (status === 'completed') {
      filter = { isCompleted: true }
    }

    const tasks = await TaskModel.find(filter)
      .sort({ pressureScore: -1 })
      .lean()

    // Recalculate pressure scores on read
    const now = new Date()
    const updated = tasks.map((task: any) => {
      const { pressureScore, pressureZone } = recalculatePressure(task)
      return { ...task, pressureScore, pressureZone }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('GET /api/tasks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, deadline, effortLevel } = body

    if (!name || !deadline || !effortLevel) {
      return NextResponse.json(
        { error: 'name, deadline, and effortLevel are required' },
        { status: 400 }
      )
    }

    if (!['easy', 'medium', 'hard'].includes(effortLevel)) {
      return NextResponse.json(
        { error: 'effortLevel must be easy, medium, or hard' },
        { status: 400 }
      )
    }

    const deadlineDate = new Date(deadline)
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid deadline date' },
        { status: 400 }
      )
    }

    const microTasks = generateMicroTasks(name, effortLevel, deadlineDate)
    const { pressureScore, pressureZone } = recalculatePressure({
      effortLevel,
      deadline: deadlineDate,
      microTasks,
    })

    const task = await TaskModel.create({
      name: name.trim(),
      deadline: deadlineDate,
      effortLevel,
      microTasks,
      pressureScore,
      pressureZone,
      pressureHistory: [{
        date: new Date(),
        score: pressureScore,
        zone: pressureZone,
      }],
    })

    await UserBehaviorModel.create({
      event: 'task_created',
      taskId: task._id,
      metadata: { effortLevel, pressureScore },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('POST /api/tasks error:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

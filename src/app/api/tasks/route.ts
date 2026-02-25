export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { TaskModel } from '@/lib/db/models/Task'
import { recalculatePressure } from '@/lib/pressure'
import { UserBehaviorModel } from '@/lib/db/models/UserBehavior'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUser(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'

    let filter: Record<string, unknown> = { userId }
    if (status === 'active') {
      filter = { userId, isCompleted: false }
    } else if (status === 'completed') {
      filter = { userId, isCompleted: true }
    }

    const tasks = await TaskModel.find(filter)
      .sort({ pressureScore: -1 })
      .lean()

    // Recalculate pressure scores on read
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
    const userId = await getAuthUser(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { name, deadline, effortLevel, microTasks: microTaskTitles, reminderTime } = body

    if (!name || !deadline || !effortLevel) {
      return NextResponse.json(
        { error: 'name, deadline, and effortLevel are required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(microTaskTitles) || microTaskTitles.length === 0) {
      return NextResponse.json(
        { error: 'At least one micro-task is required' },
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

    const { differenceInDays } = await import('date-fns')
    const daysAvailable = Math.max(1, differenceInDays(deadlineDate, new Date()))

    const microTasks = microTaskTitles
      .filter((t: string) => typeof t === 'string' && t.trim())
      .map((title: string, index: number) => ({
        id: crypto.randomUUID(),
        title: title.trim(),
        isCompleted: false,
        completedAt: null,
        order: index,
        dayTarget: Math.ceil(((index + 1) / microTaskTitles.length) * daysAvailable),
      }))
    const { pressureScore, pressureZone } = recalculatePressure({
      effortLevel,
      deadline: deadlineDate,
      microTasks,
    })

    const task = await TaskModel.create({
      userId,
      name: name.trim(),
      deadline: deadlineDate,
      effortLevel,
      microTasks,
      pressureScore,
      pressureZone,
      reminderTime: reminderTime || null,
      pressureHistory: [{
        date: new Date(),
        score: pressureScore,
        zone: pressureZone,
      }],
    })

    await UserBehaviorModel.create({
      event: 'task_created',
      taskId: task._id,
      userId,
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

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { TaskModel } from '@/lib/db/models/Task'
import { recalculatePressure } from '@/lib/pressure'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthUser(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const task = await TaskModel.findOne({ _id: params.id, userId })
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const previousScore = task.pressureScore
    const previousZone = task.pressureZone

    const { pressureScore, pressureZone } = recalculatePressure(task)
    task.pressureScore = pressureScore
    task.pressureZone = pressureZone

    // Append to pressure history
    task.pressureHistory.push({
      date: new Date(),
      score: pressureScore,
      zone: pressureZone,
    })

    await task.save()

    return NextResponse.json({
      score: pressureScore,
      zone: pressureZone,
      previousScore,
      previousZone,
    })
  } catch (error) {
    console.error('GET /api/tasks/[id]/pressure error:', error)
    return NextResponse.json(
      { error: 'Failed to recalculate pressure' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { TaskModel } from '@/lib/db/models/Task'
import { recalculatePressure } from '@/lib/pressure'
import { generateMicroTasks } from '@/lib/microtasks'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const task = await TaskModel.findById(params.id).lean()

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const { pressureScore, pressureZone } = recalculatePressure(task as any)

    return NextResponse.json({ ...task, pressureScore, pressureZone })
  } catch (error) {
    console.error('GET /api/tasks/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const body = await request.json()
    const task = await TaskModel.findById(params.id)

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (body.name !== undefined) task.name = body.name.trim()
    if (body.effortLevel !== undefined) task.effortLevel = body.effortLevel

    if (body.deadline !== undefined) {
      const newDeadline = new Date(body.deadline)
      if (isNaN(newDeadline.getTime())) {
        return NextResponse.json({ error: 'Invalid deadline' }, { status: 400 })
      }
      task.deadline = newDeadline

      // Regenerate micro-tasks preserving completed ones
      const completedIds = new Set(
        task.microTasks
          .filter((mt: any) => mt.isCompleted)
          .map((mt: any) => mt.id)
      )
      const newMicros = generateMicroTasks(task.name, task.effortLevel, newDeadline)
      // Keep completed micro-tasks, replace incomplete ones
      const preserved = task.microTasks.filter((mt: any) => mt.isCompleted)
      const remaining = newMicros.slice(preserved.length)
      task.microTasks = [...preserved, ...remaining]

      task.rescheduleCount += 1
      task.lastRescheduledAt = new Date()
    }

    const { pressureScore, pressureZone } = recalculatePressure(task)
    task.pressureScore = pressureScore
    task.pressureZone = pressureZone

    await task.save()

    return NextResponse.json(task)
  } catch (error) {
    console.error('PUT /api/tasks/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const task = await TaskModel.findByIdAndDelete(params.id)

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/tasks/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}

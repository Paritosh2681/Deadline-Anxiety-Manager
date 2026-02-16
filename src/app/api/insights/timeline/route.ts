export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { TaskModel } from '@/lib/db/models/Task'
import { TimelineDataPoint } from '@/types'
import { subDays, format, startOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30', 10)
    const startDate = subDays(new Date(), days)

    const tasks = await TaskModel.find({
      'pressureHistory.date': { $gte: startDate },
    }).lean()

    // Build daily timeline
    const dailyData: Record<string, { scores: number[]; taskCount: number; completedCount: number }> = {}

    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd')
      dailyData[date] = { scores: [], taskCount: 0, completedCount: 0 }
    }

    ;(tasks as any[]).forEach((task) => {
      task.pressureHistory?.forEach((snapshot: any) => {
        const date = format(new Date(snapshot.date), 'yyyy-MM-dd')
        if (dailyData[date]) {
          dailyData[date].scores.push(snapshot.score)
          dailyData[date].taskCount++
        }
      })

      // Count completions
      task.microTasks?.forEach((mt: any) => {
        if (mt.isCompleted && mt.completedAt) {
          const date = format(new Date(mt.completedAt), 'yyyy-MM-dd')
          if (dailyData[date]) {
            dailyData[date].completedCount++
          }
        }
      })
    })

    const timeline: TimelineDataPoint[] = Object.entries(dailyData).map(
      ([date, data]) => ({
        date,
        averagePressure: data.scores.length > 0
          ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
          : 0,
        taskCount: data.taskCount,
        completedCount: data.completedCount,
      })
    )

    return NextResponse.json(timeline)
  } catch (error) {
    console.error('GET /api/insights/timeline error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    )
  }
}

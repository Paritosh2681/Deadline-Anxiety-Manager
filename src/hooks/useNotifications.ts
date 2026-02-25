'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useTaskContext } from '@/context/TaskContext'

const NOTIFIED_TASKS_KEY = 'dam-notified-tasks'

/** Get today's date as YYYY-MM-DD */
function todayKey(): string {
    return new Date().toISOString().split('T')[0]
}

/** Get set of task IDs already notified today */
function getNotifiedToday(): Set<string> {
    try {
        const raw = localStorage.getItem(NOTIFIED_TASKS_KEY)
        if (!raw) return new Set()
        const parsed = JSON.parse(raw)
        if (parsed.date !== todayKey()) {
            localStorage.removeItem(NOTIFIED_TASKS_KEY)
            return new Set()
        }
        return new Set(parsed.ids || [])
    } catch {
        return new Set()
    }
}

/** Mark a task ID as notified today */
function markNotified(taskId: string) {
    try {
        const notified = getNotifiedToday()
        notified.add(taskId)
        localStorage.setItem(NOTIFIED_TASKS_KEY, JSON.stringify({
            date: todayKey(),
            ids: Array.from(notified),
        }))
    } catch { }
}

function getTimeUntilDeadline(deadline: string): string {
    const diff = new Date(deadline).getTime() - Date.now()
    if (diff < 0) return 'overdue!'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ${hours % 24}h left`
    return `${hours}h left`
}

function showTaskNotification(task: { _id: string; name: string; deadline: string; pressureZone: string }) {
    const icon = task.pressureZone === 'panic' ? '🔴' : task.pressureZone === 'warning' ? '🟡' : '🟢'
    const time = getTimeUntilDeadline(task.deadline)
    const title = `${icon} Reminder: ${task.name}`
    const body = `⏰ ${time}\nDon't let this deadline sneak up on you!`

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, {
                body,
                icon: '/icons/icon-192.svg',
                badge: '/icons/icon-192.svg',
                tag: `dam-reminder-${task._id}`,
                data: { url: '/dashboard' },
            })
        })
    } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/icons/icon-192.svg',
            tag: `dam-reminder-${task._id}`,
        })
    }

    markNotified(task._id)
}

export function useNotifications() {
    const { activeTasks, isLoading } = useTaskContext()
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const checkAndNotify = useCallback(() => {
        if (!('Notification' in window) || Notification.permission !== 'granted') return
        if (!activeTasks.length) return

        const now = new Date()
        const currentHH = String(now.getHours()).padStart(2, '0')
        const currentMM = String(now.getMinutes()).padStart(2, '0')
        const currentTime = `${currentHH}:${currentMM}`

        const notifiedToday = getNotifiedToday()

        activeTasks.forEach(task => {
            if (!task.reminderTime || task.isCompleted) return
            if (notifiedToday.has(task._id)) return

            // Check if current time matches reminder time (within 1 minute window)
            const [rHH, rMM] = task.reminderTime.split(':').map(Number)
            const [cHH, cMM] = currentTime.split(':').map(Number)
            const reminderMinutes = rHH * 60 + rMM
            const currentMinutes = cHH * 60 + cMM

            if (currentMinutes >= reminderMinutes && currentMinutes <= reminderMinutes + 1) {
                showTaskNotification(task)
            }
        })
    }, [activeTasks])

    useEffect(() => {
        if (isLoading) return

        // Request permission on mount
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission()
        }

        // Check immediately on load
        const initialTimeout = setTimeout(checkAndNotify, 2000)

        // Check every minute for scheduled reminders
        intervalRef.current = setInterval(checkAndNotify, 60 * 1000)

        return () => {
            clearTimeout(initialTimeout)
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [checkAndNotify, isLoading])
}

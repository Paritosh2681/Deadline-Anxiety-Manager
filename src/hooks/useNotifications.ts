'use client'

import { useEffect, useRef } from 'react'
import { useTaskContext } from '@/context/TaskContext'

const NOTIFICATION_INTERVAL = 6 * 60 * 60 * 1000 // 6 hours
const LAST_NOTIFIED_KEY = 'dam-last-notification'
const MIN_GAP = 5 * 60 * 60 * 1000 // 5 hours minimum between notifications

function getTimeUntilDeadline(deadline: string): string {
    const diff = new Date(deadline).getTime() - Date.now()
    if (diff < 0) return 'overdue!'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ${hours % 24}h left`
    return `${hours}h left`
}

function buildNotificationBody(tasks: { name: string; deadline: string; pressureZone: string }[]): string {
    if (tasks.length === 0) return ''

    const lines = tasks.slice(0, 4).map(t => {
        const time = getTimeUntilDeadline(t.deadline)
        const icon = t.pressureZone === 'panic' ? '🔴' : t.pressureZone === 'warning' ? '🟡' : '🟢'
        return `${icon} ${t.name} — ${time}`
    })

    if (tasks.length > 4) {
        lines.push(`...and ${tasks.length - 4} more`)
    }

    return lines.join('\n')
}

function shouldNotify(): boolean {
    try {
        const last = localStorage.getItem(LAST_NOTIFIED_KEY)
        if (!last) return true
        return Date.now() - parseInt(last, 10) >= MIN_GAP
    } catch {
        return true
    }
}

function markNotified() {
    try {
        localStorage.setItem(LAST_NOTIFIED_KEY, Date.now().toString())
    } catch { }
}

export function useNotifications() {
    const { activeTasks, isLoading } = useTaskContext()
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (isLoading || !activeTasks.length) return

        // Request permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission()
        }

        function sendNotification() {
            if (
                !('Notification' in window) ||
                Notification.permission !== 'granted' ||
                !shouldNotify()
            ) return

            const upcomingTasks = activeTasks
                .filter(t => !t.isCompleted && t.deadline)
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

            if (upcomingTasks.length === 0) return

            const panicCount = upcomingTasks.filter(t => t.pressureZone === 'panic').length
            const title = panicCount > 0
                ? `🔥 ${panicCount} urgent task${panicCount > 1 ? 's' : ''} — ${upcomingTasks.length} total`
                : `📋 ${upcomingTasks.length} task${upcomingTasks.length > 1 ? 's' : ''} with deadlines`

            const body = buildNotificationBody(upcomingTasks)

            // Use service worker notification if available (persists)
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification(title, {
                        body,
                        icon: '/icons/icon-192.svg',
                        badge: '/icons/icon-192.svg',
                        tag: 'dam-task-reminder',
                        data: { url: '/dashboard' },
                    })
                })
            } else {
                // Fallback to regular notification
                new Notification(title, {
                    body,
                    icon: '/icons/icon-192.svg',
                    tag: 'dam-task-reminder',
                })
            }

            markNotified()
        }

        // Small delay before first check to let the page settle
        const initialTimeout = setTimeout(sendNotification, 3000)

        // Schedule periodic checks (every 6 hours)
        intervalRef.current = setInterval(sendNotification, NOTIFICATION_INTERVAL)

        return () => {
            clearTimeout(initialTimeout)
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [activeTasks, isLoading])
}

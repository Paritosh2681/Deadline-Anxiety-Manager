'use client'

import useSWR, { mutate as globalMutate } from 'swr'
import { Task, CreateTaskPayload } from '@/types'
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage'

const TASKS_KEY = '/api/tasks'
const STORAGE_KEY = 'dam-tasks'

const fetcher = async (url: string): Promise<Task[]> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  const data = await res.json()
  setLocalStorage(STORAGE_KEY, data)
  return data
}

export function useTasks(status: 'active' | 'completed' | 'all' = 'active') {
  const url = `${TASKS_KEY}?status=${status}`

  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    url,
    fetcher,
    {
      fallbackData: getLocalStorage<Task[]>(STORAGE_KEY, []),
      revalidateOnFocus: true,
      refreshInterval: 60000,
    }
  )

  return {
    tasks: data || [],
    isLoading,
    error,
    mutate,
  }
}

export function useTask(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Task>(
    id ? `/api/tasks/${id}` : null,
    async (url: string) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch task')
      return res.json()
    }
  )

  return {
    task: data || null,
    isLoading,
    error,
    mutate,
  }
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const res = await fetch(TASKS_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to create task')
  }
  const task = await res.json()
  globalMutate((key: string) => typeof key === 'string' && key.startsWith(TASKS_KEY))
  return task
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete task')
  // Clear the deleted task's individual cache without revalidating (it no longer exists)
  await globalMutate(`/api/tasks/${id}`, undefined, { revalidate: false })
  // Revalidate all task list caches so the dashboard updates regardless of active filter
  await globalMutate((key: string) => typeof key === 'string' && key.startsWith(TASKS_KEY))
}

export async function completeMicroTask(
  taskId: string,
  microTaskId: string
): Promise<Task> {
  const res = await fetch(`/api/tasks/${taskId}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ microTaskId }),
  })
  if (!res.ok) throw new Error('Failed to update micro-task')
  const task = await res.json()
  globalMutate((key: string) => typeof key === 'string' && key.startsWith(TASKS_KEY))
  return task
}

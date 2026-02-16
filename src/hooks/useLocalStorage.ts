'use client'

import { useState, useEffect, useCallback } from 'react'
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage'

export function useLocalStorage<T>(key: string, fallback: T): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => getLocalStorage(key, fallback))

  useEffect(() => {
    setStored(getLocalStorage(key, fallback))
  }, [key, fallback])

  const setValue = useCallback(
    (value: T) => {
      setStored(value)
      setLocalStorage(key, value)
    },
    [key]
  )

  return [stored, setValue]
}

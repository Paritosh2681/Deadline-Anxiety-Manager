'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface ShortcutActions {
  onNewTask?: () => void
  onToggleHelp?: () => void
  onCloseModal?: () => void
}

export function useKeyboardShortcuts(actions?: ShortcutActions) {
  const router = useRouter()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const tagName = target.tagName.toLowerCase()

      // Don't trigger shortcuts when typing in inputs
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return
      }

      // Don't trigger on modifier combos (Ctrl+C, etc)
      if (e.ctrlKey || e.metaKey || e.altKey) return

      switch (e.key) {
        case 'n':
          e.preventDefault()
          actions?.onNewTask?.() ?? router.push('/tasks/new')
          break
        case 'd':
          e.preventDefault()
          router.push('/dashboard')
          break
        case 'i':
          e.preventDefault()
          router.push('/insights')
          break
        case '?':
          e.preventDefault()
          actions?.onToggleHelp?.()
          break
        case 'Escape':
          actions?.onCloseModal?.()
          break
      }
    },
    [router, actions]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

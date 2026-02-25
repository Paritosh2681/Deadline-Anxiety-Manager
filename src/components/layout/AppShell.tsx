'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import { TaskProvider } from '@/context/TaskContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import Modal from '@/components/ui/Modal'
import { KEYBOARD_SHORTCUTS } from '@/lib/constants'
import { useNotifications } from '@/hooks/useNotifications'

import { AuthProvider } from '@/context/AuthContext'

function ShortcutsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts">
      <div className="space-y-2">
        {Object.entries(KEYBOARD_SHORTCUTS).map(([key, { description }]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">{description}</span>
            <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 rounded-[6px] dark:bg-gray-800 text-[var(--color-text-primary)]">
              {key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  )
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [showShortcuts, setShowShortcuts] = useState(false)

  useKeyboardShortcuts({
    onToggleHelp: () => setShowShortcuts((prev) => !prev),
    onCloseModal: () => setShowShortcuts(false),
  })

  useNotifications()

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-secondary)]">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-16 md:pb-0">
        {children}
      </main>
      <MobileNav />
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  )
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TaskProvider>
          <AppShellInner>{children}</AppShellInner>
        </TaskProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

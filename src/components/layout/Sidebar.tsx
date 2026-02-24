'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useTheme } from '@/context/ThemeContext'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tasks/new', label: 'New Task' },
  { href: '/insights', label: 'Insights' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <aside className="hidden md:flex md:flex-col md:w-56 bg-[var(--color-surface)] border-r border-[var(--color-border)] min-h-screen">
      <div className="px-5 py-5 border-b border-[var(--color-border)]">
        <h1 className="text-base font-semibold text-[var(--color-text-primary)]">
          DAM
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
          Deadline Anxiety Manager
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'block px-3 py-2 text-sm rounded-[6px] transition-colors',
                isActive
                  ? 'bg-gray-100 text-[var(--color-text-primary)] font-semibold dark:bg-gray-800'
                  : 'text-[var(--color-text-secondary)] hover:bg-gray-50 hover:text-[var(--color-text-primary)] dark:hover:bg-gray-800'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--color-border)] space-y-3">
        <button
          onClick={toggleTheme}
          className="w-full px-3 py-2 text-sm text-left text-[var(--color-text-secondary)] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-[6px] transition-colors"
        >
          {resolvedTheme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
        <p className="px-3 text-xs text-[var(--color-text-secondary)]">
          Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 rounded dark:bg-gray-800">?</kbd> for shortcuts
        </p>
      </div>
    </aside>
  )
}

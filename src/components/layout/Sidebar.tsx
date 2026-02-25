'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tasks/new', label: 'New Task' },
  { href: '/insights', label: 'Insights' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { resolvedTheme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <aside className="hidden md:flex md:flex-col md:w-56 bg-[var(--color-surface)] border-r border-[var(--color-border)] min-h-screen">
      <Link href="/" className="block px-5 py-5 border-b border-[var(--color-border)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <h1 className="text-base font-semibold text-[var(--color-text-primary)]">
          ⏰ DAM
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
          Deadline Anxiety Manager
        </p>
      </Link>

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
        {user && (
          <div className="px-3 pb-2">
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {user.name}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              {user.email}
            </p>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className="w-full px-3 py-2 text-sm text-left text-[var(--color-text-secondary)] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-[6px] transition-colors"
        >
          {resolvedTheme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
        <button
          onClick={logout}
          className="w-full px-3 py-2 text-sm text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[6px] transition-colors"
        >
          Log out
        </button>
        <p className="px-3 text-xs text-[var(--color-text-secondary)]">
          Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 rounded dark:bg-gray-800">?</kbd> for shortcuts
        </p>
      </div>
    </aside>
  )
}

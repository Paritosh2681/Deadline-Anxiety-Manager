'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, Plus, BarChart2, Sun, Moon, LogOut, Timer } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks/new', label: 'New Task', icon: Plus },
  { href: '/insights', label: 'Insights', icon: BarChart2 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { resolvedTheme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <aside className="hidden md:flex md:flex-col md:w-52 bg-[var(--color-surface)] border-r border-[var(--color-border)] min-h-screen sticky top-0 h-screen">
      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-2.5 px-5 py-5 border-b border-[var(--color-border)] hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
      >
        <div className="flex items-center justify-center w-7 h-7 bg-zinc-900 dark:bg-zinc-100 rounded-lg shrink-0 group-hover:bg-zinc-800 dark:group-hover:bg-white transition-colors">
          <Timer size={14} className="text-white dark:text-zinc-900" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight leading-none font-display">
            DAM
          </h1>
          <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5 leading-none">
            Deadline Anxiety Manager
          </p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/tasks/new' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl transition-all duration-150',
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-subtle'
                  : 'text-[var(--color-text-secondary)] hover:bg-zinc-100 hover:text-[var(--color-text-primary)] dark:hover:bg-zinc-800'
              )}
            >
              <Icon
                size={16}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'opacity-100' : 'opacity-60'}
              />
              <span className="tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[var(--color-border)] space-y-1">
        {user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-[0.8rem] font-semibold text-[var(--color-text-primary)] truncate tracking-tight">
              {user.name}
            </p>
            <p className="text-[0.7rem] text-[var(--color-text-tertiary)] truncate mt-0.5">
              {user.email}
            </p>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[var(--color-text-primary)] rounded-xl transition-colors"
        >
          {resolvedTheme === 'light'
            ? <Moon size={15} strokeWidth={2} className="opacity-60" />
            : <Sun size={15} strokeWidth={2} className="opacity-60" />
          }
          <span className="tracking-tight text-sm">
            {resolvedTheme === 'light' ? 'Dark mode' : 'Light mode'}
          </span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <LogOut size={15} strokeWidth={2} className="opacity-70" />
          <span className="tracking-tight">Log out</span>
        </button>

        <p className="px-3 pt-1 text-[10px] text-[var(--color-text-tertiary)]">
          Press{' '}
          <kbd className="px-1.5 py-0.5 text-[10px] bg-zinc-100 dark:bg-zinc-800 rounded-md font-mono border border-zinc-200 dark:border-zinc-700">?</kbd>
          {' '}for shortcuts
        </p>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, Plus, BarChart2, LogOut } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/tasks/new', label: 'New', icon: Plus },
  { href: '/insights', label: 'Insights', icon: BarChart2 },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40">
      <div className="flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-float px-2 py-2 gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/tasks/new' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-150',
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-[var(--color-text-secondary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[var(--color-text-primary)]'
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
            </Link>
          )
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="Log out"
        >
          <LogOut size={18} strokeWidth={2} />
          <span className="text-[10px] font-semibold tracking-tight">Out</span>
        </button>
      </div>
    </nav>
  )
}

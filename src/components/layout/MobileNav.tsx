'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tasks/new', label: 'New' },
  { href: '/insights', label: 'Insights' },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
      <div className="flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex-1 py-3 text-center text-xs transition-colors',
                isActive
                  ? 'text-[var(--color-text-primary)] font-semibold'
                  : 'text-[var(--color-text-secondary)]'
              )}
            >
              {item.label}
            </Link>
          )
        })}
        <button
          onClick={logout}
          className="flex-1 py-3 text-center text-xs text-red-500 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

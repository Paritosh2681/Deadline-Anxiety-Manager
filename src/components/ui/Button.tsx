import { ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-zinc-900 text-white border border-zinc-900',
    'hover:bg-zinc-800 hover:-translate-y-0.5',
    'shadow-sm hover:shadow-md',
    'dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 dark:hover:bg-white',
  ].join(' '),
  secondary: [
    'bg-white text-zinc-800 border border-zinc-200',
    'hover:bg-zinc-50 hover:border-zinc-300 hover:-translate-y-0.5',
    'shadow-subtle hover:shadow-card',
    'dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700',
  ].join(' '),
  ghost: [
    'bg-transparent text-zinc-500 border border-transparent',
    'hover:bg-zinc-100 hover:text-zinc-800',
    'dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
  ].join(' '),
  danger: [
    'bg-red-500 text-white border border-red-500',
    'hover:bg-red-600 hover:border-red-600 hover:-translate-y-0.5',
    'shadow-sm hover:shadow-md',
  ].join(' '),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          'active:translate-y-0 active:shadow-none',
          'tracking-[-0.01em]',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
export default Button

import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-[0.8rem] font-semibold text-[var(--color-text-primary)] tracking-tight"
          >
            {label}
          </label>
        )}
        {hint && (
          <p className="text-xs text-[var(--color-text-secondary)]">{hint}</p>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all duration-150',
            'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-tertiary)]',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900',
            'dark:focus:ring-zinc-100/10 dark:focus:border-zinc-100',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
              : 'border-[var(--color-border)] hover:border-zinc-300 dark:hover:border-zinc-600',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input

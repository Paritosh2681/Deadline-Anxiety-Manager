import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-[var(--color-text-primary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'w-full px-3 py-2 text-sm rounded-[6px] border transition-colors',
            'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-secondary)]',
            'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent',
            error
              ? 'border-panic-500'
              : 'border-[var(--color-border)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-panic-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input

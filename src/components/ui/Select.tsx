import { SelectHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
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
        <select
          ref={ref}
          id={id}
          className={clsx(
            'w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all duration-150',
            'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900',
            'dark:focus:ring-zinc-100/10 dark:focus:border-zinc-100',
            'appearance-none cursor-pointer',
            error
              ? 'border-red-400'
              : 'border-[var(--color-border)] hover:border-zinc-300 dark:hover:border-zinc-600',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select

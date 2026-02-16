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
            className="block text-sm font-semibold text-[var(--color-text-primary)]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={clsx(
            'w-full px-3 py-2 text-sm rounded-[6px] border transition-colors',
            'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
            'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent',
            error
              ? 'border-panic-500'
              : 'border-[var(--color-border)]',
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
          <p className="text-xs text-panic-600">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select

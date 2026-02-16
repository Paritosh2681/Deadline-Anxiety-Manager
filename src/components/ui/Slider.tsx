import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, id, ...props }, ref) => {
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
          type="range"
          className={clsx(
            'w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-700',
            'accent-gray-900 dark:accent-gray-100',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Slider.displayName = 'Slider'
export default Slider

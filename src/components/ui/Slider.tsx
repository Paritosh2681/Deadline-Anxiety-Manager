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
            className="block text-[0.8rem] font-semibold text-[var(--color-text-primary)] tracking-tight"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type="range"
          className={clsx(
            'w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer dark:bg-zinc-700',
            'accent-zinc-900 dark:accent-zinc-100',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4',
            '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-zinc-900 [&::-webkit-slider-thumb]:shadow-card',
            '[&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing',
            '[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110',
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

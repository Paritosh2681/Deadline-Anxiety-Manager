import { HTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean
  variant?: 'default' | 'elevated' | 'ghost'
}

const variantStyles = {
  default: 'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-subtle',
  elevated: 'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-card',
  ghost: 'bg-[var(--color-surface-secondary)]',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, noPadding, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl',
          variantStyles[variant],
          !noPadding && 'p-5',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'
export default Card

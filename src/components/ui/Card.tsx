import { HTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, noPadding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-[var(--color-surface)] rounded-lg shadow-card',
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

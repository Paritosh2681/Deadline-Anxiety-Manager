import clsx from 'clsx'

interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-xl',
        className
      )}
    />
  )
}

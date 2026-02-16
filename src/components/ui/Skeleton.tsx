import clsx from 'clsx'

interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 rounded-[6px] dark:bg-gray-700',
        className
      )}
    />
  )
}

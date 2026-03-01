import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div className={cn('h-1 w-full bg-zinc-800 rounded-full overflow-hidden', className)}>
      <div
        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

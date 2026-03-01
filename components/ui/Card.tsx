import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  selected?: boolean
  highlighted?: boolean
}

export function Card({ className, hover, selected, highlighted, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-zinc-900 p-6 transition-all duration-200',
        hover && 'cursor-pointer hover:border-zinc-600 hover:shadow-lg',
        selected
          ? 'border-orange-500 shadow-lg shadow-orange-500/20 bg-orange-500/5'
          : 'border-zinc-800',
        highlighted && 'border-orange-500/70 shadow-xl shadow-orange-500/15',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-bold text-zinc-100', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-zinc-400 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

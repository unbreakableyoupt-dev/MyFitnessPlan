import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  suffix?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, suffix, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
              'transition-colors duration-200',
              suffix && 'pr-16',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500 font-medium">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

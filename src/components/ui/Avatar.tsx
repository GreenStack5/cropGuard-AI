import { Camera } from 'lucide-react'
import { cn, initials } from '../../lib/utils'

export interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  editable?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-20 text-2xl',
}

export function Avatar({
  name,
  src,
  size = 'md',
  editable = false,
  className,
}: AvatarProps) {
  return (
    <div className={cn('relative shrink-0', className)}>
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-full bg-brand-100 font-bold text-brand-800 ring-2 ring-white',
          sizeClasses[size],
        )}
        aria-label={name}
      >
        {src ? (
          <img src={src} alt="" className="size-full object-cover" />
        ) : (
          <span>{initials(name)}</span>
        )}
      </div>
      {editable ? (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-brand-700 text-white ring-2 ring-white',
            size === 'lg' ? 'size-7' : 'size-5',
          )}
        >
          <Camera className={size === 'lg' ? 'size-3.5' : 'size-3'} />
        </span>
      ) : null}
    </div>
  )
}
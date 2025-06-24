'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

export function LoadingCard({ title, className }: { title?: string; className?: string }) {
  return (
    <div className={cn('bg-card rounded-lg border p-6', className)}>
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          {title && <p className="mt-4 text-sm text-muted-foreground">{title}</p>}
        </div>
      </div>
    </div>
  )
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-muted rounded', className)} />
  )
}

export function KPICardSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <LoadingSkeleton className="h-10 w-10 rounded-lg" />
        <LoadingSkeleton className="h-6 w-16" />
      </div>
      <div className="mb-4">
        <LoadingSkeleton className="h-4 w-20 mb-2" />
        <LoadingSkeleton className="h-8 w-32" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <LoadingSkeleton className="h-4 w-16" />
          <LoadingSkeleton className="h-4 w-10" />
        </div>
        <LoadingSkeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  )
}
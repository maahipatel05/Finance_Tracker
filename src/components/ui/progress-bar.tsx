import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  variant = 'default',
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  // Auto-determine variant based on percentage if not specified
  const computedVariant = variant === 'default'
    ? percentage >= 100
      ? 'danger'
      : percentage >= 80
        ? 'warning'
        : 'success'
    : variant;
  
  return (
    <div className={cn('space-y-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground tabular-nums">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div
        className={cn(
          'w-full rounded-full bg-muted overflow-hidden',
          {
            'h-1.5': size === 'sm',
            'h-2': size === 'md',
            'h-3': size === 'lg',
          }
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            {
              'bg-income': computedVariant === 'success',
              'bg-warning': computedVariant === 'warning',
              'bg-expense': computedVariant === 'danger',
            }
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

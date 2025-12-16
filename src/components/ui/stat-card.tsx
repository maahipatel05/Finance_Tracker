import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'primary' | 'income' | 'expense';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  variant = 'default',
  size = 'md',
  className,
}: StatCardProps) {
  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;
  
  return (
    <div
      className={cn(
        'rounded-xl transition-all',
        {
          'bg-card border shadow-sm p-4': variant === 'default',
          'bg-primary text-primary-foreground p-4 shadow-md': variant === 'primary',
          'bg-income/10 border border-income/20 p-4': variant === 'income',
          'bg-expense/10 border border-expense/20 p-4': variant === 'expense',
          'p-3': size === 'sm',
          'p-4': size === 'md',
          'p-5': size === 'lg',
        },
        className
      )}
    >
      <p
        className={cn(
          'text-sm font-medium',
          {
            'text-muted-foreground': variant === 'default',
            'text-primary-foreground/80': variant === 'primary',
            'text-income': variant === 'income',
            'text-expense': variant === 'expense',
          }
        )}
      >
        {label}
      </p>
      
      <p
        className={cn(
          'font-display font-bold tabular-nums mt-1',
          {
            'text-2xl': size === 'sm',
            'text-3xl': size === 'md',
            'text-4xl': size === 'lg',
            'text-foreground': variant === 'default',
            'text-primary-foreground': variant === 'primary',
            'text-income': variant === 'income',
            'text-expense': variant === 'expense',
          }
        )}
      >
        {value}
      </p>
      
      {trend !== undefined && (
        <div
          className={cn(
            'flex items-center gap-1 mt-2 text-sm',
            {
              'text-income': isPositiveTrend && variant !== 'expense',
              'text-expense': isNegativeTrend || (isPositiveTrend && variant === 'expense'),
              'text-muted-foreground': trend === 0,
              'text-primary-foreground/70': variant === 'primary',
            }
          )}
        >
          {isPositiveTrend ? (
            <TrendingUp className="w-4 h-4" />
          ) : isNegativeTrend ? (
            <TrendingDown className="w-4 h-4" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
          <span className="font-medium">
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
          {trendLabel && (
            <span className="text-muted-foreground ml-1">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

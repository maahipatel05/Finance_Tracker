import { Budget, CategorySpending } from '@/types/finance';
import { getCategoryById } from '@/data/categories';
import { CategoryIcon } from '@/components/ui/category-icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { formatCurrency } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface BudgetProgressProps {
  budget: Budget;
  spent: number;
  onClick?: () => void;
}

export function BudgetProgress({ budget, spent, onClick }: BudgetProgressProps) {
  const category = getCategoryById(budget.categoryId);
  const percentage = (spent / budget.limit) * 100;
  const remaining = budget.limit - spent;
  const isOverBudget = remaining < 0;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl bg-card border transition-all focus-ring text-left',
        'hover:border-primary/20 hover:shadow-sm',
        onClick && 'cursor-pointer'
      )}
      aria-label={`${category?.name} budget: ${formatCurrency(spent)} of ${formatCurrency(budget.limit)}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <CategoryIcon
          iconName={category?.icon || 'MoreHorizontal'}
          color={category?.color}
          size="sm"
        />
        
        <div className="flex-1">
          <p className="font-medium text-foreground">{category?.name}</p>
        </div>
        
        <div className="text-right">
          <p className="font-display font-semibold tabular-nums">
            {formatCurrency(spent)}
          </p>
          <p className="text-xs text-muted-foreground">
            of {formatCurrency(budget.limit)}
          </p>
        </div>
      </div>
      
      <ProgressBar value={spent} max={budget.limit} size="md" />
      
      <div className="flex justify-between mt-2 text-sm">
        <span className="text-muted-foreground">
          {percentage.toFixed(0)}% used
        </span>
        <span className={cn(isOverBudget ? 'text-expense' : 'text-muted-foreground')}>
          {isOverBudget ? 'Over by ' : ''}
          {formatCurrency(Math.abs(remaining))}
          {isOverBudget ? '' : ' left'}
        </span>
      </div>
    </button>
  );
}

interface BudgetListProps {
  budgets: Budget[];
  spending: CategorySpending[];
  onBudgetClick?: (budget: Budget) => void;
  className?: string;
}

export function BudgetList({
  budgets,
  spending,
  onBudgetClick,
  className,
}: BudgetListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {budgets.map((budget) => {
        const categorySpending = spending.find(
          (s) => s.categoryId === budget.categoryId
        );
        
        return (
          <BudgetProgress
            key={budget.id}
            budget={budget}
            spent={categorySpending?.amount || 0}
            onClick={() => onBudgetClick?.(budget)}
          />
        );
      })}
    </div>
  );
}

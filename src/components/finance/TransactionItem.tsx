import { Transaction } from '@/types/finance';
import { getCategoryById } from '@/data/categories';
import { CategoryIcon } from '@/components/ui/category-icon';
import { formatCurrency } from '@/lib/calculations';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
  showDate?: boolean;
  currencySymbol?: string;
}

export function TransactionItem({
  transaction,
  onClick,
  showDate = true,
  currencySymbol = '$',
}: TransactionItemProps) {
  const category = getCategoryById(transaction.categoryId);
  const isExpense = transaction.type === 'expense';
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl bg-card border transition-all focus-ring',
        'hover:border-primary/20 hover:shadow-sm active:scale-[0.99]',
        onClick && 'cursor-pointer'
      )}
      aria-label={`${transaction.note || category?.name}, ${formatCurrency(transaction.amount, currencySymbol)}`}
    >
      <CategoryIcon
        iconName={category?.icon || 'MoreHorizontal'}
        color={category?.color}
        size="md"
      />
      
      <div className="flex-1 text-left min-w-0">
        <p className="font-medium text-foreground truncate">
          {transaction.note || category?.name || 'Transaction'}
        </p>
        <p className="text-sm text-muted-foreground">
          {category?.name}
          {showDate && (
            <>
              {' · '}
              {format(parseISO(transaction.date), 'MMM d')}
            </>
          )}
        </p>
      </div>
      
      <p
        className={cn(
          'font-display font-semibold tabular-nums',
          isExpense ? 'text-expense' : 'text-income'
        )}
      >
        {isExpense ? '-' : '+'}
        {formatCurrency(transaction.amount, currencySymbol)}
      </p>
    </button>
  );
}

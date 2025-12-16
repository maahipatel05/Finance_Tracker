import { Transaction } from '@/types/finance';
import { TransactionItem } from './TransactionItem';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonList } from '@/components/ui/skeleton-list';
import { Receipt } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
  onAddClick?: () => void;
  groupByDate?: boolean;
  showEmptyState?: boolean;
  className?: string;
  currencySymbol?: string;
}

export function TransactionList({
  transactions,
  isLoading = false,
  onTransactionClick,
  onAddClick,
  groupByDate = true,
  showEmptyState = true,
  className,
  currencySymbol = '$',
}: TransactionListProps) {
  if (isLoading) {
    return <SkeletonList count={5} className={className} />;
  }
  
  if (transactions.length === 0 && showEmptyState) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        description="Start tracking your spending by adding your first transaction."
        action={onAddClick ? { label: 'Add Transaction', onClick: onAddClick } : undefined}
        className={className}
      />
    );
  }
  
  if (!groupByDate) {
    return (
      <div className={cn('space-y-2', className)}>
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onClick={() => onTransactionClick?.(transaction)}
            currencySymbol={currencySymbol}
          />
        ))}
      </div>
    );
  }
  
  // Group transactions by date
  const grouped = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);
  
  const sortedDates = Object.keys(grouped).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  return (
    <div className={cn('space-y-6', className)}>
      {sortedDates.map((date) => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground px-1">
            {format(parseISO(date), 'EEEE, MMMM d')}
          </h3>
          <div className="space-y-2">
            {grouped[date].map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onClick={() => onTransactionClick?.(transaction)}
                showDate={false}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState } from 'react';
import { format } from 'date-fns';
import { AppShell } from '@/components/layout/AppShell';
import { MonthPicker } from '@/components/ui/month-picker';
import { CategoryChart } from '@/components/finance/CategoryChart';
import { TransactionList } from '@/components/finance/TransactionList';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { SkeletonCard } from '@/components/ui/skeleton-list';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChevronLeft, PieChart } from 'lucide-react';
import {
  useTransactions,
  useTransactionMutation,
  useMonthlySummary,
} from '@/hooks/useFinanceData';
import { getTransactionsForMonth } from '@/lib/calculations';
import { getCategoryById } from '@/data/categories';
import { Transaction } from '@/types/finance';

export default function Categories() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const { data: allTransactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: summary, isLoading: summaryLoading } = useMonthlySummary(selectedMonth);
  const transactionMutation = useTransactionMutation();
  
  const monthTransactions = getTransactionsForMonth(allTransactions, selectedMonth);
  const expenseTransactions = monthTransactions.filter(t => t.type === 'expense');
  
  const filteredTransactions = selectedCategory
    ? expenseTransactions.filter(t => t.categoryId === selectedCategory)
    : expenseTransactions;
  
  const selectedCategoryData = selectedCategory
    ? getCategoryById(selectedCategory)
    : null;
  
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };
  
  const handleSubmit = (transaction: Transaction) => {
    transactionMutation.mutate(transaction, {
      onSuccess: () => {
        setIsFormOpen(false);
        setEditingTransaction(null);
      },
    });
  };
  
  const isLoading = transactionsLoading || summaryLoading;
  
  return (
    <AppShell title="Categories">
      <div className="space-y-6">
        {/* Month Picker */}
        <div className="flex justify-center">
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        </div>
        
        {selectedCategory ? (
          /* Category Detail View */
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Overview
            </Button>
            
            <div className="bg-card rounded-xl border p-4">
              <h2 className="font-display font-semibold text-lg mb-1">
                {selectedCategoryData?.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {filteredTransactions.length} transactions
              </p>
            </div>
            
            <TransactionList
              transactions={filteredTransactions}
              isLoading={transactionsLoading}
              onTransactionClick={handleEditTransaction}
              showEmptyState={true}
            />
          </div>
        ) : (
          /* Overview */
          <>
            {isLoading ? (
              <SkeletonCard className="h-80" />
            ) : summary?.categoryBreakdown?.length ? (
              <div className="bg-card rounded-xl border p-4">
                <h2 className="font-display font-semibold mb-4">
                  Spending by Category
                </h2>
                <CategoryChart
                  data={summary.categoryBreakdown}
                  onCategoryClick={setSelectedCategory}
                />
              </div>
            ) : (
              <EmptyState
                icon={PieChart}
                title="No expenses yet"
                description="Add some transactions to see your spending breakdown."
              />
            )}
          </>
        )}
      </div>
      
      {/* Transaction Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            initialData={editingTransaction || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={transactionMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

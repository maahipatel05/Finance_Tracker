import { useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { MonthPicker } from '@/components/ui/month-picker';
import { StatCard } from '@/components/ui/stat-card';
import { SpendingChart } from '@/components/finance/SpendingChart';
import { TransactionList } from '@/components/finance/TransactionList';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { SkeletonCard, SkeletonChart } from '@/components/ui/skeleton-list';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useTransactions,
  useTransactionMutation,
  useMonthlySummary,
  useBudgets,
} from '@/hooks/useFinanceData';
import { formatCurrency } from '@/lib/calculations';
import { getTransactionsForMonth, getBudgetsForMonth } from '@/lib/calculations';
import { Transaction } from '@/types/finance';

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  const { data: allTransactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: allBudgets = [] } = useBudgets();
  const { data: summary, isLoading: summaryLoading } = useMonthlySummary(selectedMonth);
  const transactionMutation = useTransactionMutation();
  
  const monthTransactions = getTransactionsForMonth(allTransactions, selectedMonth);
  const recentTransactions = monthTransactions.slice(0, 5);
  const monthBudgets = getBudgetsForMonth(allBudgets, selectedMonth);
  const totalBudget = monthBudgets.reduce((sum, b) => sum + b.limit, 0);
  const remaining = totalBudget - (summary?.totalExpenses || 0);
  
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };
  
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
    <AppShell
      headerAction={
        <Button onClick={handleAddTransaction} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Month Picker */}
        <div className="flex justify-center">
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <SkeletonCard className="md:col-span-2" />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Total Spent - Primary stat */}
              <StatCard
                label="Total Spent"
                value={formatCurrency(summary?.totalExpenses || 0)}
                trend={summary?.vsLastMonth.expenses}
                trendLabel="vs last month"
                variant="primary"
                size="lg"
                className="md:col-span-2"
              />
              
              {/* Income */}
              <StatCard
                label="Income"
                value={formatCurrency(summary?.totalIncome || 0)}
                trend={summary?.vsLastMonth.income}
                variant="income"
              />
            </>
          )}
        </div>
        
        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                label="Budget Remaining"
                value={formatCurrency(Math.max(remaining, 0))}
                variant={remaining < 0 ? 'expense' : 'default'}
                size="sm"
              />
              <StatCard
                label="Net Savings"
                value={formatCurrency(summary?.netSavings || 0)}
                variant={(summary?.netSavings || 0) >= 0 ? 'income' : 'expense'}
                size="sm"
              />
            </>
          )}
        </div>
        
        {/* Spending Chart */}
        <div className="bg-card rounded-xl border p-4">
          <h2 className="font-display font-semibold mb-4">Daily Spending</h2>
          {isLoading ? (
            <SkeletonChart />
          ) : summary?.dailySpending?.length ? (
            <SpendingChart data={summary.dailySpending} />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No spending data for this month
            </div>
          )}
        </div>
        
        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Recent Transactions</h2>
            {monthTransactions.length > 5 && (
              <Button variant="ghost" size="sm" asChild>
                <a href="/transactions">View all</a>
              </Button>
            )}
          </div>
          
          <TransactionList
            transactions={recentTransactions}
            isLoading={transactionsLoading}
            onTransactionClick={handleEditTransaction}
            onAddClick={handleAddTransaction}
            groupByDate={false}
          />
        </div>
      </div>
      
      {/* Mobile FAB */}
      <Button
        onClick={handleAddTransaction}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg md:hidden"
        size="icon"
        aria-label="Add transaction"
      >
        <Plus className="w-6 h-6" />
      </Button>
      
      {/* Transaction Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </DialogTitle>
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

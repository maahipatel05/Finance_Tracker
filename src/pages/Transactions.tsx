import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Plus, Search, X, Trash2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { MonthPicker } from '@/components/ui/month-picker';
import { TransactionList } from '@/components/finance/TransactionList';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { FilterChip, FilterChipGroup } from '@/components/ui/filter-chip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useTransactions,
  useTransactionMutation,
  useDeleteTransaction,
} from '@/hooks/useFinanceData';
import { getTransactionsForMonth, formatCurrency } from '@/lib/calculations';
import { expenseCategories, getCategoryById } from '@/data/categories';
import { Transaction, TransactionType } from '@/types/finance';

export default function Transactions() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const { data: allTransactions = [], isLoading } = useTransactions();
  const transactionMutation = useTransactionMutation();
  const deleteMutation = useDeleteTransaction();
  
  const monthTransactions = getTransactionsForMonth(allTransactions, selectedMonth);
  
  const filteredTransactions = useMemo(() => {
    return monthTransactions.filter((transaction) => {
      // Type filter
      if (typeFilter && transaction.type !== typeFilter) return false;
      
      // Category filter
      if (categoryFilter && transaction.categoryId !== categoryFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const category = getCategoryById(transaction.categoryId);
        const matchesNote = transaction.note?.toLowerCase().includes(query);
        const matchesCategory = category?.name.toLowerCase().includes(query);
        const matchesAmount = transaction.amount.toString().includes(query);
        
        if (!matchesNote && !matchesCategory && !matchesAmount) return false;
      }
      
      return true;
    });
  }, [monthTransactions, typeFilter, categoryFilter, searchQuery]);
  
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
  
  const handleDelete = () => {
    if (editingTransaction) {
      deleteMutation.mutate(editingTransaction.id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setIsFormOpen(false);
          setEditingTransaction(null);
        },
      });
    }
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter(null);
    setCategoryFilter(null);
  };
  
  const hasFilters = searchQuery || typeFilter || categoryFilter;
  
  return (
    <AppShell
      title="Transactions"
      headerAction={
        <Button onClick={handleAddTransaction} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Month Picker */}
        <div className="flex justify-center">
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
            aria-label="Search transactions"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Filters */}
        <div className="space-y-2">
          <FilterChipGroup>
            <FilterChip
              label="All"
              active={!typeFilter}
              onToggle={() => setTypeFilter(null)}
            />
            <FilterChip
              label="Expenses"
              active={typeFilter === 'expense'}
              onToggle={() => setTypeFilter(typeFilter === 'expense' ? null : 'expense')}
            />
            <FilterChip
              label="Income"
              active={typeFilter === 'income'}
              onToggle={() => setTypeFilter(typeFilter === 'income' ? null : 'income')}
            />
          </FilterChipGroup>
          
          {hasFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredTransactions.length} results
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          isLoading={isLoading}
          onTransactionClick={handleEditTransaction}
          onAddClick={handleAddTransaction}
          groupByDate={true}
        />
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
          {editingTransaction && (
            <DialogFooter className="mt-4 pt-4 border-t">
              <Button
                variant="destructive"
                onClick={() => setDeleteConfirmOpen(true)}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Transaction
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction of {editingTransaction && formatCurrency(editingTransaction.amount)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

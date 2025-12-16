import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, Budget, Settings } from '@/types/finance';
import * as storage from '@/lib/storage';
import { calculateMonthlySummary } from '@/lib/calculations';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

// Query keys
export const queryKeys = {
  transactions: ['transactions'] as const,
  budgets: ['budgets'] as const,
  settings: ['settings'] as const,
  summary: (month: string) => ['summary', month] as const,
};

// Transactions
export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => storage.getTransactions(),
  });
}

export function useTransactionMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transaction: Transaction) => {
      return Promise.resolve(storage.saveTransaction(transaction));
    },
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.transactions });
      
      const previousTransactions = queryClient.getQueryData<Transaction[]>(queryKeys.transactions);
      
      queryClient.setQueryData<Transaction[]>(queryKeys.transactions, (old = []) => {
        const index = old.findIndex(t => t.id === newTransaction.id);
        if (index >= 0) {
          const updated = [...old];
          updated[index] = newTransaction;
          return updated;
        }
        return [newTransaction, ...old];
      });
      
      return { previousTransactions };
    },
    onError: (err, newTransaction, context) => {
      queryClient.setQueryData(queryKeys.transactions, context?.previousTransactions);
      toast({
        title: 'Error',
        description: 'Failed to save transaction. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      toast({
        title: 'Success',
        description: 'Transaction saved successfully.',
      });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      storage.deleteTransaction(id);
      return Promise.resolve(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.transactions });
      
      const previousTransactions = queryClient.getQueryData<Transaction[]>(queryKeys.transactions);
      
      queryClient.setQueryData<Transaction[]>(queryKeys.transactions, (old = []) => 
        old.filter(t => t.id !== id)
      );
      
      return { previousTransactions };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(queryKeys.transactions, context?.previousTransactions);
      toast({
        title: 'Error',
        description: 'Failed to delete transaction. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      toast({
        title: 'Deleted',
        description: 'Transaction removed.',
      });
    },
  });
}

// Budgets
export function useBudgets() {
  return useQuery({
    queryKey: queryKeys.budgets,
    queryFn: () => storage.getBudgets(),
  });
}

export function useBudgetMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (budget: Budget) => {
      return Promise.resolve(storage.saveBudget(budget));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
      toast({
        title: 'Budget updated',
        description: 'Your budget has been saved.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save budget. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

// Settings
export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => storage.getSettings(),
  });
}

// Summary
export function useMonthlySummary(month: string) {
  const { data: transactions = [] } = useTransactions();
  const { data: budgets = [] } = useBudgets();
  
  return useQuery({
    queryKey: queryKeys.summary(month),
    queryFn: () => calculateMonthlySummary(transactions, budgets, month),
    enabled: transactions.length > 0,
  });
}

// Current month helper
export function useCurrentMonth() {
  return format(new Date(), 'yyyy-MM');
}

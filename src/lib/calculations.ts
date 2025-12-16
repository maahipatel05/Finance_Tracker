import { Transaction, Budget, MonthlySummary, CategorySpending, DailySpending } from '@/types/finance';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';
import { getCategoryById } from '@/data/categories';

export function getTransactionsForMonth(transactions: Transaction[], month: string): Transaction[] {
  return transactions.filter(t => t.date.startsWith(month));
}

export function getBudgetsForMonth(budgets: Budget[], month: string): Budget[] {
  return budgets.filter(b => b.month === month);
}

export function calculateMonthlySummary(
  transactions: Transaction[],
  budgets: Budget[],
  month: string
): MonthlySummary {
  const monthTransactions = getTransactionsForMonth(transactions, month);
  const monthBudgets = getBudgetsForMonth(budgets, month);
  
  // Previous month for comparison
  const previousMonth = format(subMonths(parseISO(`${month}-01`), 1), 'yyyy-MM');
  const previousTransactions = getTransactionsForMonth(transactions, previousMonth);
  
  // Calculate totals
  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const prevIncome = previousTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const prevExpenses = previousTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate category breakdown
  const expensesByCategory = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  
  const categoryBreakdown: CategorySpending[] = Object.entries(expensesByCategory)
    .map(([categoryId, amount]) => {
      const budget = monthBudgets.find(b => b.categoryId === categoryId);
      return {
        categoryId,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        budgetLimit: budget?.limit,
      };
    })
    .sort((a, b) => b.amount - a.amount);
  
  // Calculate daily spending
  const monthStart = startOfMonth(parseISO(`${month}-01`));
  const monthEnd = endOfMonth(parseISO(`${month}-01`));
  const today = new Date();
  const effectiveEnd = monthEnd > today ? today : monthEnd;
  
  const days = eachDayOfInterval({ start: monthStart, end: effectiveEnd });
  
  const dailySpending: DailySpending[] = days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayExpenses = monthTransactions
      .filter(t => t.date === dateStr && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { date: dateStr, amount: dayExpenses };
  });
  
  // Calculate budget usage
  const totalBudget = monthBudgets.reduce((sum, b) => sum + b.limit, 0);
  const budgetUsage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  
  // Calculate vs last month
  const expenseChange = prevExpenses > 0 
    ? ((totalExpenses - prevExpenses) / prevExpenses) * 100 
    : 0;
  
  const incomeChange = prevIncome > 0 
    ? ((totalIncome - prevIncome) / prevIncome) * 100 
    : 0;
  
  return {
    month,
    totalIncome,
    totalExpenses,
    netSavings: totalIncome - totalExpenses,
    budgetUsage,
    categoryBreakdown,
    dailySpending,
    vsLastMonth: {
      expenses: expenseChange,
      income: incomeChange,
    },
  };
}

export function formatCurrency(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactCurrency(amount: number, symbol: string = '$'): string {
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}k`;
  }
  return `${symbol}${amount.toFixed(0)}`;
}

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  note: string;
}

export interface Budget {
  id: string;
  month: string; // YYYY-MM format
  categoryId: string;
  limit: number;
}

export interface Settings {
  currency: string;
  currencySymbol: string;
  startDayOfWeek: number; // 0 = Sunday, 1 = Monday
}

export interface MonthlySummary {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  budgetUsage: number; // percentage
  categoryBreakdown: CategorySpending[];
  dailySpending: DailySpending[];
  vsLastMonth: {
    expenses: number; // percentage change
    income: number;
  };
}

export interface CategorySpending {
  categoryId: string;
  amount: number;
  percentage: number;
  budgetLimit?: number;
}

export interface DailySpending {
  date: string;
  amount: number;
}

export interface TransactionFormData {
  date: string;
  amount: string;
  type: TransactionType;
  categoryId: string;
  note: string;
}

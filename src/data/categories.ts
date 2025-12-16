import { Category } from '@/types/finance';

export const defaultCategories: Category[] = [
  { id: 'food', name: 'Food & Dining', icon: 'UtensilsCrossed', color: 'hsl(38, 92%, 50%)' },
  { id: 'transport', name: 'Transport', icon: 'Car', color: 'hsl(200, 70%, 50%)' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'hsl(280, 60%, 55%)' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Gamepad2', color: 'hsl(330, 70%, 55%)' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'Receipt', color: 'hsl(220, 60%, 50%)' },
  { id: 'health', name: 'Health', icon: 'Heart', color: 'hsl(0, 72%, 60%)' },
  { id: 'groceries', name: 'Groceries', icon: 'Apple', color: 'hsl(140, 60%, 45%)' },
  { id: 'salary', name: 'Salary', icon: 'Wallet', color: 'hsl(158, 64%, 40%)' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: 'hsl(180, 60%, 45%)' },
  { id: 'investments', name: 'Investments', icon: 'TrendingUp', color: 'hsl(158, 64%, 35%)' },
  { id: 'gifts', name: 'Gifts', icon: 'Gift', color: 'hsl(350, 70%, 55%)' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: 'hsl(220, 10%, 50%)' },
];

export const expenseCategories = defaultCategories.filter(c => 
  !['salary', 'freelance', 'investments'].includes(c.id)
);

export const incomeCategories = defaultCategories.filter(c => 
  ['salary', 'freelance', 'investments', 'gifts', 'other'].includes(c.id)
);

export function getCategoryById(id: string): Category | undefined {
  return defaultCategories.find(c => c.id === id);
}

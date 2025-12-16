import { Transaction, Budget, Settings } from '@/types/finance';
import { generateSeedTransactions, generateSeedBudgets } from '@/data/seedData';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_transactions',
  BUDGETS: 'finance_budgets',
  SETTINGS: 'finance_settings',
  INITIALIZED: 'finance_initialized',
};

const defaultSettings: Settings = {
  currency: 'USD',
  currencySymbol: '$',
  startDayOfWeek: 1, // Monday
};

function initializeData(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!initialized) {
    const transactions = generateSeedTransactions();
    const budgets = generateSeedBudgets();
    
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// Initialize on first import
initializeData();

// Transactions
export function getTransactions(): Transaction[] {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
}

export function saveTransaction(transaction: Transaction): Transaction {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === transaction.id);
  
  if (index >= 0) {
    transactions[index] = transaction;
  } else {
    transactions.unshift(transaction);
  }
  
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  return transaction;
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

// Budgets
export function getBudgets(): Budget[] {
  const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  return data ? JSON.parse(data) : [];
}

export function saveBudget(budget: Budget): Budget {
  const budgets = getBudgets();
  const index = budgets.findIndex(b => b.id === budget.id);
  
  if (index >= 0) {
    budgets[index] = budget;
  } else {
    // Check if budget already exists for this month/category
    const existingIndex = budgets.findIndex(
      b => b.month === budget.month && b.categoryId === budget.categoryId
    );
    
    if (existingIndex >= 0) {
      budgets[existingIndex] = budget;
    } else {
      budgets.push(budget);
    }
  }
  
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  return budget;
}

export function deleteBudget(id: string): void {
  const budgets = getBudgets().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
}

// Settings
export function getSettings(): Settings {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : defaultSettings;
}

export function saveSettings(settings: Settings): Settings {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  return settings;
}

// Reset all data (for testing)
export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.BUDGETS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  initializeData();
}

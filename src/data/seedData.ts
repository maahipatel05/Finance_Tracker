import { Transaction, Budget } from '@/types/finance';
import { format, subDays, subMonths, startOfMonth, addDays } from 'date-fns';

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

const expenseNotes: Record<string, string[]> = {
  food: ['Lunch at café', 'Dinner with friends', 'Coffee run', 'Takeout order', 'Restaurant'],
  transport: ['Uber ride', 'Gas station', 'Metro pass', 'Parking', 'Bus ticket'],
  shopping: ['New shoes', 'Amazon order', 'Clothes', 'Electronics', 'Home decor'],
  entertainment: ['Netflix subscription', 'Concert tickets', 'Movie night', 'Gaming', 'Spotify'],
  bills: ['Electric bill', 'Internet', 'Phone plan', 'Water bill', 'Insurance'],
  health: ['Pharmacy', 'Gym membership', 'Doctor visit', 'Vitamins', 'Dental'],
  groceries: ['Weekly groceries', 'Whole Foods', 'Farmers market', 'Costco run', 'Quick grocery stop'],
};

const incomeNotes: Record<string, string[]> = {
  salary: ['Monthly salary', 'Paycheck', 'Salary deposit'],
  freelance: ['Client project', 'Consulting fee', 'Design work', 'Development gig'],
  investments: ['Dividend payment', 'Stock sale', 'Interest earned'],
  gifts: ['Birthday gift', 'Holiday bonus', 'Gift from family'],
};

export function generateSeedTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  // Generate 3 months of data
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const monthStart = startOfMonth(subMonths(today, monthOffset));
    const daysInMonth = monthOffset === 0 ? today.getDate() : 30;
    
    // Add salary for each month (on the 1st)
    transactions.push({
      id: generateId(),
      date: format(monthStart, 'yyyy-MM-dd'),
      amount: randomBetween(4500, 5500),
      type: 'income',
      categoryId: 'salary',
      note: 'Monthly salary',
    });
    
    // Add occasional freelance income
    if (Math.random() > 0.5) {
      transactions.push({
        id: generateId(),
        date: format(addDays(monthStart, randomBetween(5, 20)), 'yyyy-MM-dd'),
        amount: randomBetween(500, 1500),
        type: 'income',
        categoryId: 'freelance',
        note: incomeNotes.freelance[randomBetween(0, incomeNotes.freelance.length - 1)],
      });
    }
    
    // Generate daily expenses
    for (let day = 0; day < daysInMonth; day++) {
      const currentDate = addDays(monthStart, day);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      // Food (1-3 times per day)
      const foodCount = randomBetween(1, 3);
      for (let i = 0; i < foodCount; i++) {
        if (Math.random() > 0.3) {
          transactions.push({
            id: generateId(),
            date: dateStr,
            amount: randomBetween(8, 45),
            type: 'expense',
            categoryId: 'food',
            note: expenseNotes.food[randomBetween(0, expenseNotes.food.length - 1)],
          });
        }
      }
      
      // Transport (occasional)
      if (Math.random() > 0.6) {
        transactions.push({
          id: generateId(),
          date: dateStr,
          amount: randomBetween(5, 35),
          type: 'expense',
          categoryId: 'transport',
          note: expenseNotes.transport[randomBetween(0, expenseNotes.transport.length - 1)],
        });
      }
      
      // Groceries (2-3 times per week)
      if (day % 3 === 0 && Math.random() > 0.4) {
        transactions.push({
          id: generateId(),
          date: dateStr,
          amount: randomBetween(40, 120),
          type: 'expense',
          categoryId: 'groceries',
          note: expenseNotes.groceries[randomBetween(0, expenseNotes.groceries.length - 1)],
        });
      }
      
      // Shopping (occasional)
      if (Math.random() > 0.85) {
        transactions.push({
          id: generateId(),
          date: dateStr,
          amount: randomBetween(25, 150),
          type: 'expense',
          categoryId: 'shopping',
          note: expenseNotes.shopping[randomBetween(0, expenseNotes.shopping.length - 1)],
        });
      }
      
      // Entertainment (occasional)
      if (Math.random() > 0.8) {
        transactions.push({
          id: generateId(),
          date: dateStr,
          amount: randomBetween(10, 50),
          type: 'expense',
          categoryId: 'entertainment',
          note: expenseNotes.entertainment[randomBetween(0, expenseNotes.entertainment.length - 1)],
        });
      }
      
      // Health (rare)
      if (Math.random() > 0.92) {
        transactions.push({
          id: generateId(),
          date: dateStr,
          amount: randomBetween(20, 100),
          type: 'expense',
          categoryId: 'health',
          note: expenseNotes.health[randomBetween(0, expenseNotes.health.length - 1)],
        });
      }
    }
    
    // Bills (monthly, around 5th-15th)
    transactions.push({
      id: generateId(),
      date: format(addDays(monthStart, randomBetween(5, 15)), 'yyyy-MM-dd'),
      amount: randomBetween(80, 150),
      type: 'expense',
      categoryId: 'bills',
      note: 'Electric bill',
    });
    
    transactions.push({
      id: generateId(),
      date: format(addDays(monthStart, randomBetween(5, 15)), 'yyyy-MM-dd'),
      amount: randomBetween(50, 80),
      type: 'expense',
      categoryId: 'bills',
      note: 'Internet',
    });
    
    transactions.push({
      id: generateId(),
      date: format(addDays(monthStart, randomBetween(5, 15)), 'yyyy-MM-dd'),
      amount: randomBetween(40, 70),
      type: 'expense',
      categoryId: 'bills',
      note: 'Phone plan',
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function generateSeedBudgets(): Budget[] {
  const today = new Date();
  const budgets: Budget[] = [];
  
  // Generate budgets for current and previous 2 months
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const month = format(subMonths(today, monthOffset), 'yyyy-MM');
    
    budgets.push(
      { id: generateId(), month, categoryId: 'food', limit: 400 },
      { id: generateId(), month, categoryId: 'transport', limit: 150 },
      { id: generateId(), month, categoryId: 'shopping', limit: 200 },
      { id: generateId(), month, categoryId: 'entertainment', limit: 100 },
      { id: generateId(), month, categoryId: 'bills', limit: 300 },
      { id: generateId(), month, categoryId: 'health', limit: 100 },
      { id: generateId(), month, categoryId: 'groceries', limit: 350 },
    );
  }
  
  return budgets;
}

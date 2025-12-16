import { CategorySpending } from '@/types/finance';
import { getCategoryById } from '@/data/categories';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/calculations';
import { CategoryIcon } from '@/components/ui/category-icon';
import { cn } from '@/lib/utils';

interface CategoryChartProps {
  data: CategorySpending[];
  onCategoryClick?: (categoryId: string) => void;
  currencySymbol?: string;
}

const COLORS = [
  '#f59e0b', // amber - Food
  '#3b82f6', // blue - Transport
  '#8b5cf6', // violet - Shopping  
  '#ec4899', // pink - Entertainment
  '#6366f1', // indigo - Bills
  '#ef4444', // red - Health
  '#22c55e', // green - Groceries
  '#64748b', // slate - Other
];

export function CategoryChart({
  data,
  onCategoryClick,
  currencySymbol = '$',
}: CategoryChartProps) {
  const chartData = data.map((item, index) => {
    const category = getCategoryById(item.categoryId);
    return {
      ...item,
      name: category?.name || 'Other',
      color: COLORS[index % COLORS.length],
    };
  });
  
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  if (chartData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        No spending data available
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Donut Chart */}
      <div className="h-52 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="cursor-pointer transition-all hover:opacity-80"
                  onClick={() => onCategoryClick?.(entry.categoryId)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-card rounded-full w-24 h-24 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-display font-bold text-lg">
              {formatCurrency(total, currencySymbol)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Category list */}
      <div className="space-y-2">
        {chartData.slice(0, 5).map((item) => {
          const category = getCategoryById(item.categoryId);
          
          return (
            <button
              key={item.categoryId}
              type="button"
              onClick={() => onCategoryClick?.(item.categoryId)}
              className={cn(
                'w-full flex items-center gap-3 p-2 rounded-lg transition-colors focus-ring',
                'hover:bg-muted/50'
              )}
            >
              <CategoryIcon
                iconName={category?.icon || 'MoreHorizontal'}
                color={category?.color}
                size="sm"
              />
              
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{item.name}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">
                  {formatCurrency(item.amount, currencySymbol)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.percentage.toFixed(1)}%
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

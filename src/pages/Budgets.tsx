import { useState } from 'react';
import { format } from 'date-fns';
import { AppShell } from '@/components/layout/AppShell';
import { MonthPicker } from '@/components/ui/month-picker';
import { BudgetList } from '@/components/finance/BudgetProgress';
import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonList } from '@/components/ui/skeleton-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryIcon } from '@/components/ui/category-icon';
import { Plus, Target } from 'lucide-react';
import {
  useBudgets,
  useBudgetMutation,
  useMonthlySummary,
} from '@/hooks/useFinanceData';
import { getBudgetsForMonth } from '@/lib/calculations';
import { expenseCategories, getCategoryById } from '@/data/categories';
import { Budget } from '@/types/finance';

export default function Budgets() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formCategory, setFormCategory] = useState('');
  const [formLimit, setFormLimit] = useState('');
  
  const { data: allBudgets = [], isLoading: budgetsLoading } = useBudgets();
  const { data: summary } = useMonthlySummary(selectedMonth);
  const budgetMutation = useBudgetMutation();
  
  const monthBudgets = getBudgetsForMonth(allBudgets, selectedMonth);
  const existingCategoryIds = monthBudgets.map(b => b.categoryId);
  const availableCategories = expenseCategories.filter(
    c => !existingCategoryIds.includes(c.id) || editingBudget?.categoryId === c.id
  );
  
  const handleAddBudget = () => {
    setEditingBudget(null);
    setFormCategory('');
    setFormLimit('');
    setIsFormOpen(true);
  };
  
  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setFormCategory(budget.categoryId);
    setFormLimit(budget.limit.toString());
    setIsFormOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budget: Budget = {
      id: editingBudget?.id || crypto.randomUUID(),
      month: selectedMonth,
      categoryId: formCategory,
      limit: parseFloat(formLimit),
    };
    
    budgetMutation.mutate(budget, {
      onSuccess: () => {
        setIsFormOpen(false);
        setEditingBudget(null);
      },
    });
  };
  
  return (
    <AppShell
      title="Budgets"
      headerAction={
        <Button onClick={handleAddBudget} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Budget
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Month Picker */}
        <div className="flex justify-center">
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        </div>
        
        {/* Budget List */}
        {budgetsLoading ? (
          <SkeletonList count={4} />
        ) : monthBudgets.length > 0 ? (
          <BudgetList
            budgets={monthBudgets}
            spending={summary?.categoryBreakdown || []}
            onBudgetClick={handleEditBudget}
          />
        ) : (
          <EmptyState
            icon={Target}
            title="Set your first budget"
            description="Create budgets for different categories to track your spending and stay on target."
            action={{ label: 'Create Budget', onClick: handleAddBudget }}
          />
        )}
      </div>
      
      {/* Mobile FAB */}
      {monthBudgets.length > 0 && (
        <Button
          onClick={handleAddBudget}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg md:hidden"
          size="icon"
          aria-label="Add budget"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}
      
      {/* Budget Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? 'Edit Budget' : 'Create Budget'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formCategory}
                onValueChange={setFormCategory}
                disabled={!!editingBudget}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(editingBudget ? expenseCategories : availableCategories).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <CategoryIcon
                          iconName={category.icon}
                          color={category.color}
                          size="sm"
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="limit">Monthly Limit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  $
                </span>
                <Input
                  id="limit"
                  type="number"
                  step="1"
                  min="1"
                  placeholder="0"
                  className="pl-7 text-lg font-semibold"
                  value={formLimit}
                  onChange={(e) => setFormLimit(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="flex-1"
                disabled={budgetMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!formCategory || !formLimit || budgetMutation.isPending}
              >
                {budgetMutation.isPending ? 'Saving...' : editingBudget ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

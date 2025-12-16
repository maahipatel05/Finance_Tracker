import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Transaction, TransactionType } from '@/types/finance';
import { expenseCategories, incomeCategories } from '@/data/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryIcon } from '@/components/ui/category-icon';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const transactionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Category is required'),
  note: z.string().max(200, 'Note must be less than 200 characters').optional(),
});

type FormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  initialData?: Transaction;
  onSubmit: (transaction: Transaction) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function TransactionForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      amount: initialData?.amount.toString() || '',
      type: initialData?.type || 'expense',
      categoryId: initialData?.categoryId || '',
      note: initialData?.note || '',
    },
  });
  
  const transactionType = watch('type');
  const categories = transactionType === 'income' ? incomeCategories : expenseCategories;
  
  const handleFormSubmit = (data: FormData) => {
    const transaction: Transaction = {
      id: initialData?.id || crypto.randomUUID(),
      date: data.date,
      amount: parseFloat(data.amount),
      type: data.type as TransactionType,
      categoryId: data.categoryId,
      note: data.note || '',
    };
    
    onSubmit(transaction);
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Type toggle */}
      <div className="space-y-2">
        <Label>Type</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setValue('type', 'expense');
              setValue('categoryId', '');
            }}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg font-medium transition-all focus-ring',
              transactionType === 'expense'
                ? 'bg-expense text-expense-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => {
              setValue('type', 'income');
              setValue('categoryId', '');
            }}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg font-medium transition-all focus-ring',
              transactionType === 'income'
                ? 'bg-income text-income-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            Income
          </button>
        </div>
      </div>
      
      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            $
          </span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="pl-7 text-lg font-semibold"
            {...register('amount')}
            aria-invalid={!!errors.amount}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-expense">{errors.amount.message}</p>
        )}
      </div>
      
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={watch('categoryId')}
          onValueChange={(value) => setValue('categoryId', value)}
        >
          <SelectTrigger id="category" aria-invalid={!!errors.categoryId}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
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
        {errors.categoryId && (
          <p className="text-sm text-expense">{errors.categoryId.message}</p>
        )}
      </div>
      
      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register('date')}
          aria-invalid={!!errors.date}
        />
        {errors.date && (
          <p className="text-sm text-expense">{errors.date.message}</p>
        )}
      </div>
      
      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          placeholder="Add a note..."
          className="resize-none"
          rows={2}
          {...register('note')}
          aria-invalid={!!errors.note}
        />
        {errors.note && (
          <p className="text-sm text-expense">{errors.note.message}</p>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Add Transaction'}
        </Button>
      </div>
    </form>
  );
}

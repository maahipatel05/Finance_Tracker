import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import { Button } from './button';

interface MonthPickerProps {
  value: string; // YYYY-MM format
  onChange: (month: string) => void;
  className?: string;
}

export function MonthPicker({ value, onChange, className }: MonthPickerProps) {
  const currentDate = parseISO(`${value}-01`);
  
  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    onChange(format(newDate, 'yyyy-MM'));
  };
  
  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    onChange(format(newDate, 'yyyy-MM'));
  };
  
  const handleCurrentMonth = () => {
    onChange(format(new Date(), 'yyyy-MM'));
  };
  
  const isCurrentMonth = value === format(new Date(), 'yyyy-MM');
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevMonth}
        aria-label="Previous month"
        className="h-8 w-8"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <button
        onClick={handleCurrentMonth}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg font-display font-semibold text-lg transition-colors focus-ring',
          isCurrentMonth
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-muted'
        )}
      >
        <Calendar className="w-4 h-4" />
        {format(currentDate, 'MMMM yyyy')}
      </button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextMonth}
        aria-label="Next month"
        className="h-8 w-8"
        disabled={isCurrentMonth}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

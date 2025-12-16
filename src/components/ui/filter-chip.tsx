import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function FilterChip({
  label,
  active = false,
  onToggle,
  onRemove,
  icon,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border transition-all focus-ring',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-foreground border-border hover:border-primary/50',
        className
      )}
      aria-pressed={active}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
      {active && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
          aria-label={`Remove ${label} filter`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </button>
  );
}

interface FilterChipGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterChipGroup({ children, className }: FilterChipGroupProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-2',
        className
      )}
      role="group"
      aria-label="Filter options"
    >
      {children}
    </div>
  );
}

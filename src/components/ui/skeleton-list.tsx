import { cn } from '@/lib/utils';

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 5, className }: SkeletonListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </div>
  );
}

function SkeletonItem() {
  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border animate-pulse">
      <div className="w-10 h-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
      <div className="h-5 bg-muted rounded w-16" />
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn('h-48 bg-muted rounded-lg animate-pulse', className)} />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 bg-card rounded-xl border animate-pulse', className)}>
      <div className="h-3 bg-muted rounded w-1/3 mb-3" />
      <div className="h-8 bg-muted rounded w-2/3 mb-2" />
      <div className="h-3 bg-muted rounded w-1/2" />
    </div>
  );
}

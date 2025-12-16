import { cn } from '@/lib/utils';
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  Heart,
  Apple,
  Wallet,
  Laptop,
  TrendingUp,
  Gift,
  MoreHorizontal,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Gamepad2,
  Receipt,
  Heart,
  Apple,
  Wallet,
  Laptop,
  TrendingUp,
  Gift,
  MoreHorizontal,
};

interface CategoryIconProps {
  iconName: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryIcon({
  iconName,
  color,
  size = 'md',
  className,
}: CategoryIconProps) {
  const Icon = iconMap[iconName] || MoreHorizontal;
  
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center',
        {
          'w-8 h-8': size === 'sm',
          'w-10 h-10': size === 'md',
          'w-12 h-12': size === 'lg',
        },
        className
      )}
      style={{ backgroundColor: color ? `${color}20` : undefined }}
    >
      <Icon
        className={cn({
          'w-4 h-4': size === 'sm',
          'w-5 h-5': size === 'md',
          'w-6 h-6': size === 'lg',
        })}
        style={{ color: color || 'currentColor' }}
      />
    </div>
  );
}

import { NavLink } from '@/components/NavLink';
import { Home, PieChart, Target, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/categories', icon: PieChart, label: 'Categories' },
  { to: '/budgets', icon: Target, label: 'Budgets' },
  { to: '/transactions', icon: Receipt, label: 'History' },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t pb-safe md:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className="nav-item"
            activeClassName="nav-item-active"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function DesktopNav() {
  return (
    <nav
      className="hidden md:flex items-center gap-1 bg-muted/50 rounded-lg p-1"
      role="navigation"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-background'
          )}
          activeClassName="bg-background text-foreground shadow-sm"
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

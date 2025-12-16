import { ReactNode } from 'react';
import { BottomNav, DesktopNav } from './BottomNav';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  headerAction?: ReactNode;
  className?: string;
}

export function AppShell({
  children,
  title,
  headerAction,
  className,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b">
        <div className="container max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo / Title */}
            <div className="flex items-center gap-4">
              <h1 className="font-display font-bold text-xl">
                {title || (
                  <span className="text-primary">Easy</span>
                )}
                {!title && <span className="text-foreground"> Finance</span>}
              </h1>
            </div>
            
            {/* Desktop nav */}
            <DesktopNav />
            
            {/* Header action */}
            {headerAction && (
              <div className="hidden md:block">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className={cn('container max-w-5xl mx-auto px-4 py-6 pb-24 md:pb-6', className)}>
        {children}
      </main>
      
      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("relative flex w-full flex-col items-center justify-center rounded-[18px] p-8 md:p-16 text-center transition-all duration-300", className)}>
      <div className="absolute inset-0 rounded-[18px] bg-linear-to-b from-zinc-50/50 to-zinc-100/50 dark:from-zinc-900/30 dark:to-zinc-950/30 ring-1 ring-zinc-200/40 dark:ring-zinc-800/40 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center max-w-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 mb-6">
          <Icon className="h-8 w-8 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
          {description}
        </p>
        
        {action && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

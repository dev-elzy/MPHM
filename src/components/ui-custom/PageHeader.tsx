import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs?: Breadcrumb[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  breadcrumbs,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn(
      'sticky top-0 z-10 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between py-4',
      'bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300',
      className
    )}>
      <div className="flex flex-col gap-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 mb-1">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      i === breadcrumbs.length - 1
                        ? 'text-zinc-700 dark:text-zinc-300 font-medium'
                        : ''
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 mt-3 sm:mt-0 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

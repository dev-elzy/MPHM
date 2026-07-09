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
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-linear-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white p-6 sm:p-7 shadow-xl transition-all duration-300',
        className
      )}
    >
      {/* Decorative subtle ambient accent glow */}
      <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center flex-wrap gap-1.5 text-xs text-zinc-400 mb-1">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-white transition-colors font-medium"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={
                        i === breadcrumbs.length - 1
                          ? 'text-zinc-200 font-semibold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10'
                          : 'text-zinc-400'
                      }
                    >
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            <span className="w-1.5 h-7 rounded-full bg-primary shrink-0 shadow-sm shadow-primary/40" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-none">
              {title}
            </h1>
          </div>

          {description && (
            <p className="text-sm text-zinc-300/90 max-w-2xl leading-relaxed pl-4.5">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 flex-wrap lg:justify-end shrink-0 pt-2 lg:pt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

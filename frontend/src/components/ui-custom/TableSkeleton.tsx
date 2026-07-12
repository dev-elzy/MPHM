import * as React from 'react';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"
            style={{ width: `${[28, 18, 16, 8][i] ?? 12}%` }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 px-4 py-4 border-b border-zinc-100 dark:border-zinc-900 last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-4 rounded-full bg-zinc-100 dark:bg-zinc-800/60 animate-pulse"
              style={{
                width: `${[28, 18, 16, 8][colIdx] ?? 12}%`,
                animationDelay: `${rowIdx * 80 + colIdx * 20}ms`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

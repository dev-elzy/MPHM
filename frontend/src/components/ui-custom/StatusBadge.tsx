import * as React from 'react';
import { cn } from '@/lib/utils';
import { AcademicYearStatus, SemesterStatus } from '@/features/academic-years/types';

type Status = AcademicYearStatus | SemesterStatus;

const STATUS_CONFIG: Record<
  Status,
  { dot: string; badge: string; label: string }
> = {
  // Academic Year statuses
  Active: {
    dot: 'bg-emerald-500',
    badge:
      'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
    label: 'Aktif',
  },
  Draft: {
    dot: 'bg-blue-500',
    badge:
      'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
    label: 'Draft',
  },
  Archived: {
    dot: 'bg-zinc-400',
    badge:
      'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700/30',
    label: 'Arsip',
  },
  // Semester-only status
  Completed: {
    dot: 'bg-zinc-400',
    badge:
      'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700/30',
    label: 'Selesai',
  },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    dot: 'bg-zinc-400',
    badge: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20',
    label: status,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors',
        config.badge,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dot)} />
      {config.label}
    </span>
  );
}

'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface BulkAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

interface BulkToolbarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
  className?: string;
}

export function BulkToolbar({
  selectedCount,
  actions,
  onClearSelection,
  className = '',
}: BulkToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={`flex items-center justify-between gap-4 p-2 px-3 bg-zinc-900 text-white rounded-lg shadow-lg border border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-200 ${className}`}
    >
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md"
        >
          <X className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {selectedCount} data terpilih
        </span>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((action, idx) => {
          let btnClass = 'h-8 text-xs ';
          if (action.variant === 'destructive') {
            btnClass += 'bg-red-600 hover:bg-red-700 text-white';
          } else if (action.variant === 'outline') {
            btnClass += 'border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800';
          } else if (action.variant === 'secondary') {
            btnClass += 'bg-zinc-800 hover:bg-zinc-700 text-white';
          } else {
            btnClass += 'bg-white hover:bg-zinc-100 text-zinc-900';
          }

          return (
            <Button
              key={idx}
              type="button"
              variant={action.variant === 'outline' ? 'outline' : 'default'}
              onClick={action.onClick}
              className={btnClass}
            >
              {action.icon && <span className="mr-1.5">{action.icon}</span>}
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

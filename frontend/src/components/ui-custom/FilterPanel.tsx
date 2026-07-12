'use client';

import * as React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterDefinition {
  key: string;
  label: string;
  type: 'select' | 'text';
  options?: { label: string; value: string }[] | null;
  placeholder?: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  filters: FilterDefinition[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
  className?: string;
}

export function FilterPanel({
  isOpen,
  filters,
  activeFilters,
  onFilterChange,
  onResetFilters,
  className = '',
}: FilterPanelProps) {
  if (!isOpen) return null;

  const activeCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div
      className={`p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Saring Data {activeCount > 0 && `(${activeCount})`}
          </h4>
        </div>
        
        {activeCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-8 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filter
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filters.map((filter) => {
          const val = activeFilters[filter.key] || '';
          
          return (
            <div key={filter.key} className="space-y-1.5 text-left">
              <label className="text-xs font-medium text-zinc-500">
                {filter.label}
              </label>

              {filter.type === 'select' ? (
                <Select
                  value={val}
                  onValueChange={(value) => onFilterChange(filter.key, value === null || value === 'ALL' ? '' : value)}
                >
                  <SelectTrigger className="h-8.5 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm">
                    <SelectValue placeholder={filter.placeholder || `Pilih ${filter.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua {filter.label}</SelectItem>
                    {filter.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder={filter.placeholder || `Ketik ${filter.label}...`}
                    value={val}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    className="h-8.5 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 pr-7 text-sm"
                  />
                  {val && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onFilterChange(filter.key, '')}
                      className="absolute right-1.5 h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-md"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = '',
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-zinc-100 dark:border-zinc-800 ${className}`}>
      {/* Items showing text */}
      <div className="text-sm text-zinc-500 order-2 sm:order-1">
        {totalItems > 0 ? (
          <span>
            Menampilkan <span className="font-medium text-zinc-900 dark:text-zinc-100">{startItem}</span> hingga{' '}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{endItem}</span> dari{' '}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{totalItems}</span> data
          </span>
        ) : (
          <span>Tidak ada data untuk ditampilkan</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
        {/* Limit Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500 whitespace-nowrap">Baris per halaman</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="h-8.5 w-[70px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-0">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100, 250, 500].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-8.5 w-8.5 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8.5 w-8.5 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium px-2">
            Halaman {currentPage} dari {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-8.5 w-8.5 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8.5 w-8.5 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

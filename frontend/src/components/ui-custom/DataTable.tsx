'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative rounded-[18px] shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-zinc-200/10 dark:hover:shadow-zinc-900/30">
      <div className="absolute inset-0 rounded-[18px] bg-linear-to-br from-zinc-200/50 via-transparent to-zinc-100/50 dark:from-zinc-800/30 dark:via-transparent dark:to-zinc-900/30 opacity-30 blur-[2px] pointer-events-none" />
      <div className="absolute inset-px rounded-[17px] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl ring-1 ring-zinc-200/40 dark:ring-zinc-800/40 pointer-events-none" />
      
      <div className="relative z-10 overflow-hidden rounded-[17px]">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-200/40 dark:border-zinc-800/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-11 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Tidak ada data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>
    </div>
  );
}

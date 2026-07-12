'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { AcademicYear } from '../types';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AcademicYearsTableProps {
  data: AcademicYear[];
  onEdit: (item: AcademicYear) => void;
  onDelete: (item: AcademicYear) => void;
  onActivate: (item: AcademicYear) => void;
}

export function AcademicYearsTable({ data, onEdit, onDelete, onActivate }: AcademicYearsTableProps) {
  const columns: ColumnDef<AcademicYear>[] = [
    {
      accessorKey: 'name',
      header: 'Tahun Ajaran',
      cell: ({ row }) => {
        const start = new Date(row.original.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const end = new Date(row.original.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{row.getValue('name')}</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{start} – {end}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('status')} />
      ),
    },
    {
      accessorKey: 'semesters',
      header: 'Semester',
      cell: ({ row }) => {
        const semesters = row.original.semesters;
        const active = semesters.filter(s => s.status === 'Active').length;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{semesters.length} Semester</span>
            {active > 0 && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400">{active} aktif</span>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const item = row.original;
        const isActive = item.status === 'Active';

        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 transition-colors">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
              <DropdownMenuLabel className="font-medium text-xs text-zinc-500 uppercase tracking-wider">Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer gap-2">
                <Edit className="h-3.5 w-3.5 text-zinc-500" />
                Edit
              </DropdownMenuItem>
              {!isActive && (
                <DropdownMenuItem onClick={() => onActivate(item)} className="cursor-pointer gap-2 text-emerald-600 dark:text-emerald-400 focus:text-emerald-600 dark:focus:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Jadikan Aktif
                </DropdownMenuItem>
              )}
              {!isActive && (
                <DropdownMenuItem
                  onClick={() => onDelete(item)}
                  className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950 dark:text-red-400 dark:focus:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}

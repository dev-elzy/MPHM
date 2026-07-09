'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, MoreHorizontal, Trash2, CheckCircle2 } from 'lucide-react';
import { Semester } from '../types';
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

interface SemesterTableProps {
  data: Semester[];
  onEdit: (semester: Semester) => void;
  onDelete: (semester: Semester) => void;
  onActivate: (semester: Semester) => void;
}

export function SemesterTable({ data, onEdit, onDelete, onActivate }: SemesterTableProps) {
  const columns: ColumnDef<Semester>[] = [
    {
      accessorKey: 'name',
      header: 'Nama Semester',
      cell: ({ row }) => (
        <div className="font-medium text-zinc-900 dark:text-zinc-100">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Tanggal Mulai',
      cell: ({ row }) => {
        const date = new Date(row.original.startDate);
        return (
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        );
      },
    },
    {
      accessorKey: 'endDate',
      header: 'Tanggal Selesai',
      cell: ({ row }) => {
        const date = new Date(row.original.endDate);
        return (
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const semester = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 transition-colors">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
              <DropdownMenuLabel className="font-medium text-xs text-zinc-500 uppercase tracking-wider">Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(semester)} className="cursor-pointer gap-2">
                <Edit2 className="h-3.5 w-3.5 text-zinc-500" /> Edit
              </DropdownMenuItem>
              {semester.status !== 'Active' && (
                <DropdownMenuItem
                  onClick={() => onActivate(semester)}
                  className="cursor-pointer gap-2 text-emerald-600 dark:text-emerald-400 focus:text-emerald-600 dark:focus:text-emerald-400"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Set Aktif
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(semester)}
                className="cursor-pointer gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}

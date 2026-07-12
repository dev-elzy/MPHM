'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, MoreHorizontal, Trash2, Users, BookOpen } from 'lucide-react';
import { Class } from '../types';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { useCurriculumLookup, useMustahiqLookup } from '../queries';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClassTableProps {
  data: Class[];
  onEdit: (item: Class) => void;
  onDelete: (item: Class) => void;
}

export function ClassTable({ data, onEdit, onDelete }: ClassTableProps) {
  const { data: curriculums } = useCurriculumLookup();
  const { data: mustahiqs } = useMustahiqLookup();

  const getCurriculumName = (id: string) => curriculums?.find(c => c.id === id)?.name || '-';
  const getMustahiqName = (id?: string) => {
    if (!id || id === 'none') return '-';
    return mustahiqs?.find(m => m.id === id)?.name || '-';
  };

  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: 'name',
      header: 'Nama Kelas',
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{row.original.name}</span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {row.original.jenjang} - {row.original.tingkat}
            </span>
          </div>
        );
      },
    },
    {
      id: 'mustahiq',
      header: 'Wali Kelas',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {getMustahiqName(row.original.mustahiqId)}
        </span>
      ),
    },
    {
      accessorKey: 'studentCount',
      header: 'Santri',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 text-sm">
          <Users className="h-4 w-4" />
          <span>{row.original.studentCount}</span>
        </div>
      ),
    },
    {
      accessorKey: 'curriculumId',
      header: 'Kurikulum',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 text-sm">
          <BookOpen className="h-4 w-4" />
          <span className="truncate max-w-[150px]" title={getCurriculumName(row.original.curriculumId)}>
            {getCurriculumName(row.original.curriculumId)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }) => <StatusBadge status={row.original.status as any} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const item = row.original;

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
                <Edit2 className="h-3.5 w-3.5 text-zinc-500" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item)}
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

'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataGrid } from '@/components/ui-custom/DataGrid';
import { usePromotions } from '@/features/promotions/queries/usePromotions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PromotionsPage() {
  const { data, isLoading } = usePromotions();

  const columns: ColumnDef<Record<string, unknown>>[] = [
    {
      accessorKey: 'academicYearFromId',
      header: 'Tahun Asal',
    },
    {
      accessorKey: 'academicYearToId',
      header: 'Tahun Tujuan',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className="capitalize px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs font-medium">
          {row.getValue('status')}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Kenaikan Kelas (Promosi)"
        description="Kelola proses kenaikan kelas, evaluasi nilai, dan riwayat akademik santri."
        actions={
          <Button className="gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
            <Plus className="h-4 w-4" /> Buka Periode Baru
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        <DataGrid
          data={data || []}
          columns={columns as ColumnDef<unknown, unknown>[]}
          totalItems={data?.length || 0}
          currentPage={1}
          itemsPerPage={25}
          onPageChange={() => {}}
          onItemsPerPageChange={() => {}}
          isLoading={isLoading}
          searchPlaceholder="Cari periode..."
          emptyTitle="Belum Ada Periode Promosi"
          emptyDescription="Silakan buat periode baru untuk memulai proses kenaikan kelas."
        />
      </div>
    </div>
  );
}

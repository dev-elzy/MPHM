'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Clock } from 'lucide-react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataGrid } from '@/components/ui-custom/DataGrid';

interface AuditLog {
  id: string;
  module: string;
  action: string;
  userId: string;
  userName: string | null;
  createdAt: number;
}

const MODULE_COLORS: Record<string, string> = {
  students: 'bg-blue-50 text-blue-700',
  users: 'bg-purple-50 text-purple-700',
  classes: 'bg-emerald-50 text-emerald-700',
  'academic-years': 'bg-amber-50 text-amber-700',
  scores: 'bg-rose-50 text-rose-700',
  attendance: 'bg-cyan-50 text-cyan-700',
};

const ACTION_LABELS: Record<string, string> = {
  create: 'Tambah',
  update: 'Ubah',
  delete: 'Hapus',
  login: 'Login',
  logout: 'Logout',
  finalize: 'Finalisasi',
  import: 'Impor',
  export: 'Ekspor',
};

function useAuditLogs(params: { module?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params.module) sp.append('module', params.module);
      if (params.page) sp.append('page', String(params.page));
      if (params.limit) sp.append('limit', String(params.limit));
      const res = await fetch(`/api/v1/audit-logs?${sp.toString()}`);
      if (!res.ok) throw new Error('Gagal mengambil audit log');
      const data = (await res.json()) as { data?: { items?: AuditLog[]; meta?: { totalItems?: number } } };
      return { items: data.data?.items || [], total: data.data?.meta?.totalItems || 0 };
    },
  });
}

export default function AuditPage() {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(25);
  const [moduleFilter, setModuleFilter] = React.useState('');

  const { data, isLoading } = useAuditLogs({ module: moduleFilter || undefined, page, limit });

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Waktu',
      cell: ({ row }) => {
        const ts = row.getValue('createdAt') as number;
        const d = new Date(ts * 1000);
        return (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} {d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'module',
      header: 'Modul',
      cell: ({ row }) => {
        const mod = row.getValue('module') as string;
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${MODULE_COLORS[mod] || 'bg-zinc-100 text-zinc-600'}`}>
            {mod}
          </span>
        );
      },
    },
    {
      accessorKey: 'action',
      header: 'Aksi',
      cell: ({ row }) => {
        const action = row.getValue('action') as string;
        return <span className="text-xs text-zinc-700 dark:text-zinc-300">{ACTION_LABELS[action] || action}</span>;
      },
    },
    {
      accessorKey: 'userName',
      header: 'Pengguna',
      cell: ({ row }) => (
        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
          {row.getValue('userName') || row.original.userId}
        </span>
      ),
    },
  ];

  const modules = ['students', 'users', 'classes', 'academic-years', 'scores', 'attendance'];

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Audit Log"
        description="Riwayat aktivitas sistem yang tidak dapat diubah — seluruh aksi pengguna tercatat secara otomatis."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { setModuleFilter(''); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!moduleFilter ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}
            >
              Semua
            </button>
            {modules.map((m) => (
              <button
                key={m}
                onClick={() => { setModuleFilter(m); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${moduleFilter === m ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}
              >
                {m}
              </button>
            ))}
          </div>
        }
      />

      <DataGrid
        data={data?.items || []}
        columns={columns as ColumnDef<unknown, unknown>[]}
        totalItems={data?.total || 0}
        currentPage={page}
        itemsPerPage={limit}
        onPageChange={setPage}
        onItemsPerPageChange={setLimit}
        isLoading={isLoading}
        searchPlaceholder="Cari audit log..."
        emptyTitle="Belum Ada Aktivitas"
        emptyDescription="Aktivitas sistem akan tercatat di sini secara otomatis."
      />
    </div>
  );
}

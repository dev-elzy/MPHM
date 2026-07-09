'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { DataGrid } from '@/components/ui-custom/DataGrid';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { ImportDialog } from '@/components/ui-custom/ImportDialog';

import { User } from '@/features/users/types';
import { useUsers } from '@/features/users/queries/useUsers';
import { useDeleteUser } from '@/features/users/mutations';
import { UserFormDialog } from '@/features/users/components/UserFormDialog';
import { parseExcelFile } from '@/lib/excel/builder';
import { downloadExcelTemplate, USER_TEMPLATE_COLUMNS } from '@/lib/excel/templates';
import { usersService } from '@/features/users/services/users.service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function PenggunaPage() {
  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(25);

  const { data: usersData, isLoading } = useUsers(search);
  const deleteMutation = useDeleteUser();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<User | undefined>(undefined);
  const [deleteConfirmItem, setDeleteConfirmItem] = React.useState<User | null>(null);

  // Excel Import/Export states
  const qc = useQueryClient();
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [importedRows, setImportedRows] = React.useState<Omit<User, 'id' | 'status' | 'createdAt' | 'updatedAt'>[]>([]);

  const paginatedUsers = React.useMemo(() => {
    if (!usersData) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return usersData.slice(start, start + itemsPerPage);
  }, [usersData, currentPage, itemsPerPage]);

  const handleCreate = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: User) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmItem) return;
    await deleteMutation.mutateAsync(deleteConfirmItem.id);
    setDeleteConfirmItem(null);
  };

  const handleUploadFile = async (file: File) => {
    const keys = USER_TEMPLATE_COLUMNS.map((c) => c.key);
    const rawRows = await parseExcelFile(file, keys);
    if (rawRows.length === 0) {
      throw new Error('File Excel kosong atau format header tidak sesuai template.');
    }

    const rows: Omit<User, 'id' | 'status' | 'createdAt' | 'updatedAt'>[] = rawRows.map((r) => {
      const rl = (r.role?.toLowerCase() || '') as 'admin' | 'operator' | 'mustahiq' | 'mudir';
      const role = ['admin', 'operator', 'mustahiq', 'mudir'].includes(rl) ? rl : 'operator';
      return {
        name: r.name || '',
        email: r.email || '',
        password: r.password || '123456',
        role,
        phone: r.phone || null,
      };
    });

    setImportedRows(rows);

    return {
      total: rows.length,
      valid: rows.length,
      errorsCount: 0,
      duplicatesCount: 0,
      previewRows: rows.map((item, idx) => ({
        'No Baris': idx + 2,
        'Nama Lengkap': item.name,
        'Email': item.email,
        'Role': item.role,
      })),
      errorsList: [],
    };
  };

  const handleExecuteImport = async () => {
    if (importedRows.length === 0) return;
    await usersService.importConfirm(importedRows);
    qc.invalidateQueries({ queryKey: ['users'] });
    toast.success('Pengguna berhasil diimpor');
    setIsImportOpen(false);
  };

  const handleExport = () => {
    const dataList = usersData || [];
    let csvContent = 'Nama Lengkap,Email,Role,No HP,Status\n';
    dataList.forEach((u) => {
      csvContent += `"${u.name}","${u.email}","${u.role}","${u.phone || ''}","${u.status}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data_pengguna.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Pengguna',
      cell: ({ row }) => (
        <div className="flex items-center gap-3 text-left">
          <div className="h-9 w-9 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 shadow-inner">
            {row.original.name ? row.original.name.slice(0, 2).toUpperCase() : 'US'}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">{row.original.name}</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Hak Akses (Role)',
      cell: ({ row }) => {
        const val = row.getValue('role') as string;
        const label =
          val === 'super_admin'
            ? 'Super Admin'
            : val === 'admin'
            ? 'Administrator'
            : val === 'operator'
            ? 'Operator Akademik'
            : val === 'mustahiq'
            ? 'Mustahiq / Guru'
            : 'Mudir';
        return (
          <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-full text-xs font-semibold border border-zinc-200/60 dark:border-zinc-700">
            {label}
          </span>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'No HP / WhatsApp',
      cell: ({ row }) => (
        <span className="text-sm text-zinc-600 dark:text-zinc-400">{row.getValue('phone') || '-'}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status Akun',
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('status') === 'active' ? 'Active' : 'Draft'} />
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
            className="h-8 px-3 rounded-full text-xs font-medium border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer shadow-none"
          >
            Lihat / Edit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteConfirmItem(row.original)}
            className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        breadcrumbs={[
          { label: 'Pengaturan', href: '/dashboard' },
          { label: 'Pengguna' },
        ]}
        title="Manajemen Pengguna"
        description="Kelola akun pengguna sistem, wali kelas, operator, dan pengatur hak akses pesantren."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportOpen(true)}
              className="h-9.5 text-xs border-zinc-200 dark:border-zinc-800 gap-1.5 rounded-lg"
            >
              <Upload className="h-3.5 w-3.5" /> Impor Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-9.5 text-xs border-zinc-200 dark:border-zinc-800 gap-1.5 rounded-lg"
            >
              <Download className="h-3.5 w-3.5" /> Ekspor Excel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg shadow-sm transition-all h-9.5 text-xs font-semibold gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Pengguna
            </Button>
          </div>
        }
      />

      <Card className="p-5 border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
        <DataGrid
          data={paginatedUsers}
          columns={columns}
          totalItems={usersData?.length || 0}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          searchQuery={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Cari pengguna..."
          isLoading={isLoading}
          emptyTitle="Belum Ada Pengguna"
          emptyDescription="Silakan daftarkan pengguna baru dengan menekan tombol Tambah Pengguna di atas."
        />
      </Card>

      <UserFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} initialData={editingItem} />

      <ConfirmDialog
        open={!!deleteConfirmItem}
        onOpenChange={(open) => !open && setDeleteConfirmItem(null)}
        variant="danger"
        title="Hapus Akun Pengguna?"
        description={
          <>
            Akun <strong>{deleteConfirmItem?.name}</strong> akan dinonaktifkan (Soft Delete).
            Pengguna tersebut tidak akan bisa login kembali ke sistem dashboard.
          </>
        }
        confirmLabel={deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Impor Massal Pengguna"
        moduleName="Pengguna"
        onDownloadTemplate={() => downloadExcelTemplate('user')}
        onUploadFile={handleUploadFile}
        onExecuteImport={handleExecuteImport}
      />
    </div>
  );
}

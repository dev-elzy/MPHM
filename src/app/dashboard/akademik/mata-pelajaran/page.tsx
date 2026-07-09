'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2, Upload, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { DataGrid } from '@/components/ui-custom/DataGrid';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { ImportDialog } from '@/components/ui-custom/ImportDialog';
import { useSubjects } from '@/features/subjects/queries/useSubjects';
import { useDeleteSubject } from '@/features/subjects/mutations';
import { SubjectFormDialog } from '@/features/subjects/components/SubjectFormDialog';
import { Subject } from '@/features/curriculums/types';
import { parseExcelFile } from '@/lib/excel/builder';
import { downloadExcelTemplate, MAPEL_TEMPLATE_COLUMNS } from '@/lib/excel/templates';
import { subjectsService } from '@/features/subjects/services/subjects.service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function MataPelajaranPage() {
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(25);

  const { data: rawSubjects, isLoading, isError } = useSubjects();
  const deleteMutation = useDeleteSubject();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Subject | undefined>(undefined);
  const [deleteConfirmItem, setDeleteConfirmItem] = React.useState<Subject | null>(null);
  
  // Excel Import/Export states
  const qc = useQueryClient();
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [importedRows, setImportedRows] = React.useState<Omit<Subject, 'id' | 'status' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>[]>([]);

  // Client side filtering for this view (since we fetched 100 limit, client-side filters on search/category makes it lightning fast!)
  const filteredSubjects = React.useMemo(() => {
    if (!rawSubjects) return [];
    return rawSubjects.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        (s.arabicName && s.arabicName.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = activeCategory ? s.category === activeCategory : true;

      return matchesSearch && matchesCategory;
    });
  }, [rawSubjects, search, activeCategory]);

  const paginatedSubjects = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubjects.slice(start, start + itemsPerPage);
  }, [filteredSubjects, currentPage, itemsPerPage]);

  const handleCreate = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: Subject) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmItem) return;
    await deleteMutation.mutateAsync(deleteConfirmItem.id);
    setDeleteConfirmItem(null);
  };

  const handleUploadFile = async (file: File) => {
    const keys = MAPEL_TEMPLATE_COLUMNS.map((c) => c.key);
    const rawRows = await parseExcelFile(file, keys);
    if (rawRows.length === 0) {
      throw new Error('File Excel kosong atau format header tidak sesuai template.');
    }

    const rows: Omit<Subject, 'id' | 'status' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>[] = rawRows.map((r) => {
      const cat = r.category as 'KMI' | 'Kepesantrenan' | 'Tahfidz' | 'Umum';
      return {
        code: r.code || '',
        name: r.name || '',
        arabicName: r.arabicName || undefined,
        category: ['KMI', 'Kepesantrenan', 'Tahfidz', 'Umum'].includes(cat) ? cat : 'KMI',
        description: r.description || undefined,
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
        'Kode': item.code,
        'Nama Pelajaran': item.name,
        'Kategori': item.category,
      })),
      errorsList: [],
    };
  };

  const handleExecuteImport = async () => {
    if (importedRows.length === 0) return;
    await subjectsService.importConfirm(importedRows);
    qc.invalidateQueries({ queryKey: ['subjects'] });
    toast.success('Mata pelajaran berhasil diimpor');
    setIsImportOpen(false);
  };

  const handleExport = () => {
    const dataList = filteredSubjects;
    let csvContent = 'Kode Pelajaran,Nama Pelajaran,Nama Arab,Kategori,Deskripsi\n';
    dataList.forEach((s) => {
      csvContent += `"${s.code}","${s.name}","${s.arabicName || ''}","${s.category}","${s.description || ''}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data_mata_pelajaran.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: 'code',
      header: 'Kode',
      cell: ({ row }) => (
        <code className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 rounded font-mono text-xs">
          {row.getValue('code')}
        </code>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Mata Pelajaran',
      cell: ({ row }) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">{row.original.name}</span>
          {row.original.description && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{row.original.description}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'arabicName',
      header: 'Nama Arab',
      cell: ({ row }) => (
        <span className="font-medium text-zinc-800 dark:text-zinc-300 font-arabic text-base" dir="rtl">
          {row.getValue('arabicName') || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Kategori',
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md bg-zinc-50 dark:bg-zinc-900/50 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 ring-1 ring-inset ring-zinc-500/10">
          {row.getValue('category')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('status') === 'active' ? 'Active' : 'Draft'} />,
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 rounded-lg cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
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

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Gagal memuat data Mata Pelajaran.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        breadcrumbs={[
          { label: 'Akademik', href: '/dashboard/akademik' },
          { label: 'Mata Pelajaran' },
        ]}
        title="Mata Pelajaran"
        description="Kelola kurikulum pengajaran pondok, mata pelajaran syari'ah, bahasa, dan umum."
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
              size="sm"
              onClick={handleCreate}
              className="h-9.5 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 gap-1.5 rounded-lg font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Pelajaran
            </Button>
          </div>
        }
      />

      <Card className="p-5 border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
        <DataGrid
          data={paginatedSubjects}
          columns={columns}
          totalItems={filteredSubjects.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          searchQuery={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Cari kode atau nama pelajaran..."
          filters={[
            {
              key: 'category',
              label: 'Kategori Pelajaran',
              type: 'select',
              placeholder: 'Semua Kategori',
              options: [
                { label: 'KMI (Madrasah)', value: 'KMI' },
                { label: 'Kepesantrenan', value: 'Kepesantrenan' },
                { label: 'Tahfidz', value: 'Tahfidz' },
                { label: 'Umum', value: 'Umum' },
              ],
            },
          ]}
          activeFilters={{ category: activeCategory }}
          onFilterChange={(_, val) => {
            setActiveCategory(val);
            setCurrentPage(1);
          }}
          onResetFilters={() => {
            setActiveCategory('');
            setCurrentPage(1);
          }}
          isLoading={isLoading}
          emptyTitle="Belum Ada Pelajaran"
          emptyDescription="Mata Pelajaran kosong. Klik tombol Tambah Pelajaran di atas untuk memasukkan data pelajaran baru."
        />
      </Card>

      <SubjectFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingItem}
      />

      <ConfirmDialog
        open={!!deleteConfirmItem}
        onOpenChange={(open) => !open && setDeleteConfirmItem(null)}
        variant="danger"
        title="Hapus Mata Pelajaran?"
        description={
          <>
            Pelajaran <strong>{deleteConfirmItem?.name}</strong> akan dipindahkan ke Recycle Bin.
            Pelajaran tidak dapat dihapus jika masih terikat dalam struktur Kurikulum aktif.
          </>
        }
        confirmLabel={deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Impor Massal Pelajaran"
        moduleName="Mata Pelajaran"
        onDownloadTemplate={() => downloadExcelTemplate('mapel')}
        onUploadFile={handleUploadFile}
        onExecuteImport={handleExecuteImport}
      />
    </div>
  );
}

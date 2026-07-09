'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { DataGrid } from '@/components/ui-custom/DataGrid';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { YearSelector } from '@/features/academic-years/components/YearSelector';
import { useAcademicYears } from '@/features/academic-years/queries/useAcademicYears';
import { useCurriculums } from '@/features/curriculums/queries/useCurriculums';
import { useDeleteCurriculum } from '@/features/curriculums/mutations';
import { CurriculumFormDialog } from '@/features/curriculums/components/CurriculumFormDialog';
import { CurriculumSubjectsDialog } from '@/features/curriculums/components/CurriculumSubjectsDialog';
import { Curriculum } from '@/features/curriculums/types';

export default function KurikulumPage() {
  const [selectedYearId, setSelectedYearId] = React.useState<string>('');
  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(25);

  const { data: years, isLoading: isLoadingYears } = useAcademicYears();
  const { data: rawCurriculums, isLoading: isLoadingCurriculums } = useCurriculums(selectedYearId);
  const deleteMutation = useDeleteCurriculum();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Curriculum | undefined>(undefined);
  const [deleteConfirmItem, setDeleteConfirmItem] = React.useState<Curriculum | null>(null);

  // Curriculum Link Subject dialog
  const [subjectsConfigItem, setSubjectsConfigItem] = React.useState<Curriculum | null>(null);

  const selectedYear = React.useMemo(
    () => years?.find((y) => y.id === selectedYearId),
    [years, selectedYearId]
  );

  // Client search filter
  const filteredCurriculums = React.useMemo(() => {
    if (!rawCurriculums) return [];
    return rawCurriculums.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [rawCurriculums, search]);

  const paginatedCurriculums = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCurriculums.slice(start, start + itemsPerPage);
  }, [filteredCurriculums, currentPage, itemsPerPage]);

  const handleCreate = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: Curriculum) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmItem) return;
    await deleteMutation.mutateAsync(deleteConfirmItem.id);
    setDeleteConfirmItem(null);
  };

  const columns: ColumnDef<Curriculum>[] = [
    {
      accessorKey: 'name',
      header: 'Kurikulum',
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
      accessorKey: 'academicYearName',
      header: 'Tahun Ajaran',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-350">
          {row.getValue('academicYearName')}
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
            variant="outline"
            size="sm"
            onClick={() => setSubjectsConfigItem(row.original)}
            className="h-8 text-xs flex items-center gap-1.5 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#C9A050]" />
            Atur Pelajaran
          </Button>
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

  if (!isLoadingYears && (!years || years.length === 0)) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: 'Akademik', href: '/dashboard/akademik' },
            { label: 'Kurikulum' },
          ]}
          title="Manajemen Kurikulum"
          description="Kerangka mata pelajaran dan aturan kelulusan KKM santri."
        />
        <ConfirmDialog
          open={true}
          onOpenChange={() => {}}
          variant="info"
          title="Tahun Ajaran Kosong"
          description="Buat Tahun Ajaran terlebih dahulu untuk mendefinisikan Kurikulum."
          confirmLabel="Buat Tahun Ajaran"
          onConfirm={() => window.location.assign('/dashboard/akademik/tahun-ajaran')}
        />
      </div>
    );
  }

  const isLoading = isLoadingYears || isLoadingCurriculums;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        breadcrumbs={[
          { label: 'Akademik', href: '/dashboard/akademik' },
          { label: 'Kurikulum' },
        ]}
        title="Manajemen Kurikulum"
        description="Kerangka kurikulum per tahun ajaran untuk mendefinisikan mata pelajaran pengajaran santri."
        actions={
          <div className="flex items-center gap-3">
            <YearSelector value={selectedYearId} onChange={setSelectedYearId} />
            {selectedYearId && (
              <Button
                onClick={handleCreate}
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg shadow-sm transition-all h-9.5 text-xs font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" /> Tambah Kurikulum
              </Button>
            )}
          </div>
        }
      />

      <Card className="p-5 border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
        <DataGrid
          data={paginatedCurriculums}
          columns={columns}
          totalItems={filteredCurriculums.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          searchQuery={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Cari kurikulum..."
          isLoading={isLoading}
          emptyTitle="Belum Ada Kurikulum"
          emptyDescription={
            selectedYearId
              ? `Tahun ajaran ${selectedYear?.name} belum memiliki kurikulum. Klik tombol Tambah Kurikulum di atas.`
              : 'Pilih Tahun Ajaran terlebih dahulu untuk memunculkan daftar kurikulum.'
          }
        />
      </Card>

      <CurriculumFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingItem}
        defaultAcademicYearId={selectedYearId}
      />

      {subjectsConfigItem && (
        <CurriculumSubjectsDialog
          open={!!subjectsConfigItem}
          onOpenChange={(open) => !open && setSubjectsConfigItem(null)}
          curriculumId={subjectsConfigItem.id}
          curriculumName={subjectsConfigItem.name}
        />
      )}

      <ConfirmDialog
        open={!!deleteConfirmItem}
        onOpenChange={(open) => !open && setDeleteConfirmItem(null)}
        variant="danger"
        title="Hapus Kurikulum?"
        description={
          <>
            Kurikulum <strong>{deleteConfirmItem?.name}</strong> akan dipindahkan ke Recycle Bin.
            Kurikulum tidak dapat dihapus jika masih digunakan oleh kelas rombel santri.
          </>
        }
        confirmLabel={deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

'use client';

import * as React from 'react';
import { Plus, GraduationCap, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Semester } from '@/features/academic-years/types';
import { useAcademicYears } from '@/features/academic-years/queries/useAcademicYears';
import { useSemesters } from '@/features/academic-years/queries/useSemesters';
import { useUpdateSemester, useDeleteSemester } from '@/features/academic-years/mutations';
import { SemesterTable } from '@/features/academic-years/components/SemesterTable';
import { SemesterFormDialog } from '@/features/academic-years/components/SemesterFormDialog';
import { YearSelector } from '@/features/academic-years/components/YearSelector';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { TableSkeleton } from '@/components/ui-custom/TableSkeleton';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';

export default function SemesterPage() {
  const router = useRouter();
  const [selectedYearId, setSelectedYearId] = React.useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingSemester, setEditingSemester] = React.useState<Semester | undefined>();
  const [deleteItem, setDeleteItem] = React.useState<Semester | null>(null);
  const [activateItem, setActivateItem] = React.useState<Semester | null>(null);

  const { data: years, isLoading: isLoadingYears } = useAcademicYears();
  const { data: semesters, isLoading: isLoadingSemesters } = useSemesters(selectedYearId);

  const updateMutation = useUpdateSemester();
  const deleteMutation = useDeleteSemester();

  const selectedYear = React.useMemo(
    () => years?.find((y) => y.id === selectedYearId),
    [years, selectedYearId]
  );

  const handleEdit = (semester: Semester) => {
    setEditingSemester(semester);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingSemester(undefined);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(
      { id: deleteItem.id, academicYearId: deleteItem.academicYearId },
      { onSuccess: () => setDeleteItem(null) }
    );
  };

  const handleConfirmActivate = () => {
    if (!activateItem) return;
    updateMutation.mutate(
      {
        id: activateItem.id,
        data: {
          academicYearId: activateItem.academicYearId,
          name: activateItem.name,
          startDate: activateItem.startDate,
          endDate: activateItem.endDate,
          status: 'Active',
        },
      },
      { onSuccess: () => setActivateItem(null) }
    );
  };

  // No academic years yet – redirect CTA
  if (!isLoadingYears && (!years || years.length === 0)) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: 'Akademik', href: '/dashboard/akademik' },
            { label: 'Semester' },
          ]}
          title="Manajemen Semester"
          description="Kelola data semester untuk setiap tahun ajaran."
        />
        <EmptyState
          icon={GraduationCap}
          title="Belum ada Tahun Ajaran"
          description="Anda harus membuat Tahun Ajaran terlebih dahulu sebelum dapat mengelola Semester."
          action={
            <Button
              onClick={() => router.push('/dashboard/akademik/tahun-ajaran')}
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Ke Manajemen Tahun Ajaran
            </Button>
          }
        />
      </div>
    );
  }

  const isLoading = isLoadingSemesters || isLoadingYears;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader
        breadcrumbs={[
          { label: 'Akademik', href: '/dashboard/akademik' },
          { label: 'Semester' },
        ]}
        title="Manajemen Semester"
        description="Kelola data semester berdasarkan Tahun Ajaran aktif."
        actions={
          <div className="flex items-center gap-3">
            <YearSelector value={selectedYearId} onChange={setSelectedYearId} />
            {selectedYearId && (
              <Button
                onClick={handleCreate}
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg shadow-sm transition-all"
              >
                <Plus className="mr-2 h-4 w-4" /> Tambah Semester
              </Button>
            )}
          </div>
        }
      />

      <Card className="p-0 overflow-hidden border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
        {isLoading ? (
          <TableSkeleton rows={4} columns={5} />
        ) : !semesters || semesters.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Belum ada Semester"
            description={`Tahun Ajaran ${selectedYear?.name ?? ''} belum memiliki data semester. Silakan buat semester pertama.`}
            action={
              selectedYearId ? (
                <Button
                  onClick={handleCreate}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <Plus className="mr-2 h-4 w-4" /> Buat Semester Pertama
                </Button>
              ) : undefined
            }
          />
        ) : (
          <SemesterTable
            data={semesters}
            onEdit={handleEdit}
            onDelete={setDeleteItem}
            onActivate={setActivateItem}
          />
        )}
      </Card>

      {/* Form Dialog */}
      {selectedYearId && (
        <SemesterFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          academicYearId={selectedYearId}
          parentYear={selectedYear}
          initialData={editingSemester}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        variant="danger"
        title="Hapus Semester?"
        description={
          <>
            Semester <strong>{deleteItem?.name}</strong> akan dihapus secara permanen. Tindakan ini
            tidak dapat dibatalkan.
          </>
        }
        confirmLabel="Ya, Hapus"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />

      {/* Activate Confirmation */}
      <ConfirmDialog
        open={!!activateItem}
        onOpenChange={(open) => !open && setActivateItem(null)}
        variant="info"
        title="Aktifkan Semester?"
        description={
          <>
            Mengaktifkan <strong>{activateItem?.name}</strong> akan otomatis mengubah semester aktif
            lainnya di Tahun Ajaran ini menjadi <em>Selesai</em>. Lanjutkan?
          </>
        }
        confirmLabel="Ya, Aktifkan"
        isLoading={updateMutation.isPending}
        onConfirm={handleConfirmActivate}
      />
    </div>
  );
}

'use client';

import * as React from 'react';
import { Plus, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { TableSkeleton } from '@/components/ui-custom/TableSkeleton';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { useAcademicYears } from '@/features/academic-years/queries/useAcademicYears';
import { useDeleteAcademicYear, useUpdateAcademicYear } from '@/features/academic-years/mutations';
import { AcademicYearsTable } from '@/features/academic-years/components/AcademicYearsTable';
import { AcademicYearFormDialog } from '@/features/academic-years/components/AcademicYearFormDialog';
import { AcademicYear } from '@/features/academic-years/types';

export default function AcademicYearsPage() {
  const { data: academicYears, isLoading, isError } = useAcademicYears();
  const deleteMutation = useDeleteAcademicYear();
  const updateMutation = useUpdateAcademicYear();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AcademicYear | undefined>(undefined);
  const [deleteConfirmItem, setDeleteConfirmItem] = React.useState<AcademicYear | null>(null);
  const [activateConfirmItem, setActivateConfirmItem] = React.useState<AcademicYear | null>(null);

  const handleCreate = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: AcademicYear) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmItem) return;
    await deleteMutation.mutateAsync(deleteConfirmItem.id);
    setDeleteConfirmItem(null);
  };

  const handleActivate = async () => {
    if (!activateConfirmItem) return;
    await updateMutation.mutateAsync({
      id: activateConfirmItem.id,
      data: {
        name: activateConfirmItem.name,
        startDate: activateConfirmItem.startDate,
        endDate: activateConfirmItem.endDate,
        status: 'Active',
        semesters: activateConfirmItem.semesters,
      },
    });
    setActivateConfirmItem(null);
  };

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Gagal memuat data Tahun Ajaran.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  const hasData = academicYears && academicYears.length > 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader
        breadcrumbs={[
          { label: 'Akademik', href: '/dashboard/akademik' },
          { label: 'Tahun Ajaran' },
        ]}
        title="Tahun Ajaran"
        description="Kelola periode akademik, semester, dan waktu aktif pembelajaran."
        actions={
          <Button
            onClick={handleCreate}
            className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition-all rounded-lg"
          >
            <Plus className="mr-2 h-4 w-4" /> Tahun Ajaran Baru
          </Button>
        }
      />

      <Card className="p-0 overflow-hidden border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
        {isLoading ? (
          <TableSkeleton rows={4} columns={4} />
        ) : !hasData ? (
          <EmptyState
            icon={CalendarDays}
            title="Belum Ada Tahun Ajaran"
            description="Tahun Ajaran adalah fondasi dari seluruh sistem akademik MPHM. Buat tahun ajaran pertama Anda untuk mulai mengelola kelas, guru, dan santri."
            action={
              <Button
                onClick={handleCreate}
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition-all"
              >
                <Plus className="mr-2 h-4 w-4" /> Buat Tahun Ajaran Pertama
              </Button>
            }
          />
        ) : (
          <AcademicYearsTable
            data={academicYears}
            onEdit={handleEdit}
            onDelete={setDeleteConfirmItem}
            onActivate={setActivateConfirmItem}
          />
        )}
      </Card>

      {/* Form Dialog */}
      <AcademicYearFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingItem}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirmItem}
        onOpenChange={(open) => !open && setDeleteConfirmItem(null)}
        variant="danger"
        title="Hapus Tahun Ajaran?"
        description={
          <>
            Tahun Ajaran <strong>{deleteConfirmItem?.name}</strong> akan dipindahkan ke Recycle Bin.
            Data yang terhubung (kelas, nilai, santri) akan disembunyikan. Tindakan ini dapat
            dibatalkan dalam 24 jam.
          </>
        }
        confirmLabel={deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

      {/* Activate Confirmation */}
      <ConfirmDialog
        open={!!activateConfirmItem}
        onOpenChange={(open) => !open && setActivateConfirmItem(null)}
        variant="info"
        title="Aktifkan Tahun Ajaran?"
        description={
          <>
            Anda akan mengaktifkan Tahun Ajaran <strong>{activateConfirmItem?.name}</strong>.
            Sistem akan otomatis mengubah status Tahun Ajaran yang sedang aktif saat ini menjadi{' '}
            <em>Archived</em>.
          </>
        }
        confirmLabel={updateMutation.isPending ? 'Mengaktifkan...' : 'Ya, Aktifkan'}
        isLoading={updateMutation.isPending}
        onConfirm={handleActivate}
      />
    </div>
  );
}

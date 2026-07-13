'use client';

import * as React from 'react';
import { Plus, Users, FolderOpen, Upload, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { TableSkeleton } from '@/components/ui-custom/TableSkeleton';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { ImportDialog } from '@/components/ui-custom/ImportDialog';

import { YearSelector } from '@/features/academic-years/components/YearSelector';
import { SemesterSelector } from '@/features/academic-years/components/SemesterSelector';
import { useAcademicYears } from '@/features/academic-years/queries/useAcademicYears';

import { Class } from '@/features/classes/types';
import { useClasses } from '@/features/classes/queries/useClasses';
import { useDeleteClass } from '@/features/classes/mutations/useClassMutations';
import { ClassGrid } from '@/features/classes/components/ClassGrid';
import { ClassFormDialog } from '@/features/classes/components/ClassFormDialog';
import { ClassDetailDialog } from '@/features/classes/components/ClassDetailDialog';
import { parseExcelFile } from '@/lib/excel/builder';
import { downloadExcelTemplate, KELAS_TEMPLATE_COLUMNS } from '@/lib/excel/templates';
import { classesService } from '@/features/classes/services/classes.service';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function ClassPage() {
  const router = useRouter();
  
  const [selectedYearId, setSelectedYearId] = React.useState<string>('');
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<string>('');
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<Class | undefined>();
  const [deleteItem, setDeleteItem] = React.useState<Class | null>(null);
  const [viewDetailsItem, setViewDetailsItem] = React.useState<Class | null>(null);

  // Excel Import/Export states
  const qc = useQueryClient();
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [importedRows, setImportedRows] = React.useState<{ name: string; jenjang: string; tingkat: string; description?: string | null }[]>([]);

  const { data: years, isLoading: isLoadingYears } = useAcademicYears();
  const { data: classes, isLoading: isLoadingClasses } = useClasses(selectedYearId, selectedSemesterId);

  const deleteMutation = useDeleteClass();

  const handleEdit = (item: Class) => {
    setEditingClass(item);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingClass(undefined);
    setIsDialogOpen(true);
  };

  const handleUploadFile = async (file: File) => {
    const keys = KELAS_TEMPLATE_COLUMNS.map((c) => c.key);
    const rawRows = await parseExcelFile(file, keys);
    if (rawRows.length === 0) {
      throw new Error('File Excel kosong atau format header tidak sesuai template.');
    }

    const rows = rawRows.map((r) => {
      const j = r.jenjang?.toLowerCase() || '';
      const jenjang = ['idadiyyah', 'ibtidaiyyah', 'tsanawiyyah', 'aliyyah'].includes(j) ? j : 'tsanawiyyah';
      return {
        name: r.name || '',
        jenjang,
        tingkat: r.tingkat || 'I',
        description: r.description || null,
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
        'Nama Kelas': item.name,
        'Jenjang': item.jenjang,
        'Tingkat': item.tingkat,
      })),
      errorsList: [],
    };
  };

  const handleExecuteImport = async () => {
    if (importedRows.length === 0) return;
    await classesService.importConfirm({
      academicYearId: selectedYearId,
      semesterId: selectedSemesterId || undefined,
      items: importedRows,
    });
    qc.invalidateQueries({ queryKey: ['classes', selectedYearId, selectedSemesterId] });
    toast.success('Kelas rombel berhasil diimpor');
    setIsImportOpen(false);
  };

  const handleExport = () => {
    const dataList = classes || [];
    let csvContent = 'Nama Kelas,Jenjang,Tingkat,Wali Kelas,Jumlah Siswi\n';
    dataList.forEach((c) => {
      csvContent += `"${c.name}","${c.jenjang}","${c.tingkat}","${c.waliKelasName || ''}","${c.studentCount}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data_kelas.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(
      { 
        id: deleteItem.id, 
        academicYearId: deleteItem.academicYearId, 
        semesterId: deleteItem.semesterId 
      },
      { onSuccess: () => setDeleteItem(null) }
    );
  };

  // If there are no academic years at all
  if (!isLoadingYears && (!years || years.length === 0)) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: 'Akademik', href: '/dashboard/sekretariat/akademik' },
            { label: 'Kelas' },
          ]}
          title="Manajemen Kelas"
          description="Kelola kelas, rombongan belajar, dan penugasan wali kelas."
        />
        <EmptyState
          icon={FolderOpen}
          title="Belum ada Tahun Ajaran"
          description="Anda harus membuat Tahun Ajaran terlebih dahulu sebelum dapat mengelola Kelas."
          action={
            <Button
              onClick={() => router.push('/dashboard/sekretariat/akademik/tahun-ajaran')}
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Ke Manajemen Tahun Ajaran
            </Button>
          }
        />
      </div>
    );
  }

  const isLoading = isLoadingClasses || isLoadingYears;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <PageHeader
        breadcrumbs={[
          { label: 'Akademik', href: '/dashboard/sekretariat/akademik' },
          { label: 'Kelas' },
        ]}
        title="Manajemen Kelas"
        description="Pilih Tahun Ajaran dan Semester untuk melihat daftar kelas aktif."
        actions={
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <YearSelector value={selectedYearId} onChange={setSelectedYearId} />
            {selectedYearId && (
              <SemesterSelector 
                academicYearId={selectedYearId} 
                value={selectedSemesterId} 
                onChange={setSelectedSemesterId} 
              />
            )}
            {selectedYearId && selectedSemesterId && (
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
                  className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition-all rounded-lg h-9.5 text-xs font-semibold"
                >
                  <Plus className="mr-2 h-4 w-4" /> Tambah Kelas
                </Button>
              </div>
            )}
          </div>
        }
      />

      <Card className="p-0 overflow-hidden border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
        {isLoading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : !selectedSemesterId ? (
           <EmptyState
             icon={Users}
             title="Pilih Semester"
             description="Silakan pilih Semester terlebih dahulu untuk menampilkan atau mengelola Kelas."
           />
        ) : !classes || classes.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Belum ada Kelas"
            description="Tahun Ajaran dan Semester ini belum memiliki kelas. Silakan buat kelas baru."
            action={
              <Button
                onClick={handleCreate}
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Plus className="mr-2 h-4 w-4" /> Buat Kelas Pertama
              </Button>
            }
          />
        ) : (
          <ClassGrid
            data={classes}
            onEdit={handleEdit}
            onDelete={setDeleteItem}
            onViewDetails={setViewDetailsItem}
          />
        )}
      </Card>

      {/* Form Dialog */}
      {selectedYearId && selectedSemesterId && (
        <ClassFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          academicYearId={selectedYearId}
          semesterId={selectedSemesterId}
          initialData={editingClass}
        />
      )}

      {/* Detail Dialog */}
      <ClassDetailDialog
        open={!!viewDetailsItem}
        onOpenChange={(open) => !open && setViewDetailsItem(null)}
        cls={viewDetailsItem}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        variant="danger"
        title="Hapus Kelas?"
        description={
          <>
            Kelas <strong>{deleteItem?.name}</strong> akan dihapus (Soft Delete). 
            Data yang terhubung (Siswa, Absensi, Nilai) akan diarsipkan, dan wali kelas akan diberhentikan dari penugasan ini.
          </>
        }
        confirmLabel={deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus Kelas"}
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />

      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Impor Massal Kelas"
        moduleName="Kelas"
        onDownloadTemplate={() => downloadExcelTemplate('kelas')}
        onUploadFile={handleUploadFile}
        onExecuteImport={handleExecuteImport}
      />
    </div>
  );
}

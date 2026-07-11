'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Edit2, Trash2, Upload, Download, Filter, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { DataGrid } from '@/components/ui-custom/DataGrid';
import { ImportDialog, ValidationError } from '@/components/ui-custom/ImportDialog';
import { ExportDialog } from '@/components/ui-custom/ExportDialog';

import { YearSelector } from '@/features/academic-years/components/YearSelector';
import { SemesterSelector } from '@/features/academic-years/components/SemesterSelector';
import { useAcademicYears } from '@/features/academic-years/queries/useAcademicYears';

import { Student } from '@/features/students/types';
import { useStudents } from '@/features/students/queries/useStudents';
import { useDeleteStudent } from '@/features/students/mutations';
import { StudentFormDialog } from '@/features/students/components/StudentFormDialog';
import { studentsService } from '@/features/students/services/students.service';
import { useClasses } from '@/features/classes/queries/useClasses';
import { parseExcelFile } from '@/lib/excel/builder';
import { downloadExcelTemplate, SISWI_TEMPLATE_COLUMNS } from '@/lib/excel/templates';

export default function SiswiPage() {
  const [selectedYearId, setSelectedYearId] = React.useState<string>('');
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<string>('');
  const [selectedClassId, setSelectedClassId] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('active');

  const [search, setSearch] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(25);

  const { data: years, isLoading: isLoadingYears } = useAcademicYears();

  // Selected parameters query hook
  const { data: studentsData, isLoading: isLoadingStudents } = useStudents({
    search,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    classId: selectedClassId === 'all' ? undefined : selectedClassId,
    academicYearId: selectedYearId || undefined,
    semesterId: selectedSemesterId || undefined,
    page: currentPage,
    limit: itemsPerPage,
  });

  const deleteMutation = useDeleteStudent();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Student | undefined>(undefined);
  const [deleteConfirmItem, setDeleteConfirmItem] = React.useState<Student | null>(null);

  // Import states
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [importedRows, setImportedRows] = React.useState<Omit<Student, 'id' | 'status'>[]>([]);

  // Export states
  const [isExportOpen, setIsExportOpen] = React.useState(false);

  // Fetch classes for dropdown filter via standard query hook
  const { data: classesData } = useClasses(selectedYearId, selectedSemesterId);
  const classesList = classesData || [];

  const handleCreate = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (item: Student) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmItem) return;
    await deleteMutation.mutateAsync(deleteConfirmItem.id);
    setDeleteConfirmItem(null);
  };

  // Bulk Import Callbacks
  const handleUploadFile = async (file: File) => {
    const keys = SISWI_TEMPLATE_COLUMNS.map((c) => c.key);
    const rawRows = await parseExcelFile(file, keys);
    if (rawRows.length === 0) {
      throw new Error('File Excel kosong atau format header tidak sesuai template.');
    }

    const rows: Omit<Student, 'id' | 'status'>[] = rawRows.map((r) => {
      const g = r.gender?.toLowerCase() || '';
      const gender: 'male' | 'female' = (g === 'laki-laki' || g === 'l' || g === 'male') ? 'male' : 'female';
      return {
        name: r.name || '',
        nis: r.nis || null,
        nisn: r.nisn || null,
        gender,
        birthPlace: r.birthPlace || null,
        birthDate: r.birthDate || null,
        phone: r.phone || null,
        parentName: r.parentName || null,
        parentPhone: r.parentPhone || null,
        address: r.address || null,
        entryYear: r.entryYear || null,
        entryJenjang: r.entryJenjang || null,
        notes: r.notes || null,
      };
    });

    setImportedRows(rows);

    // Call server to preview & validate rows
    const preview = await studentsService.importPreview(
      rows,
      selectedClassId === 'all' ? null : selectedClassId,
      selectedYearId || null,
      selectedSemesterId || null
    );

    // Map ImportPreviewResult to ImportPreviewData
    const errorsList: ValidationError[] = [];
    let duplicatesCount = 0;

    preview.items.forEach((item) => {
      if (item.status === 'error') {
        item.errors.forEach((err) => {
          if (err.includes('Duplikat') || err.includes('sudah terdaftar')) {
            duplicatesCount++;
          }
          errorsList.push({
            row: item.rowNumber,
            column: 'Data',
            value: item.nis || item.name,
            message: err,
          });
        });
      }
    });

    return {
      total: preview.total,
      valid: preview.valid,
      errorsCount: preview.failed,
      duplicatesCount,
      previewRows: preview.items.map((item) => ({
        'No Baris': item.rowNumber,
        'Nama Lengkap': item.name,
        'NIS': item.nis,
        'Status': item.status === 'valid' ? 'Valid' : 'Error',
        'Keterangan': item.errors.join(', ') || 'Valid',
      })),
      errorsList,
    };
  };

  const handleExecuteImport = async () => {
    if (importedRows.length === 0) return;
    await studentsService.importConfirm(
      importedRows,
      selectedClassId === 'all' ? null : selectedClassId,
      selectedYearId || null,
      selectedSemesterId || null
    );
    setImportedRows([]);
  };

  // Bulk Export Handler
  const handleExecuteExport = (format: 'excel' | 'csv' | 'pdf') => {
    const dataList = studentsData?.items || [];
    console.log('Executing export in format:', format);
    let csvContent = 'Nama,NIS,NISN,Gender,HP,Kelas\n';
    dataList.forEach((s) => {
      csvContent += `"${s.name}","${s.nis || ''}","${s.nisn || ''}","${s.gender}","${s.phone || ''}","${s.className || ''}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `data_siswi_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportOpen(false);
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'name',
      header: 'Identitas Siswi',
      cell: ({ row }) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">{row.original.name}</span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            <span>NIS: {row.original.nis || '-'}</span>
            <span>•</span>
            <span>NISN: {row.original.nisn || '-'}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'className',
      header: 'Rombel Kelas',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-[#C9A050] dark:text-[#DFB566]">
          {row.getValue('className') || (
            <span className="text-zinc-400 text-xs italic">Tanpa Kelas</span>
          )}
        </span>
      ),
    },
    {
      accessorKey: 'parentName',
      header: 'Orang Tua / Wali',
      cell: ({ row }) => (
        <div className="flex flex-col text-left text-sm">
          <span className="text-zinc-700 dark:text-zinc-350">{row.original.parentName || '-'}</span>
          {row.original.parentPhone && (
            <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
              <Phone className="h-3 w-3" /> {row.original.parentPhone}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusMap: Record<string, string> = {
          active: 'Aktif',
          mutasi: 'Mutasi',
          lulus: 'Lulus',
          alumnus: 'Alumnus',
          non_active: 'Non-Aktif',
        };
        const label = statusMap[row.getValue('status') as string] ?? 'Draft';
        const colorMap: Record<string, string> = {
          active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400',
          mutasi: 'bg-amber-50 text-amber-700 ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400',
          lulus: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400',
          alumnus: 'bg-purple-50 text-purple-700 ring-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400',
          non_active: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400',
        };
        const dotMap: Record<string, string> = {
          active: 'bg-emerald-500',
          mutasi: 'bg-amber-400',
          lulus: 'bg-blue-500',
          alumnus: 'bg-purple-500',
          non_active: 'bg-zinc-400',
        };
        const status = row.getValue('status') as string;
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colorMap[status] ?? 'bg-zinc-100 text-zinc-600 ring-zinc-500/20'}`}>
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotMap[status] ?? 'bg-zinc-400'}`} />
            {label}
          </span>
        );
      },
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

  if (!isLoadingYears && (!years || years.length === 0)) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumbs={[
            { label: 'Akademik', href: '/dashboard/mufattisy/akademik' },
            { label: 'Siswi' },
          ]}
          title="Manajemen Siswi"
          description="Pendaftaran dan penugasan kelas rombel siswi pesantren."
        />
        <ConfirmDialog
          open={true}
          onOpenChange={() => {}}
          variant="info"
          title="Tahun Ajaran Kosong"
          description="Buat Tahun Ajaran terlebih dahulu untuk mengelola database data siswi."
          confirmLabel="Buat Tahun Ajaran"
          onConfirm={() => window.location.assign('/dashboard/mufattisy/akademik/tahun-ajaran')}
        />
      </div>
    );
  }

  const isLoading = isLoadingYears || isLoadingStudents;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        breadcrumbs={[
          { label: 'Akademik', href: '/dashboard/mufattisy/akademik' },
          { label: 'Siswi' },
        ]}
        title="Database Siswi"
        description="Pengelolaan profil lengkap santriwati pesantren, wali, dan pengelompokan kelas rombel."
        actions={
          <div className="flex items-center gap-3">
            <YearSelector value={selectedYearId} onChange={(val) => { setSelectedYearId(val || ''); setSelectedClassId('all'); }} />
            {selectedYearId && (
              <SemesterSelector
                academicYearId={selectedYearId}
                value={selectedSemesterId}
                onChange={(val) => { setSelectedSemesterId(val || ''); setSelectedClassId('all'); }}
              />
            )}
            {selectedYearId && selectedSemesterId && (
              <Button
                onClick={handleCreate}
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg shadow-sm transition-all h-9.5 text-xs font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" /> Tambah Siswi
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6">
        {/* Dynamic filters block */}
        {selectedYearId && selectedSemesterId && (
          <div className="flex flex-wrap items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <Filter className="h-3.5 w-3.5 text-zinc-400" /> Filter
            </div>
            
            <div className="w-[180px]">
              <Select onValueChange={(val) => setSelectedClassId(val || 'all')} value={selectedClassId}>
                <SelectTrigger className="h-8.5 text-xs dark:bg-zinc-950">
                  <SelectValue placeholder="Semua Kelas" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950">
                  <SelectItem value="all">Semua Rombel Kelas</SelectItem>
                  {classesList.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[150px]">
              <Select onValueChange={(val) => setSelectedStatus(val || 'active')} value={selectedStatus}>
                <SelectTrigger className="h-8.5 text-xs dark:bg-zinc-950">
                  <SelectValue placeholder="Status Aktif" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-950">
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="mutasi">Mutasi / Keluar</SelectItem>
                  <SelectItem value="lulus">Lulus</SelectItem>
                  <SelectItem value="alumnus">Alumnus</SelectItem>
                  <SelectItem value="non_active">Non-Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportOpen(true)}
                className="h-8.5 text-xs border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <Upload className="mr-1.5 h-3.5 w-3.5 text-zinc-400" /> Impor Excel/CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExportOpen(true)}
                className="h-8.5 text-xs border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <Download className="mr-1.5 h-3.5 w-3.5 text-zinc-400" /> Ekspor
              </Button>
            </div>
          </div>
        )}

        <Card className="p-5 border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
          <DataGrid
            data={studentsData?.items || []}
            columns={columns}
            totalItems={studentsData?.total || 0}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            searchQuery={search}
            onSearchChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            searchPlaceholder="Cari siswi (nama / NIS)..."
            isLoading={isLoading}
            emptyTitle="Data Siswi Kosong"
            emptyDescription={
              selectedYearId && selectedSemesterId
                ? 'Tidak ada siswi terdaftar yang cocok dengan filter aktif. Daftarkan siswi pertama Anda menggunakan tombol di atas.'
                : 'Pilih Tahun Ajaran dan Semester terlebih dahulu untuk membuka database siswi.'
            }
          />
        </Card>
      </div>

      <StudentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingItem}
        academicYearId={selectedYearId}
        semesterId={selectedSemesterId}
      />

      <ConfirmDialog
        open={!!deleteConfirmItem}
        onOpenChange={(open) => !open && setDeleteConfirmItem(null)}
        variant="danger"
        title="Hapus Profil Siswi?"
        description={
          <>
            Profil siswi <strong>{deleteConfirmItem?.name}</strong> akan dipindahkan ke Recycle Bin.
            Riwayat pendaftaran kelas dan nilai raport yang terkait akan diarsipkan sementara.
          </>
        }
        confirmLabel={deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />

      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Impor Massal Siswi"
        moduleName="Siswi"
        onDownloadTemplate={() => downloadExcelTemplate('siswi')}
        onUploadFile={handleUploadFile}
        onExecuteImport={handleExecuteImport}
      />

      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Ekspor Data Siswi"
        onExport={handleExecuteExport}
      />
    </div>
  );
}

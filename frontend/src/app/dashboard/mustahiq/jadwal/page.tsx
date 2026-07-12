'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataGrid } from '@/components/ui-custom/DataGrid';
import { useSchedules } from '@/features/schedules/queries/useSchedules';
import { YearSelector } from '@/features/academic-years/components/YearSelector';
import { SemesterSelector } from '@/features/academic-years/components/SemesterSelector';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Schedule } from '@/features/schedules/types';
import { useClasses } from '@/features/classes/queries/useClasses';
import { useSubjects } from '@/features/subjects/queries/useSubjects';

export default function SchedulePage() {
  const [selectedYearId, setSelectedYearId] = React.useState('');
  const [selectedSemesterId, setSelectedSemesterId] = React.useState('');
  const [selectedJenjang] = React.useState('Tsanawiyyah');
  const [selectedTingkat] = React.useState('I');

  const { data, isLoading } = useSchedules({
    academicYearId: selectedYearId,
    semesterId: selectedSemesterId,
    targetType: 'class',
    jenjang: selectedJenjang,
    tingkat: selectedTingkat,
  });

  const { data: classesData } = useClasses(selectedYearId, selectedSemesterId);
  const { data: subjectsData } = useSubjects();

  const columns: ColumnDef<Schedule>[] = [
    {
      accessorKey: 'day',
      header: 'Hari',
      cell: ({ row }) => <span className="capitalize">{row.getValue('day')}</span>,
    },
    {
      accessorKey: 'startTime',
      header: 'Waktu',
      cell: ({ row }) => (
        <span>{row.getValue('startTime')} - {row.original.endTime}</span>
      ),
    },
    {
      accessorKey: 'activity',
      header: 'Kegiatan',
      cell: ({ row }) => {
        const sub = subjectsData?.find((s) => s.id === row.original.subjectId);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-zinc-900 dark:text-zinc-50">{row.original.activity}</span>
            {sub && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Mapel: {sub.name} ({sub.code})
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'jenjang',
      header: 'Target',
      cell: ({ row }) => {
        const cls = classesData?.find((c) => c.id === row.original.classId);
        return (
          <span className="text-xs text-zinc-700 dark:text-zinc-300">
            {row.getValue('jenjang')} {row.original.tingkat} {row.original.classId ? `(Kelas ${cls ? cls.name : row.original.classId})` : ''}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Jadwal Akademik"
        description="Atur jadwal pelajaran dan kegiatan akademik berdasarkan tingkat dan kelas."
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <YearSelector value={selectedYearId} onChange={(v) => setSelectedYearId(v || '')} />
            {selectedYearId && (
              <SemesterSelector
                academicYearId={selectedYearId}
                value={selectedSemesterId}
                onChange={(v) => setSelectedSemesterId(v || '')}
              />
            )}
            <Button className="gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <Plus className="h-4 w-4" /> Tambah Jadwal
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-4">
        {selectedYearId && selectedSemesterId ? (
          <DataGrid
            data={data || []}
            columns={columns as ColumnDef<unknown, unknown>[]}
            totalItems={data?.length || 0}
            currentPage={1}
            itemsPerPage={25}
            onPageChange={() => {}}
            onItemsPerPageChange={() => {}}
            isLoading={isLoading}
            searchPlaceholder="Cari kegiatan..."
            emptyTitle="Belum Ada Jadwal"
            emptyDescription="Tidak ada jadwal akademik yang ditemukan untuk kriteria ini."
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg text-zinc-500">
            Pilih Tahun Ajaran dan Semester untuk melihat jadwal.
          </div>
        )}
      </div>
    </div>
  );
}

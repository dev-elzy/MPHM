'use client';

import * as React from 'react';
import { BookOpen, CheckCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { DataGrid } from '@/components/ui-custom/DataGrid';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { ColumnDef } from '@tanstack/react-table';
import { YearSelector } from '@/features/academic-years/components/YearSelector';
import { SemesterSelector } from '@/features/academic-years/components/SemesterSelector';
import { useScoreSessions } from '@/features/scores/queries/useScores';
import { useFinalizeScoreSession } from '@/features/scores/mutations';
import { ScoreSession } from '@/features/scores/types';
import { useRouter } from 'next/navigation';

import { useClasses } from '@/features/classes/queries/useClasses';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

const SESSION_STATUS: Record<string, { label: string; color: string; dot: string }> = {
  draft: { label: 'Draft', color: 'bg-blue-50 text-blue-700 ring-blue-500/20', dot: 'bg-blue-500' },
  ready: { label: 'Siap', color: 'bg-amber-50 text-amber-700 ring-amber-500/20', dot: 'bg-amber-400' },
  final: { label: 'Final', color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  locked: { label: 'Dikunci', color: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20', dot: 'bg-zinc-400' },
};

export default function NilaiPage() {
  const router = useRouter();
  const { isMustahiq, isAdmin } = useAuthSession();
  const [selectedYearId, setSelectedYearId] = React.useState('');
  const [selectedSemesterId, setSelectedSemesterId] = React.useState('');
  const [selectedClassId, setSelectedClassId] = React.useState('');
  const [finalizeTarget, setFinalizeTarget] = React.useState<ScoreSession | null>(null);
  
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(25);

  const { data: classesData } = useClasses(selectedYearId, selectedSemesterId);
  const classesList = classesData || [];

  // Auto-select class for Mustahiq when classesList changes
  React.useEffect(() => {
    if (classesList.length > 0 && !selectedClassId) {
      setSelectedClassId(classesList[0].id);
    }
  }, [classesList, selectedClassId]);

  const { data: sessionsData, isLoading } = useScoreSessions({
    academicYearId: selectedYearId,
    semesterId: selectedSemesterId,
    classId: selectedClassId || undefined,
    limit,
    page,
  });

  const finalizeMutation = useFinalizeScoreSession();

  const handleFinalize = async () => {
    if (!finalizeTarget) return;
    await finalizeMutation.mutateAsync(finalizeTarget.id);
    setFinalizeTarget(null);
  };

  const columns: ColumnDef<ScoreSession>[] = [
    {
      accessorKey: 'subjectName',
      header: 'Mata Pelajaran',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">
            {row.original.subjectName || '-'}
          </span>
          <span className="text-xs text-zinc-400 mt-0.5">{row.original.className || 'Semua Kelas'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = row.getValue('status') as string;
        const cfg = SESSION_STATUS[s] ?? SESSION_STATUS.draft;
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${cfg.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            {cfg.label}
          </span>
        );
      },
    },
    {
      accessorKey: 'maxScore',
      header: 'Skor Maks',
      cell: ({ row }) => (
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{row.original.maxScore ?? 100}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => {
        const s = row.original.status;
        const canInput = isMustahiq && (s === 'draft' || s === 'ready');
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/mustahiq/nilai/${row.original.id}`)}
              className="h-8 text-xs text-[#C9A050] hover:text-[#B8903E] hover:bg-amber-50 dark:hover:bg-amber-500/10 gap-1.5 rounded-lg"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {canInput ? 'Input Nilai' : 'Lihat Nilai'}
            </Button>
            
            {/* Mustahiq can submit draft session for review */}
            {isMustahiq && s === 'draft' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFinalizeTarget(row.original)}
                className="h-8 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 gap-1.5 rounded-lg"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Kirim Review
              </Button>
            )}

            {/* Admin can approve ready session */}
            {isAdmin && s === 'ready' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFinalizeTarget(row.original)}
                className="h-8 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 gap-1.5 rounded-lg"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Approve Nilai
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Input Nilai"
        description="Kelola sesi penilaian per mata pelajaran, input nilai tamrin dan ujian, serta finalisasi raport."
        actions={
          <div className="flex items-center gap-3">
            <YearSelector value={selectedYearId} onChange={(v) => { setSelectedYearId(v || ''); setSelectedClassId(''); }} />
            {selectedYearId && (
              <SemesterSelector
                academicYearId={selectedYearId}
                value={selectedSemesterId}
                onChange={(v) => { setSelectedSemesterId(v || ''); setSelectedClassId(''); }}
              />
            )}
          </div>
        }
      />

      {/* Class info */}
      {selectedClassId && classesList.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">Kelas Rombel:</span>
          <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
            {classesList.find((c) => c.id === selectedClassId)?.name || 'Memuat Kelas...'}
          </div>
        </div>
      )}

      {!selectedYearId || !selectedSemesterId ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed dark:bg-zinc-950">
          <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mb-4" />
          <p className="text-sm font-semibold text-zinc-500">Pilih Tahun Ajaran & Semester</p>
          <p className="text-xs text-zinc-400 mt-1">Pilih tahun ajaran dan semester untuk melihat sesi penilaian yang tersedia.</p>
        </Card>
      ) : (
        <DataGrid
          data={sessionsData?.items || []}
          columns={columns as ColumnDef<unknown, unknown>[]}
          totalItems={sessionsData?.total || 0}
          currentPage={page}
          itemsPerPage={limit}
          onPageChange={setPage}
          onItemsPerPageChange={setLimit}
          isLoading={isLoading}
          searchPlaceholder="Cari mata pelajaran..."
          emptyTitle="Belum Ada Sesi Penilaian"
          emptyDescription="Sesi nilai akan muncul setelah kurikulum dan kelas dikonfigurasi untuk semester ini."
        />
      )}

      <ConfirmDialog
        open={!!finalizeTarget}
        onOpenChange={(open) => !open && setFinalizeTarget(null)}
        variant="warning"
        title={isAdmin && finalizeTarget?.status === 'ready' ? "Approve Nilai Mata Pelajaran?" : "Kirim Review Nilai?"}
        description={
          isAdmin && finalizeTarget?.status === 'ready' ? (
            <>
              Nilai untuk mata pelajaran <strong>{finalizeTarget?.subjectName}</strong> akan disetujui (Approved) dan dikunci.
              Nilai tidak dapat diubah lagi oleh guru/mustahiq.
            </>
          ) : (
            <>
              Nilai untuk mata pelajaran <strong>{finalizeTarget?.subjectName}</strong> akan dikirim ke administrator untuk direview.
              Pastikan semua nilai sudah benar sebelum mengirim.
            </>
          )
        }
        confirmLabel={finalizeMutation.isPending ? 'Memproses...' : (isAdmin && finalizeTarget?.status === 'ready' ? 'Ya, Approve' : 'Ya, Kirim Review')}
        isLoading={finalizeMutation.isPending}
        onConfirm={handleFinalize}
      />
    </div>
  );
}

'use client';

import * as React from 'react';
import { BookOpen, CheckCircle, FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import { YearSelector } from '@/features/academic-years/components/YearSelector';
import { useAcademicYears } from '@/features/academic-years/queries/useAcademicYears';
import { useSemesters } from '@/features/academic-years/queries/useSemesters';
import { useScoreSessions, useScoreEntries } from '@/features/scores/queries/useScores';
import { useSaveScore, useFinalizeScoreSession } from '@/features/scores/mutations';
import { ScoreSession, ScoreEntryRow } from '@/features/scores/types';
import { useClasses } from '@/features/classes/queries/useClasses';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Debounced auto-save hook
function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

interface ScoreCellProps {
  sessionId: string;
  studentId: string;
  scoreType: 'tamrin' | 'uts' | 'uas';
  initialValue: number | null;
  locked: boolean;
}

function ScoreCell({ sessionId, studentId, scoreType, initialValue, locked }: ScoreCellProps) {
  const [value, setValue] = React.useState<string>(initialValue !== null ? String(initialValue) : '');
  const debouncedValue = useDebounced(value, 800);
  const saveScore = useSaveScore();
  const isSaving = saveScore.isPending;

  React.useEffect(() => {
    setValue(initialValue !== null ? String(initialValue) : '');
  }, [initialValue]);

  React.useEffect(() => {
    if (debouncedValue === (initialValue !== null ? String(initialValue) : '')) return;
    const parsed = debouncedValue === '' ? null : parseFloat(debouncedValue);
    if (parsed !== null && (isNaN(parsed) || parsed < 0 || parsed > 100)) {
      toast.error('Nilai harus antara 0 - 100');
      return;
    }
    saveScore.mutate({ scoreSessionId: sessionId, studentId, scoreType, score: parsed });
  }, [debouncedValue]); // eslint-disable-line react-hooks/exhaustive-deps

  if (locked) {
    return <span className="text-sm text-zinc-700 dark:text-zinc-300 font-mono">{initialValue ?? '-'}</span>;
  }

  return (
    <div className="relative inline-block">
      <Input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          "h-8 w-20 text-sm font-mono text-center dark:bg-zinc-900 transition-all",
          isSaving ? "border-amber-400 ring-1 ring-amber-400" : ""
        )}
        placeholder="-"
      />
      {isSaving && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      )}
    </div>
  );
}

const SESSION_STATUS: Record<string, { label: string; color: string; dot: string }> = {
  draft: { label: 'Draft', color: 'bg-blue-50 text-blue-700 ring-blue-500/20', dot: 'bg-blue-500' },
  ready: { label: 'Siap', color: 'bg-amber-50 text-amber-700 ring-amber-500/20', dot: 'bg-amber-400' },
  final: { label: 'Final', color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  locked: { label: 'Dikunci', color: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20', dot: 'bg-zinc-400' },
};

export default function NilaiPage() {
  const { isMustahiq, isAdmin } = useAuthSession();
  const [selectedYearId, setSelectedYearId] = React.useState('');
  const [selectedSemesterId, setSelectedSemesterId] = React.useState('');
  const [selectedClassId, setSelectedClassId] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<'tamrin' | 'ujian'>('tamrin');
  const [selectedSession, setSelectedSession] = React.useState<ScoreSession | null>(null);
  const [finalizeTarget, setFinalizeTarget] = React.useState<ScoreSession | null>(null);

  const { data: years = [] } = useAcademicYears();
  const { data: semesters = [] } = useSemesters(selectedYearId);
  const { data: classesData } = useClasses(selectedYearId, selectedSemesterId);
  const classesList = classesData || [];

  // Auto-select academic year
  React.useEffect(() => {
    if (years.length > 0 && !selectedYearId) {
      const active = years.find((y) => y.status === 'Active') || years[0];
      setSelectedYearId(active.id);
    }
  }, [years, selectedYearId]);

  // Auto-select semester
  React.useEffect(() => {
    if (semesters.length > 0 && !selectedSemesterId) {
      const active = semesters.find((s) => s.status === 'Active') || semesters[0];
      setSelectedSemesterId(active.id);
    }
  }, [semesters, selectedSemesterId]);

  // Auto-select class for Mustahiq
  React.useEffect(() => {
    if (classesList.length > 0 && !selectedClassId) {
      setSelectedClassId(classesList[0].id);
    }
  }, [classesList, selectedClassId]);

  // Reset selected subject when filters change
  React.useEffect(() => {
    setSelectedSession(null);
  }, [selectedYearId, selectedSemesterId, selectedClassId]);

  // Fetch subjects (score sessions)
  const { data: sessionsData, isLoading: sessionsLoading } = useScoreSessions({
    academicYearId: selectedYearId,
    semesterId: selectedSemesterId,
    classId: selectedClassId || undefined,
    limit: 100,
  });
  const sessionsList = sessionsData?.items || [];

  // Fetch score entries for active subject
  const { data: entries = [], isLoading: entriesLoading } = useScoreEntries(selectedSession?.id || '');

  const finalizeMutation = useFinalizeScoreSession();

  const handleFinalize = async () => {
    if (!finalizeTarget) return;
    await finalizeMutation.mutateAsync(finalizeTarget.id);
    // Refresh current selected session data to match locking status
    if (selectedSession && selectedSession.id === finalizeTarget.id) {
      setSelectedSession({ ...selectedSession, status: 'ready' });
    }
    setFinalizeTarget(null);
  };

  // Find semester instances for toggle buttons
  const semGanjil = semesters.find((s) => s.name.toLowerCase().includes('ganjil') || s.name.includes('1') || s.name.includes('I')) || semesters[0];
  const semGenap = semesters.find((s) => s.name.toLowerCase().includes('genap') || s.name.includes('2') || s.name.includes('II')) || semesters[1];

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Input Nilai"
        description="Kelola sesi penilaian per mata pelajaran, input nilai tamrin dan ujian secara langsung."
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <YearSelector value={selectedYearId} onChange={(v) => { setSelectedYearId(v || ''); setSelectedSemesterId(''); setSelectedClassId(''); }} />
          </div>
        }
      />

      {/* Semester & Type Selection Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-zinc-500">Pilih Semester</span>
          <div className="flex gap-2">
            <Button
              variant={selectedSemesterId === semGanjil?.id ? 'default' : 'outline'}
              onClick={() => semGanjil && setSelectedSemesterId(semGanjil.id)}
              className={cn("h-9.5 text-xs font-bold rounded-xl px-4 cursor-pointer", selectedSemesterId === semGanjil?.id ? "shadow-md bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900" : "")}
              disabled={!semGanjil}
            >
              Semester Ganjil
            </Button>
            <Button
              variant={selectedSemesterId === semGenap?.id ? 'default' : 'outline'}
              onClick={() => semGenap && setSelectedSemesterId(semGenap.id)}
              className={cn("h-9.5 text-xs font-bold rounded-xl px-4 cursor-pointer", selectedSemesterId === semGenap?.id ? "shadow-md bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900" : "")}
              disabled={!semGenap}
            >
              Semester Genap
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-zinc-500">Kategori Penilaian</span>
          <div className="flex gap-2">
            <Button
              variant={selectedType === 'tamrin' ? 'default' : 'outline'}
              onClick={() => setSelectedType('tamrin')}
              className={cn("h-9.5 text-xs font-bold rounded-xl px-4 cursor-pointer", selectedType === 'tamrin' ? "shadow-md bg-[#C9A050] hover:bg-[#B8903E] text-white border-transparent" : "")}
            >
              Tamrin
            </Button>
            <Button
              variant={selectedType === 'ujian' ? 'default' : 'outline'}
              onClick={() => setSelectedType('ujian')}
              className={cn("h-9.5 text-xs font-bold rounded-xl px-4 cursor-pointer", selectedType === 'ujian' ? "shadow-md bg-[#C9A050] hover:bg-[#B8903E] text-white border-transparent" : "")}
            >
              Ujian Semester
            </Button>
          </div>
        </div>
      </div>

      {/* Class info */}
      {selectedClassId && classesList.length > 0 && (
        <div className="flex items-center gap-2 -mt-2">
          <span className="text-xs text-zinc-500 font-medium">Kelas Rombel:</span>
          <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
            {classesList.find((c) => c.id === selectedClassId)?.name || 'Memuat Kelas...'}
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      {!selectedYearId || !selectedSemesterId ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center border-dashed dark:bg-zinc-950">
          <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mb-4" />
          <p className="text-sm font-semibold text-zinc-500">Memuat Data Ajaran & Semester...</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Subject List */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Mata Pelajaran (Mapel)</h2>
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-6 w-6 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin" />
              </div>
            ) : sessionsList.length === 0 ? (
              <div className="text-xs text-zinc-400 p-8 border border-dashed rounded-2xl text-center dark:bg-zinc-950">
                Tidak ada mata pelajaran terdaftar untuk semester ini.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {sessionsList.map((session) => {
                  const isActive = selectedSession?.id === session.id;
                  const statusCfg = SESSION_STATUS[session.status] || SESSION_STATUS.draft;
                  return (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer",
                        isActive
                          ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-lg"
                          : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                      )}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                        <span className="font-bold text-sm truncate">{session.subjectName}</span>
                        <span className={cn("text-[10px] truncate", isActive ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-500")}>
                          {session.className}
                        </span>
                      </div>
                      <span className={cn("text-[10px] font-semibold px-2.5 py-0.5 rounded-full ring-1 ring-inset shrink-0", 
                        isActive ? "bg-zinc-800 dark:bg-zinc-100 text-zinc-300 dark:text-zinc-700 ring-transparent" : statusCfg.color
                      )}>
                        {statusCfg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Inline Grade Input Form */}
          <div className="lg:col-span-2">
            {!selectedSession ? (
              <Card className="flex flex-col items-center justify-center py-28 text-center border-dashed dark:bg-zinc-950 h-full">
                <BookOpen className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4 animate-bounce" />
                <p className="text-sm font-bold text-zinc-500">Mata Pelajaran Belum Dipilih</p>
                <p className="text-xs text-zinc-400 mt-1.5 max-w-xs">
                  Pilih salah satu mata pelajaran (mapel) di sebelah kiri untuk menampilkan daftar siswi dan memasukkan nilai.
                </p>
              </Card>
            ) : (
              <Card className="border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
                <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-extrabold text-zinc-900 dark:text-zinc-50">
                      Form Input Nilai: {selectedSession.subjectName}
                    </CardTitle>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {selectedSession.className} — Status: {selectedSession.status.toUpperCase()}
                    </p>
                  </div>
                  {isMustahiq && selectedSession.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => setFinalizeTarget(selectedSession)}
                      className="h-8.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-lg cursor-pointer"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Kirim Review
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  {entriesLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="h-6 w-6 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin" />
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="text-center py-12 text-sm text-zinc-400">
                      Tidak ada siswi terdaftar di kelas ini.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left">
                              <th className="py-2.5 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide w-12">No</th>
                              <th className="py-2.5 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Nama Siswi</th>
                              {selectedType === 'tamrin' ? (
                                <th className="py-2.5 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center w-28">Tamrin</th>
                              ) : (
                                <>
                                  <th className="py-2.5 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center w-28">UTS</th>
                                  <th className="py-2.5 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center w-28">UAS</th>
                                </>
                              )}
                              <th className="py-2.5 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center w-20">Final</th>
                              <th className="py-2.5 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center w-20">Predikat</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entries.map((row: ScoreEntryRow, idx: number) => {
                              const isLocked = selectedSession.status === 'locked' || (!isMustahiq && !isAdmin);
                              return (
                                <tr
                                  key={row.studentId}
                                  className={cn(
                                    "border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors",
                                    idx % 2 === 0 ? "" : "bg-zinc-50/50 dark:bg-zinc-900/20"
                                  )}
                                >
                                  <td className="py-3 px-3 text-xs text-zinc-400">{idx + 1}</td>
                                  <td className="py-3 px-3">
                                    <span className="font-bold text-zinc-900 dark:text-zinc-50 block">{row.studentName}</span>
                                    <span className="text-[10px] text-zinc-400">NIS: {row.studentNis || '-'}</span>
                                  </td>
                                  {selectedType === 'tamrin' ? (
                                    <td className="py-3 px-3 text-center">
                                      <ScoreCell
                                        sessionId={selectedSession.id}
                                        studentId={row.studentId}
                                        scoreType="tamrin"
                                        initialValue={row.tamrinScore}
                                        locked={isLocked}
                                      />
                                    </td>
                                  ) : (
                                    <>
                                      <td className="py-3 px-3 text-center">
                                        <ScoreCell
                                          sessionId={selectedSession.id}
                                          studentId={row.studentId}
                                          scoreType="uts"
                                          initialValue={row.utsScore}
                                          locked={isLocked}
                                        />
                                      </td>
                                      <td className="py-3 px-3 text-center">
                                        <ScoreCell
                                          sessionId={selectedSession.id}
                                          studentId={row.studentId}
                                          scoreType="uas"
                                          initialValue={row.uasScore}
                                          locked={isLocked}
                                        />
                                      </td>
                                    </>
                                  )}
                                  <td className="py-3 px-3 text-center font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                    {row.finalScore ?? '-'}
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    {row.predicate ? (
                                      <span className={cn(
                                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                                        row.predicate === 'A' ? 'bg-emerald-100 text-emerald-700' :
                                        row.predicate === 'B' ? 'bg-blue-100 text-blue-700' :
                                        row.predicate === 'C' ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                      )}>
                                        {row.predicate}
                                      </span>
                                    ) : (
                                      <span className="text-zinc-300 text-xs">—</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 bg-zinc-100/50 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                        <Save className="h-3.5 w-3.5 text-zinc-500" />
                        Nilai disimpan otomatis saat selesai mengetik (auto-save dengan debounce 800ms).
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!finalizeTarget}
        onOpenChange={(open) => !open && setFinalizeTarget(null)}
        variant="warning"
        title="Kirim Review Nilai?"
        description={
          <>
            Nilai untuk mata pelajaran <strong>{finalizeTarget?.subjectName}</strong> akan dikirim ke administrator untuk direview.
            Pastikan semua nilai sudah terisi dengan benar.
          </>
        }
        confirmLabel={finalizeMutation.isPending ? 'Memproses...' : 'Ya, Kirim Review'}
        isLoading={finalizeMutation.isPending}
        onConfirm={handleFinalize}
      />
    </div>
  );
}

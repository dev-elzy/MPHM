'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Save, CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useScoreSession, useScoreEntries } from '@/features/scores/queries/useScores';
import { useSaveScore, useFinalizeScoreSession } from '@/features/scores/mutations';
import { ScoreEntryRow } from '@/features/scores/types';
import { toast } from 'sonner';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

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
  scoreType: 'tamrin' | 'ujian';
  initialValue: number | null;
  locked: boolean;
}

function ScoreCell({ sessionId, studentId, scoreType, initialValue, locked }: ScoreCellProps) {
  const [value, setValue] = React.useState<string>(initialValue !== null ? String(initialValue) : '');
  const debouncedValue = useDebounced(value, 800);
  const saveScore = useSaveScore();
  const isSaving = saveScore.isPending;

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
    <div className="relative">
      <Input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`h-8 w-20 text-sm font-mono text-center dark:bg-zinc-900 ${isSaving ? 'border-amber-400' : ''}`}
        placeholder="-"
      />
      {isSaving && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      )}
    </div>
  );
}

export default function ScoreEntryPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isLoading: sessionLoading } = useScoreSession(id);
  const { data: entries, isLoading: entriesLoading } = useScoreEntries(id);
  const finalizeMutation = useFinalizeScoreSession();

  const { isMustahiq, isAdmin } = useAuthSession();
  const isLoading = sessionLoading || entriesLoading;
  const isLocked = true;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/pimpinan/akademik/nilai" className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {isMustahiq ? 'Input Nilai: ' : 'Lihat Nilai: '}{session?.subjectName || '...'}
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">{session?.className} — Status: {session?.status ?? '...'}</p>
          </div>
        </div>
        {isMustahiq && session?.status === 'draft' && (
          <Button
            onClick={() => finalizeMutation.mutate(id)}
            disabled={finalizeMutation.isPending}
            className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {finalizeMutation.isPending ? 'Mengirim...' : 'Kirim Review'}
          </Button>
        )}
        {isAdmin && session?.status === 'ready' && (
          <Button
            onClick={() => finalizeMutation.mutate(id)}
            disabled={finalizeMutation.isPending}
            className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {finalizeMutation.isPending ? 'Memproses...' : 'Approve Nilai'}
          </Button>
        )}
      </div>

      {isLocked && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {session?.status === 'locked'
            ? 'Nilai ini sudah dikunci dan tidak dapat diubah.'
            : !isMustahiq
              ? 'Anda dalam mode monitoring (hanya baca). Hanya pengajar kelas ini yang dapat menginput nilai.'
              : 'Nilai ini sudah difinalisasi.'}
        </div>
      )}

      <Card className="dark:bg-zinc-950">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Tabel Input Nilai — {(entries || []).length} Siswi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-6 w-6 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin" />
            </div>
          ) : !entries?.length ? (
            <div className="text-center py-16 text-sm text-zinc-400">
              Tidak ada siswi terdaftar di kelas ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">No</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Siswi</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Tamrin</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Ujian</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Khos</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">AM</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Final</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Predikat</th>
                  </tr>
                </thead>
                <tbody>
                  {(entries as ScoreEntryRow[]).map((row, idx) => (
                    <tr
                      key={row.studentId}
                      className={`border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors ${
                        idx % 2 === 0 ? '' : 'bg-zinc-50/50 dark:bg-zinc-900/20'
                      }`}
                    >
                      <td className="py-3 px-4 text-xs text-zinc-400">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-50">{row.studentName}</p>
                          <p className="text-xs text-zinc-400">NIS: {row.studentNis || '-'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ScoreCell
                          sessionId={id}
                          studentId={row.studentId}
                          scoreType="tamrin"
                          initialValue={row.tamrinScore}
                          locked={isLocked}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ScoreCell
                          sessionId={id}
                          studentId={row.studentId}
                          scoreType="ujian"
                          initialValue={row.ujianScore}
                          locked={isLocked}
                        />
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs text-zinc-500">{row.khosScore ?? '-'}</td>
                      <td className="py-3 px-4 text-center font-mono text-xs text-zinc-500">{row.amScore ?? '-'}</td>
                      <td className="py-3 px-4 text-center font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-50">{row.finalScore ?? '-'}</td>
                      <td className="py-3 px-4 text-center">
                        {row.predicate ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            row.predicate === 'A' ? 'bg-emerald-100 text-emerald-700' :
                            row.predicate === 'B' ? 'bg-blue-100 text-blue-700' :
                            row.predicate === 'C' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {row.predicate}
                          </span>
                        ) : <span className="text-zinc-300 text-xs">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-zinc-400 flex items-center gap-1.5">
        <Save className="h-3.5 w-3.5" />
        Nilai disimpan otomatis setelah selesai mengetik (auto-save dengan debounce 800ms)
      </p>
    </div>
  );
}

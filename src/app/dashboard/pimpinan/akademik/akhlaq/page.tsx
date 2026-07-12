'use client';

import * as React from 'react';
import { Heart, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { YearSelector } from '@/features/academic-years/components/YearSelector';
import { SemesterSelector } from '@/features/academic-years/components/SemesterSelector';
import { useAkhlaq } from '@/features/scores/queries/useScores';
import { useSaveAkhlaq } from '@/features/scores/mutations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClasses } from '@/features/classes/queries/useClasses';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

const AKHLAQ_CATEGORIES = [
  'Disiplin & Kehadiran',
  'Ibadah & Shalat',
  'Akhlak & Adab',
  'Kebersihan & Kerapian',
  'Kerjasama & Sosial',
  'Tanggung Jawab',
];

const GRADES = [
  { value: 'A', label: 'A — Sangat Baik', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { value: 'B', label: 'B — Baik', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'C', label: 'C — Cukup', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { value: 'D', label: 'D — Perlu Bimbingan', color: 'bg-red-100 text-red-700 border-red-300' },
];

export default function AkhlaqPage() {
  const { isMustahiq, isSekretariat } = useAuthSession();
  const isReadOnly = !isMustahiq && !isSekretariat;

  const [selectedYearId, setSelectedYearId] = React.useState('');
  const [selectedSemesterId, setSelectedSemesterId] = React.useState('');
  const [selectedClassId, setSelectedClassId] = React.useState('');
  const [students, setStudents] = React.useState<{ id: string; name: string; nis: string | null }[]>([]);
  const [gradeMap, setGradeMap] = React.useState<Record<string, Record<string, string>>>({});

  const { data: existing } = useAkhlaq({
    academicYearId: selectedYearId,
    semesterId: selectedSemesterId,
    classId: selectedClassId,
  });

  const saveMutation = useSaveAkhlaq();

  // Extract violation points and recommended grades from backend response
  const studentDetails = React.useMemo(() => {
    if (!existing) return {};
    const map: Record<string, { points: number; rec: string }> = {};
    existing.forEach((r) => {
      map[r.studentId] = {
        points: r.violationPoints ?? 0,
        rec: r.recommendedGrade ?? 'A',
      };
    });
    return map;
  }, [existing]);

  // Hydrate from existing
  React.useEffect(() => {
    if (!existing) return;
    const map: Record<string, Record<string, string>> = {};
    existing.forEach((r) => {
      if (r.category) {
        if (!map[r.studentId]) map[r.studentId] = {};
        map[r.studentId][r.category] = r.grade || '';
      }
    });
    setTimeout(() => setGradeMap(map), 0);
  }, [existing]);

  const { data: classesData } = useClasses(selectedYearId, selectedSemesterId);
  const classesList = classesData || [];

  // Load students
  React.useEffect(() => {
    if (selectedClassId && selectedSemesterId) {
      fetch(`/api/v1/students?classId=${selectedClassId}&semesterId=${selectedSemesterId}&limit=200`)
        .then((r) => r.json())
        .then((d: unknown) => {
          const data = d as { data?: { items?: { id: string; name: string; nis: string | null }[] } };
          setStudents(data.data?.items || []);
        })
        .catch(console.error);
    } else {
      setTimeout(() => setStudents([]), 0);
    }
  }, [selectedClassId, selectedSemesterId]);

  const handleSaveAll = async () => {
    if (!selectedClassId || !selectedYearId || !selectedSemesterId) return;
    const records: { studentId: string; category: string; grade: string }[] = [];
    students.forEach((s) => {
      const grades = gradeMap[s.id] || {};
      AKHLAQ_CATEGORIES.forEach((cat) => {
        if (grades[cat]) {
          records.push({
            studentId: s.id,
            category: cat,
            grade: grades[cat],
          });
        }
      });
    });
    
    if (records.length > 0) {
      await saveMutation.mutateAsync({
        academicYearId: selectedYearId,
        semesterId: selectedSemesterId,
        classId: selectedClassId,
        records,
      });
    }
  };

  const setGrade = (studentId: string, category: string, grade: string) => {
    setGradeMap((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || {}), [category]: grade },
    }));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Penilaian Akhlaq & Adab"
        description="Penilaian karakter dan adab santri dengan integrasi otomatis poin pelanggaran keamanan."
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

      <div className="flex items-center gap-4">
        <div className="w-[200px]">
          <Select value={selectedClassId} onValueChange={(v) => setSelectedClassId(v || '')}>
            <SelectTrigger className="h-9 text-sm dark:bg-zinc-950">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950">
              {classesList.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClassId && students.length > 0 && !isReadOnly && (
          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={saveMutation.isPending}
            className="h-9 text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 gap-1.5 hover:bg-zinc-800"
          >
            <Save className="h-3.5 w-3.5" />
            {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Semua'}
          </Button>
        )}
      </div>

      {isReadOnly && selectedClassId && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
          Anda dalam mode monitoring (hanya baca). Hanya pengajar kelas ini yang dapat mencatat penilaian akhlaq.
        </div>
      )}

      {selectedClassId && students.length > 0 ? (
        <div className="overflow-x-auto border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide sticky left-0 bg-zinc-50 dark:bg-zinc-900 min-w-[240px] z-20">Siswi & Rekomendasi</th>
                {AKHLAQ_CATEGORIES.map((cat) => (
                  <th key={cat} className="text-center py-3 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide min-w-[120px]">
                    {cat.split(' & ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => {
                const info = studentDetails[student.id] || { points: 0, rec: 'A' };
                return (
                  <tr
                    key={student.id}
                    className={`border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30 transition-colors ${
                      idx % 2 === 0 ? '' : 'bg-zinc-50/30 dark:bg-zinc-900/10'
                    }`}
                  >
                    <td className="py-3 px-4 sticky left-0 bg-white dark:bg-zinc-950 z-10 border-r border-zinc-100 dark:border-zinc-900">
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">{student.name}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-zinc-400">NIS: {student.nis || '-'}</span>
                          {info.points > 0 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 rounded">
                              {info.points} Poin Pelanggaran
                            </span>
                          )}
                          <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded">
                            Rekomendasi: {info.rec}
                          </span>
                        </div>
                      </div>
                    </td>
                    {AKHLAQ_CATEGORIES.map((cat) => {
                      const currentGrade = gradeMap[student.id]?.[cat] || '';
                      return (
                        <td key={cat} className="py-2 px-3 text-center">
                          <Select
                            value={currentGrade || 'none'}
                            onValueChange={(v) => { if (v !== 'none') setGrade(student.id, cat, v as string); }}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger className={`h-8 text-xs font-semibold w-16 mx-auto ${
                              currentGrade === 'A' ? 'text-emerald-700 border-emerald-300 bg-emerald-50' :
                              currentGrade === 'B' ? 'text-blue-700 border-blue-300 bg-blue-50' :
                              currentGrade === 'C' ? 'text-amber-700 border-amber-300 bg-amber-50' :
                              currentGrade === 'D' ? 'text-red-700 border-red-300 bg-red-50' :
                              'dark:bg-zinc-950'
                            }`}>
                              <SelectValue placeholder="—" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-zinc-950">
                              <SelectItem value="none" className="text-zinc-400">— Pilih</SelectItem>
                              {GRADES.map((g) => (
                                <SelectItem key={g.value} value={g.value}>{g.value}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : selectedClassId ? (
        <Card className="flex flex-col items-center py-16 border-dashed dark:bg-zinc-950">
          <Heart className="h-10 w-10 text-zinc-300 mb-3 animate-pulse" />
          <p className="text-sm text-zinc-500">Belum ada siswi terdaftar di kelas ini.</p>
        </Card>
      ) : (
        <Card className="flex flex-col items-center py-20 border-dashed dark:bg-zinc-950">
          <Heart className="h-10 w-10 text-rose-400/80 dark:text-rose-400/60 mb-3" />
          <p className="text-sm font-semibold text-zinc-500">Pilih Tahun Ajaran, Semester, dan Kelas</p>
          <p className="text-xs text-zinc-400 mt-1">untuk mulai mengisi penilaian akhlaq.</p>
        </Card>
      )}
    </div>
  );
}

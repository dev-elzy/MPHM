'use client';

import * as React from 'react';
import { CalendarDays, Save, Users, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { YearSelector } from '@/features/academic-years/components/YearSelector';
import { SemesterSelector } from '@/features/academic-years/components/SemesterSelector';
import { useAttendance, useAttendanceSummary } from '@/features/scores/queries/useScores';
import { useSaveBulkAttendance } from '@/features/scores/mutations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClasses } from '@/features/classes/queries/useClasses';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { getCurrentHijriDate, HIJRI_MONTH_NAMES } from '@/lib/utils/hijri';

export default function AbsensiPage() {
  const { isMustahiq, isSekretariat } = useAuthSession();
  const isReadOnly = !isMustahiq && !isSekretariat;

  const currentHijri = React.useMemo(() => getCurrentHijriDate(), []);
  const [selectedYearId, setSelectedYearId] = React.useState('');
  const [selectedSemesterId, setSelectedSemesterId] = React.useState('');
  const [selectedClassId, setSelectedClassId] = React.useState('');
  const [selectedMonth, setSelectedMonth] = React.useState<number>(currentHijri.month);
  const [selectedYear, setSelectedYear] = React.useState<number>(currentHijri.year);

  const { data: classesData } = useClasses(selectedYearId, selectedSemesterId);
  const classesList = classesData || [];

  // Auto-select class for Mustahiq when classesList changes
  React.useEffect(() => {
    if (classesList.length > 0 && !selectedClassId) {
      setSelectedClassId(classesList[0].id);
    }
  }, [classesList, selectedClassId]);

  const [attendanceMap, setAttendanceMap] = React.useState<
    Record<string, { sickCount: number; permissionCount: number; absentCount: number; notes: string }>
  >({});
  const [students, setStudents] = React.useState<{ id: string; name: string; nis: string | null }[]>([]);

  // Load monthly attendance records
  const { data: attendanceData } = useAttendance({
    academicYearId: selectedYearId,
    semesterId: selectedSemesterId,
    classId: selectedClassId,
    hijriMonth: selectedMonth,
    hijriYear: selectedYear,
  });

  // Load semester summaries
  const { data: summary } = useAttendanceSummary({
    academicYearId: selectedYearId,
    semesterId: selectedSemesterId,
    classId: selectedClassId,
  });

  const saveMutation = useSaveBulkAttendance();

  // Load students in class
  React.useEffect(() => {
    if (selectedClassId && selectedSemesterId) {
      fetch(`/api/v1/students?classId=${selectedClassId}&semesterId=${selectedSemesterId}&limit=200`)
        .then((r) => r.json())
        .then((d: unknown) => {
          const sData = d as { data?: { items?: { id: string; name: string; nis: string | null }[] } };
          setStudents(sData.data?.items || []);
        })
        .catch(console.error);
    } else {
      setTimeout(() => setStudents([]), 0);
    }
  }, [selectedClassId, selectedSemesterId]);

  // Hydrate map from database records
  React.useEffect(() => {
    if (!attendanceData) return;
    const map: Record<string, { sickCount: number; permissionCount: number; absentCount: number; notes: string }> = {};
    attendanceData.forEach((rec) => {
      map[rec.studentId] = {
        sickCount: rec.sickCount ?? 0,
        permissionCount: rec.permissionCount ?? 0,
        absentCount: rec.absentCount ?? 0,
        notes: rec.notes || '',
      };
    });
    setAttendanceMap(map);
  }, [attendanceData]);

  // Automatic Lock Check (Mustahiq can only edit active month during days 27-30)
  const isLockActive = React.useMemo(() => {
    if (!isMustahiq) return false; // Non-Mustahiq is handled by isReadOnly
    // Lock if month or year is not the active one
    if (selectedMonth !== currentHijri.month || selectedYear !== currentHijri.year) {
      return true;
    }
    // Lock if current Hijri day is less than 27
    return currentHijri.day < 27;
  }, [isMustahiq, selectedMonth, selectedYear, currentHijri]);

  const canEdit = !isReadOnly && !isLockActive;

  const handleSave = async () => {
    if (!selectedClassId || !selectedYearId || !selectedSemesterId) return;
    const records = students.map((s) => {
      const data = attendanceMap[s.id] || { sickCount: 0, permissionCount: 0, absentCount: 0, notes: '' };
      return {
        studentId: s.id,
        sickCount: data.sickCount,
        permissionCount: data.permissionCount,
        absentCount: data.absentCount,
        notes: data.notes || null,
      };
    });

    await saveMutation.mutateAsync({
      academicYearId: selectedYearId,
      semesterId: selectedSemesterId,
      classId: selectedClassId,
      hijriMonth: selectedMonth,
      hijriYear: selectedYear,
      records,
    });
  };

  const summaryStats = React.useMemo(() => {
    if (!summary) return { absent: 0, sick: 0, permission: 0 };
    return summary.reduce(
      (acc, s) => ({
        absent: acc.absent + s.absent,
        sick: acc.sick + s.sick,
        permission: acc.permission + s.permission,
      }),
      { absent: 0, sick: 0, permission: 0 }
    );
  }, [summary]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Rekap Absensi Hijriyah"
        description="Mencatat rekapitulasi ketidakhadiran siswi bulanan berdasarkan Kalender Hijriyah."
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

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Total Sakit Semester Ini', value: summaryStats.sick, color: 'text-blue-500' },
            { label: 'Total Izin Semester Ini', value: summaryStats.permission, color: 'text-amber-500' },
            { label: 'Total Alpha Semester Ini', value: summaryStats.absent, color: 'text-red-500' },
          ].map((stat) => (
            <Card key={stat.label} className="border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-950/40">
              <CardContent className="py-4 px-5">
                <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value} Hari</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selection controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Kelas Rombel</label>
          <div className="h-9 flex items-center px-3 text-sm font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 min-w-[150px]">
            {classesList.find((c) => c.id === selectedClassId)?.name || 'Memuat Kelas...'}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Bulan Hijriyah</label>
          <Select value={selectedMonth ? selectedMonth.toString() : ''} onValueChange={(v) => { if (v) setSelectedMonth(parseInt(v, 10)); }}>
            <SelectTrigger className="h-9 text-sm dark:bg-zinc-950">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950">
              {HIJRI_MONTH_NAMES.map((name, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {index + 1}. {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Tahun Hijriyah</label>
          <input
            type="number"
            min="1400"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value) || currentHijri.year)}
            className="h-9 w-full text-sm px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>
      </div>

      {/* Lock state notifications */}
      {selectedClassId && (
        <>
          {isReadOnly && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
              <Lock className="h-4 w-4 shrink-0" />
              Anda dalam mode monitoring (hanya baca). Hanya pengajar kelas ini yang dapat mencatat absensi.
            </div>
          )}
          {!isReadOnly && isLockActive && (
            <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm">
              <Lock className="h-4 w-4 shrink-0" />
              <div>
                <strong>Form Absensi Terkunci:</strong> Pengisian rekap absensi bulan {HIJRI_MONTH_NAMES[selectedMonth - 1]} {selectedYear} H hanya dibuka pada 3 hari terakhir bulan Hijriyah aktif berjalan (tanggal 27-30). Hari ini tanggal {currentHijri.day} Hijriyah.
              </div>
            </div>
          )}
          {!isReadOnly && !isLockActive && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm">
              <Unlock className="h-4 w-4 shrink-0" />
              <strong>Form Terbuka:</strong> Anda dapat mengedit rekap absensi untuk bulan Hijriyah aktif ({HIJRI_MONTH_NAMES[selectedMonth - 1]} {selectedYear} H).
            </div>
          )}
        </>
      )}

      {selectedClassId && students.length > 0 && (
        <Card className="border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Users className="h-4 w-4 text-zinc-400" />
              {students.length} Siswi — Rekap {HIJRI_MONTH_NAMES[selectedMonth - 1]} {selectedYear} H
            </CardTitle>
            {canEdit && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="h-8 text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 gap-1.5 hover:bg-zinc-800"
              >
                <Save className="h-3.5 w-3.5" />
                {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Rekap'}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {students.map((student, idx) => (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 w-6 text-right">{idx + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{student.name}</p>
                      <p className="text-xs text-zinc-400">NIS: {student.nis || '-'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 w-12">Sakit (S):</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        disabled={!canEdit}
                        value={attendanceMap[student.id]?.sickCount ?? 0}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                          setAttendanceMap((prev) => ({
                            ...prev,
                            [student.id]: {
                              ...(prev[student.id] || { sickCount: 0, permissionCount: 0, absentCount: 0, notes: '' }),
                              sickCount: val,
                            },
                          }));
                        }}
                        className="w-12 h-8 text-center text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-950 outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-60"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 w-12">Izin (I):</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        disabled={!canEdit}
                        value={attendanceMap[student.id]?.permissionCount ?? 0}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                          setAttendanceMap((prev) => ({
                            ...prev,
                            [student.id]: {
                              ...(prev[student.id] || { sickCount: 0, permissionCount: 0, absentCount: 0, notes: '' }),
                              permissionCount: val,
                            },
                          }));
                        }}
                        className="w-12 h-8 text-center text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-950 outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-60"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 w-12">Alfa (A):</span>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        disabled={!canEdit}
                        value={attendanceMap[student.id]?.absentCount ?? 0}
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                          setAttendanceMap((prev) => ({
                            ...prev,
                            [student.id]: {
                              ...(prev[student.id] || { sickCount: 0, permissionCount: 0, absentCount: 0, notes: '' }),
                              absentCount: val,
                            },
                          }));
                        }}
                        className="w-12 h-8 text-center text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-950 outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-60"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Catatan..."
                      disabled={!canEdit}
                      value={attendanceMap[student.id]?.notes ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAttendanceMap((prev) => ({
                          ...prev,
                          [student.id]: {
                            ...(prev[student.id] || { sickCount: 0, permissionCount: 0, absentCount: 0, notes: '' }),
                            notes: val,
                          },
                        }));
                      }}
                      className="w-32 h-8 px-2 text-xs border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-950 outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-60"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedClassId && students.length === 0 && (
        <Card className="flex flex-col items-center py-20 border-dashed dark:bg-zinc-950 border-zinc-200/60 dark:border-zinc-800/60">
          <CalendarDays className="h-10 w-10 text-zinc-300 mb-3" />
          <p className="text-sm text-zinc-500">Belum ada siswi terdaftar di kelas ini.</p>
        </Card>
      )}
    </div>
  );
}

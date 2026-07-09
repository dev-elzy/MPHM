'use client';

import * as React from 'react';
import { CalendarDays, Save, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { YearSelector } from '@/features/academic-years/components/YearSelector';
import { SemesterSelector } from '@/features/academic-years/components/SemesterSelector';
import { useAttendanceSummary } from '@/features/scores/queries/useScores';
import { useSaveBulkAttendance } from '@/features/scores/mutations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClasses } from '@/features/classes/queries/useClasses';

const ATTENDANCE_STATUSES = [
  { value: 'present', label: 'Hadir', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'absent', label: 'Alpha', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'sick', label: 'Sakit', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'permission', label: 'Izin', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'late', label: 'Telat', color: 'bg-purple-100 text-purple-700 border-purple-200' },
];

export default function AbsensiPage() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedYearId, setSelectedYearId] = React.useState('');
  const [selectedSemesterId, setSelectedSemesterId] = React.useState('');
  const [selectedClassId, setSelectedClassId] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(today);
  const { data: classesData } = useClasses(selectedYearId, selectedSemesterId);
  const classesList = classesData || [];
  const [attendanceMap, setAttendanceMap] = React.useState<Record<string, string>>({});
  const [students, setStudents] = React.useState<{ id: string; name: string; nis: string | null }[]>([]);

  const { data: summary } = useAttendanceSummary({
    academicYearId: selectedYearId,
    semesterId: selectedSemesterId,
    classId: selectedClassId,
  });

  const saveMutation = useSaveBulkAttendance();

  // Load students for class and hydrate existing attendance for selected date
  React.useEffect(() => {
    if (selectedClassId && selectedSemesterId) {
      Promise.all([
        fetch(`/api/v1/students?classId=${selectedClassId}&semesterId=${selectedSemesterId}&limit=200`)
          .then((r) => r.json()),
        selectedYearId && selectedDate
          ? fetch(`/api/v1/attendance?academicYearId=${selectedYearId}&semesterId=${selectedSemesterId}&classId=${selectedClassId}&date=${selectedDate}`)
              .then((r) => r.json())
          : Promise.resolve(null),
      ])
        .then(([studentsRes, attendanceRes]: unknown[]) => {
          const sData = studentsRes as { data?: { items?: { id: string; name: string; nis: string | null }[] } };
          const items = sData.data?.items || [];
          setStudents(items);

          // Build map: start with default 'present', then overlay existing records
          const init: Record<string, string> = {};
          items.forEach((s) => { init[s.id] = 'present'; });

          if (attendanceRes) {
            const aData = attendanceRes as { data?: { studentId: string; status: string }[] };
            const existing = aData.data || [];
            existing.forEach((rec) => {
              if (init[rec.studentId] !== undefined) {
                init[rec.studentId] = rec.status;
              }
            });
          }

          setAttendanceMap(init);
        })
        .catch(console.error);
    } else {
      setTimeout(() => {
        setStudents([]);
        setAttendanceMap({});
      }, 0);
    }
  }, [selectedClassId, selectedSemesterId, selectedYearId, selectedDate]);

  const handleSave = async () => {
    if (!selectedClassId || !selectedYearId || !selectedSemesterId) return;
    await saveMutation.mutateAsync({
      academicYearId: selectedYearId,
      semesterId: selectedSemesterId,
      classId: selectedClassId,
      date: selectedDate,
      records: Object.entries(attendanceMap).map(([studentId, status]) => ({ studentId, status })),
    });
  };

  const summaryStats = React.useMemo(() => {
    if (!summary) return { present: 0, absent: 0, sick: 0, permission: 0, late: 0 };
    return summary.reduce(
      (acc, s) => ({
        present: acc.present + s.present,
        absent: acc.absent + s.absent,
        sick: acc.sick + s.sick,
        permission: acc.permission + s.permission,
        late: acc.late + s.late,
      }),
      { present: 0, absent: 0, sick: 0, permission: 0, late: 0 }
    );
  }, [summary]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Absensi Siswi"
        description="Catat kehadiran siswi per tanggal dan lihat rekap absensi semester berjalan."
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Hadir', value: summaryStats.present, color: 'text-emerald-600' },
            { label: 'Total Alpha', value: summaryStats.absent, color: 'text-red-500' },
            { label: 'Total Sakit', value: summaryStats.sick, color: 'text-blue-500' },
            { label: 'Total Izin', value: summaryStats.permission, color: 'text-amber-500' },
            { label: 'Total Telat', value: summaryStats.late, color: 'text-purple-500' },
          ].map((stat) => (
            <Card key={stat.label} className="dark:bg-zinc-950">
              <CardContent className="py-4 px-5">
                <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Attendance form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Kelas Rombel</label>
          <Select
            value={selectedClassId}
            onValueChange={(v) => setSelectedClassId(v || '')}
          >
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
        <div>
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Tanggal</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 w-full text-sm px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>
      </div>

      {selectedClassId && students.length > 0 && (
        <Card className="dark:bg-zinc-950">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Users className="h-4 w-4 text-zinc-400" />
              {students.length} Siswi — {selectedDate}
            </CardTitle>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="h-8 text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Absensi'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {students.map((student, idx) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 w-6 text-right">{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{student.name}</p>
                      <p className="text-xs text-zinc-400">NIS: {student.nis || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {ATTENDANCE_STATUSES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setAttendanceMap((prev) => ({ ...prev, [student.id]: s.value }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          attendanceMap[student.id] === s.value
                            ? s.color + ' font-semibold shadow-sm'
                            : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedClassId && students.length === 0 && (
        <Card className="flex flex-col items-center py-20 border-dashed dark:bg-zinc-950">
          <CalendarDays className="h-10 w-10 text-zinc-300 mb-3" />
          <p className="text-sm text-zinc-500">Belum ada siswi terdaftar di kelas ini.</p>
        </Card>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, GraduationCap, Users } from 'lucide-react';

interface AcademicClassItem {
  id: string;
  className: string;
  classCode: string;
  academicYearId: string;
}

interface EnrollmentRow {
  id: string;
  studentProfileId: string;
  studentName: string;
  nisn: string;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

type DecisionType = 'PROMOTED' | 'RETAINED' | 'BOYONG' | 'GRADUATED';

interface StudentPromotionItem {
  enrollmentId: string;
  studentProfileId: string;
  studentName: string;
  nisn: string;
  decision: DecisionType;
  targetClassId: string;
}

export function PromotionEnginePage() {
  const [classes, setClasses] = useState<AcademicClassItem[]>([]);
  const [sourceYear, setSourceYear] = useState('2026-2027');
  const [targetYear, setTargetYear] = useState('2027-2028');
  const [selectedSourceClassId, setSelectedSourceClassId] = useState<string>('');
  const [students, setStudents] = useState<StudentPromotionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await fetch('/api/v1/academic/classes');
        const json = (await res.json()) as ApiResponse<AcademicClassItem[]>;
        if (json.success && json.data) {
          setClasses(json.data);
        }
      } catch (e: unknown) {
        console.error('Load classes error:', e);
      }
    };
    loadClasses();
  }, []);

  const handleSelectSourceClass = async (classId: string) => {
    setSelectedSourceClassId(classId);
    setResultMessage(null);
    if (!classId) {
      setStudents([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/academic/enrollments?classId=${classId}`);
      const json = (await res.json()) as ApiResponse<EnrollmentRow[]>;
      if (json.success && json.data) {
        const mapped: StudentPromotionItem[] = json.data.map((row) => ({
          enrollmentId: row.id,
          studentProfileId: row.studentProfileId,
          studentName: row.studentName,
          nisn: row.nisn,
          decision: 'PROMOTED',
          targetClassId: '',
        }));
        setStudents(mapped);
      }
    } catch (e: unknown) {
      console.error('Failed to load students:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentDecision = (index: number, decision: DecisionType, targetClassId: string) => {
    const next = [...students];
    next[index].decision = decision;
    next[index].targetClassId = targetClassId;
    setStudents(next);
  };

  const handleExecutePromotion = async () => {
    if (students.length === 0) return;
    setProcessing(true);
    setResultMessage(null);
    try {
      const res = await fetch('/api/v1/academic/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAcademicYearId: sourceYear,
          toAcademicYearId: targetYear,
          promotions: students.map((s) => ({
            enrollmentId: s.enrollmentId,
            studentProfileId: s.studentProfileId,
            decision: s.decision,
            targetClassId: s.targetClassId || undefined,
          })),
        }),
      });
      const json = (await res.json()) as ApiResponse<unknown>;
      if (res.ok && json.success) {
        setResultMessage(json.message || 'Kenaikan kelas berhasil diproses permanen.');
      } else {
        setResultMessage(`Gagal memproses: ${json.message || 'Kesalahan validasi'}`);
      }
    } catch (e: unknown) {
      console.error(e);
      setResultMessage('Terjadi kesalahan koneksi saat menjalankan Promotion Engine');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-emerald-600" />
          Mesin Kenaikan Kelas & Kelulusan (Promotion Engine)
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Proses transisi akhir tahun ajaran tanpa menghapus histori data. Rekam jejak santri tersimpan utuh dan abadi.
        </p>
      </div>

      {/* Selector Box */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Tahun Ajaran Asal
          </label>
          <input
            type="text"
            value={sourceYear}
            onChange={(e) => setSourceYear(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Kelas Asal
          </label>
          <select
            value={selectedSourceClassId}
            onChange={(e) => handleSelectSourceClass(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium"
          >
            <option value="">-- Pilih Kelas --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.className} ({c.classCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Tahun Ajaran Tujuan
          </label>
          <input
            type="text"
            value={targetYear}
            onChange={(e) => setTargetYear(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold text-emerald-600"
          />
        </div>
      </div>

      {/* Result feedback */}
      {resultMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{resultMessage}</span>
        </div>
      )}

      {/* Student List for Promotion */}
      {loading ? (
        <div className="p-10 text-center text-slate-400">Memuat daftar santri di kelas terpilih...</div>
      ) : students.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              Daftar Santri yang Akan Diproses ({students.length} Siswi)
            </h3>
            <button
              onClick={handleExecutePromotion}
              disabled={processing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-50"
            >
              <span>{processing ? 'Memproses...' : 'Proses Kenaikan Kelas Permanen'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {students.map((st, idx) => (
              <div key={st.enrollmentId} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{st.studentName}</p>
                  <p className="text-xs text-slate-500">NISN: {st.nisn}</p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={st.decision}
                    onChange={(e) =>
                      updateStudentDecision(idx, e.target.value as DecisionType, st.targetClassId)
                    }
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="PROMOTED">Naik Kelas (PROMOTED)</option>
                    <option value="RETAINED">Tinggal Kelas (RETAINED)</option>
                    <option value="GRADUATED">Lulus Alumni (GRADUATED)</option>
                    <option value="BOYONG">Boyong / Keluar (BOYONG)</option>
                  </select>

                  {(st.decision === 'PROMOTED' || st.decision === 'RETAINED') && (
                    <select
                      value={st.targetClassId}
                      onChange={(e) => updateStudentDecision(idx, st.decision, e.target.value)}
                      className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="">-- Pilih Kelas Tujuan --</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.className}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        selectedSourceClassId && (
          <div className="p-10 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm">Tidak ada santri aktif di kelas ini.</p>
          </div>
        )
      )}
    </div>
  );
}

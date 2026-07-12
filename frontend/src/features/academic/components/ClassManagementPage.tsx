'use client';

import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Plus, Search, ShieldAlert } from 'lucide-react';

interface AcademicClassItem {
  id: string;
  academicYearId: string;
  jenjangId: string;
  tingkatId: string;
  className: string;
  classCode: string;
  mustahiqId?: string | null;
  mustahiqName?: string | null;
  capacity: number;
  enrolledCount: number;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const JENJANG_NAMES: Record<string, string> = {
  '1': "I'dadiyyah",
  '2': "Ibtida'iyyah",
  '3': 'Tsanawiyyah',
  '4': 'Aliyyah',
};

export function ClassManagementPage() {
  const [classes, setClasses] = useState<AcademicClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newYear, setNewYear] = useState('2026-2027');
  const [newJenjang, setNewJenjang] = useState('2');
  const [newTingkat, setNewTingkat] = useState('II');
  const [newClassName, setNewClassName] = useState('Ibtidaiyyah II-B');
  const [newClassCode, setNewClassCode] = useState('IBT-2B-2627');
  const [newCapacity, setNewCapacity] = useState(35);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/v1/academic/classes');
      const json = (await res.json()) as ApiResponse<AcademicClassItem[]>;
      if (json.success && json.data) {
        setClasses(json.data);
      }
    } catch (e: unknown) {
      console.error('Failed to load academic classes:', e);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/v1/academic/classes');
        const json = (await res.json()) as ApiResponse<AcademicClassItem[]>;
        if (active && json.success && json.data) {
          setClasses(json.data);
        }
      } catch (e: unknown) {
        console.error('Failed to load academic classes:', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const res = await fetch('/api/v1/academic/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academicYearId: newYear,
          jenjangId: newJenjang,
          tingkatId: newTingkat,
          className: newClassName,
          classCode: newClassCode,
          capacity: Number(newCapacity),
        }),
      });
      const json = (await res.json()) as ApiResponse<{ id: string }>;
      if (!res.ok || !json.success) {
        setErrorMessage(json.message || 'Gagal membuat kelas baru');
        return;
      }
      setShowCreateModal(false);
      fetchClasses();
    } catch (e: unknown) {
      console.error('Create class error:', e);
      setErrorMessage('Terjadi kesalahan koneksi');
    }
  };

  const filtered = classes.filter(
    (c) =>
      c.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.classCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Manajemen Rombongan Belajar (Kelas)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Kelola kelas akademik, kuota kapasitas, dan penugasan Wali Kelas (Mustahiq) sesuai Person-Centric Architecture.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Buat Rombel Baru
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari kelas atau kode rombel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Class Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Memuat data rombongan belajar...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Belum ada kelas atau rombel yang cocok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const occupancyRatio = Math.min(100, Math.round((item.enrolledCount / item.capacity) * 100));
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full mb-2">
                      {JENJANG_NAMES[item.jenjangId] || 'Jenjang'} · {item.tingkatId}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.className}</h3>
                    <p className="text-xs text-slate-500">Kode: {item.classCode} · TA: {item.academicYearId}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">
                    {item.status}
                  </span>
                </div>

                {/* Mustahiq info */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Wali Kelas / Mustahiq</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {item.mustahiqName || 'Belum Ditugaskan'}
                    </p>
                  </div>
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Kapasitas Santri</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {item.enrolledCount} / {item.capacity}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${occupancyRatio}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Buat Rombongan Belajar Baru</h2>

            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateClass} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Jenjang
                  </label>
                  <select
                    value={newJenjang}
                    onChange={(e) => setNewJenjang(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="1">I&apos;dadiyyah</option>
                    <option value="2">Ibtida&apos;iyyah</option>
                    <option value="3">Tsanawiyyah</option>
                    <option value="4">Aliyyah</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Tingkat
                  </label>
                  <select
                    value={newTingkat}
                    onChange={(e) => setNewTingkat(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                    <option value="VI">VI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Kapasitas
                  </label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Kode Kelas
                </label>
                <input
                  type="text"
                  value={newClassCode}
                  onChange={(e) => setNewClassCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

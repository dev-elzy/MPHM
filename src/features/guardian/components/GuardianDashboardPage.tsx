'use client';

import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  User,
  GraduationCap,
  ShieldCheck,
  FileText,
  Bell,
  Award,
} from 'lucide-react';

interface WardViolation {
  id: string;
  incidentDate: string;
  description: string;
  status: string;
  typeName?: string | null;
  severityName?: string | null;
  severityLevel?: number | null;
}

interface WardData {
  profile: {
    studentProfileId: string;
    nisn: string;
    entryYear: string;
    dormitoryRoom?: string | null;
    status: string;
    fullName?: string | null;
    photoUrl?: string | null;
  };
  currentClass?: {
    className: string;
    classCode: string;
    jenjangId: string;
    tingkatId: string;
  } | null;
  violations: WardViolation[];
  summary: {
    attendancePercentage: number;
    academicAverageScore: number;
    totalViolations: number;
    akhlaqPredicate: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function GuardianDashboardPage() {
  const [wards, setWards] = useState<WardData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'violations' | 'academic' | 'announcements'>('overview');

  useEffect(() => {
    let active = true;
    const fetchPortalData = async () => {
      try {
        const res = await fetch('/api/v1/guardian/portal');
        const json = (await res.json()) as ApiResponse<WardData[]>;
        if (active && json.success && Array.isArray(json.data)) {
          setWards(json.data);
        }
      } catch (e: unknown) {
        console.error('Failed to fetch guardian portal data:', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchPortalData();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400">
        Memuat Portal Wali Santri 360°...
      </div>
    );
  }

  if (wards.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <HeartHandshake className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Belum Ada Data Santri Terhubung</h2>
        <p className="text-sm text-slate-500 mt-1">
          Akun Wali Santri Anda belum dihubungkan dengan Profil Santri aktif di sistem MPHM.
        </p>
      </div>
    );
  }

  const currentWard = wards[selectedIndex] || wards[0];
  const { profile, currentClass, violations, summary } = currentWard;

  return (
    <div className="space-y-6">
      {/* Read-Only Notice Banner */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HeartHandshake className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h1 className="text-base font-bold text-emerald-900 dark:text-emerald-100">
              Portal Resmi Wali Santri — Madrasah Putri Hidayatul Mubtadi&apos;at
            </h1>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Akses transparan Read-Only untuk memantau kedisiplinan, akhlaq, absensi, dan perkembangan akademik anak asuh.
            </p>
          </div>
        </div>

        {wards.length > 1 && (
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200"
          >
            {wards.map((w, idx) => (
              <option key={w.profile.studentProfileId} value={idx}>
                {w.profile.fullName || `Santri #${idx + 1}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-xl shrink-0">
            {profile.fullName ? profile.fullName.charAt(0) : <User className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {profile.fullName || 'Santri MPHM'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                {profile.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              NISN: {profile.nisn} · Angkatan: {profile.entryYear} · Asrama: {profile.dormitoryRoom || 'Pusat'}
            </p>
            {currentClass && (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                Kelas Aktif: {currentClass.className} ({currentClass.classCode})
              </p>
            )}
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl text-center">
            <p className="text-xs text-slate-400">Kehadiran</p>
            <p className="text-base font-bold text-emerald-600">{summary.attendancePercentage}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl text-center">
            <p className="text-xs text-slate-400">Rata-Rata Nilai</p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">{summary.academicAverageScore}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl text-center">
            <p className="text-xs text-slate-400">Predikat Akhlaq</p>
            <p className="text-xs font-bold text-emerald-600 mt-1">{summary.akhlaqPredicate}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl text-center">
            <p className="text-xs text-slate-400">Catatan Pelanggaran</p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">{summary.totalViolations}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Ringkasan 360°
        </button>

        <button
          onClick={() => setActiveTab('violations')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'violations'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Kedisiplinan & Akhlaq ({violations.length})
        </button>

        <button
          onClick={() => setActiveTab('academic')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'academic'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Rapor Akademik
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'announcements'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          Pengumuman Madrasah
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              Informasi Akademik & Asrama
            </h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Nama Lengkap:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{profile.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>NISN:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{profile.nisn}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Tahun Masuk:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{profile.entryYear}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Kamar Asrama:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{profile.dormitoryRoom || 'Pusat'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Catatan Kedisiplinan Terakhir
            </h3>
            {violations.length === 0 ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-center">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Alhamdulillah, tidak ada catatan pelanggaran yang tercatat.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {violations.slice(0, 3).map((v) => (
                  <div key={v.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{v.typeName || 'Pelanggaran'}</p>
                      <p className="text-slate-500">{v.incidentDate}</p>
                    </div>
                    <span className="px-2 py-0.5 font-bold rounded text-rose-600 bg-rose-100 dark:bg-rose-950">
                      {v.severityName || 'Sedang'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'violations' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            Riwayat Kedisiplinan & Pelanggaran Lengkap
          </h3>
          {violations.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Tidak ada pelanggaran tercatat.</div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {violations.map((v) => (
                <div key={v.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{v.typeName}</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">{v.description}</p>
                    <p className="text-slate-400 text-xxs mt-1">Tanggal Kejadian: {v.incidentDate}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <FileText className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Rapor Semester Aktif (Read-Only)</h3>
          <p className="text-xs text-slate-500">
            Nilai rapor semester genap tahun ajaran 2026/2027 sedang dalam tahap verifikasi oleh Mustahiq (Wali Kelas).
          </p>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-600">Pengumuman Pondok Pesantren</span>
              <span className="text-slate-400">01 Juli 2026</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Jadwal Perizinan & Libur Semester Genap</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pengambilan rapor dan penjemputan santri dilaksanakan mulai Jumat pagi dengan menunjukkan tiket perizinan dari portal Wali Santri.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

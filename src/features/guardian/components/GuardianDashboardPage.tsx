'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  HeartHandshake,
  User,
  FileText,
  Award,
  Clock,
  ShieldAlert
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
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [wards, setWards] = useState<WardData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'grades' | 'attendance' | 'violations' | 'report'>('profile');

  useEffect(() => {
    if (tabParam && ['profile', 'grades', 'attendance', 'violations', 'report'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

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

  // Mock score list matching the average
  const mockGrades = [
    { subject: 'Fathul Qorib (Fikih)', score: 90, grade: 'A', status: 'Lulus' },
    { subject: 'Alfiyah Ibn Malik (Sintaksis)', score: 88, grade: 'A', status: 'Lulus' },
    { subject: 'Imrithi (Tata Bahasa)', score: 92, grade: 'A', status: 'Lulus' },
    { subject: 'Shorof (Morfologi)', score: 85, grade: 'B', status: 'Lulus' },
    { subject: 'Akhlaq lil Banat (Etika)', score: 95, grade: 'A', status: 'Lulus' },
    { subject: 'Tauhid / Aqidatul Awam', score: 86, grade: 'B', status: 'Lulus' }
  ];

  const tabMeta = [
    {
      id: 'profile',
      label: 'Data Diri',
      icon: User,
      gradient: 'from-emerald-400 to-teal-600',
      activeShadow: 'shadow-[0_15px_30px_-5px_rgba(16,185,129,0.5),_inset_0_-4px_8px_rgba(0,0,0,0.2),_inset_0_4px_8px_rgba(255,255,255,0.4)]',
      hoverGlow: 'hover:shadow-[0_8px_20px_-3px_rgba(16,185,129,0.3)]',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'grades',
      label: 'Nilai',
      icon: Award,
      gradient: 'from-blue-400 to-indigo-600',
      activeShadow: 'shadow-[0_15px_30px_-5px_rgba(59,130,246,0.5),_inset_0_-4px_8px_rgba(0,0,0,0.2),_inset_0_4px_8px_rgba(255,255,255,0.4)]',
      hoverGlow: 'hover:shadow-[0_8px_20px_-3px_rgba(59,130,246,0.3)]',
      iconColor: 'text-blue-500'
    },
    {
      id: 'attendance',
      label: 'Absensi',
      icon: Clock,
      gradient: 'from-amber-400 to-orange-600',
      activeShadow: 'shadow-[0_15px_30px_-5px_rgba(245,158,11,0.5),_inset_0_-4px_8px_rgba(0,0,0,0.2),_inset_0_4px_8px_rgba(255,255,255,0.4)]',
      hoverGlow: 'hover:shadow-[0_8px_20px_-3px_rgba(245,158,11,0.3)]',
      iconColor: 'text-amber-500'
    },
    {
      id: 'violations',
      label: 'Pelanggaran',
      icon: ShieldAlert,
      gradient: 'from-rose-400 to-red-650',
      activeShadow: 'shadow-[0_15px_30px_-5px_rgba(239,68,68,0.5),_inset_0_-4px_8px_rgba(0,0,0,0.2),_inset_0_4px_8px_rgba(255,255,255,0.4)]',
      hoverGlow: 'hover:shadow-[0_8px_20px_-3px_rgba(239,68,68,0.3)]',
      iconColor: 'text-rose-500'
    },
    {
      id: 'report',
      label: 'Rapor',
      icon: FileText,
      gradient: 'from-violet-400 to-purple-600',
      activeShadow: 'shadow-[0_15px_30px_-5px_rgba(139,92,246,0.5),_inset_0_-4px_8px_rgba(0,0,0,0.2),_inset_0_4px_8px_rgba(255,255,255,0.4)]',
      hoverGlow: 'hover:shadow-[0_8px_20px_-3px_rgba(139,92,246,0.3)]',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6 pb-28">
      {/* 3D Animations CSS injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float3D {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes shadowPulse {
          0%, 100% { box-shadow: 0 15px 30px -5px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 25px 40px -5px rgba(0,0,0,0.35); }
        }
        .animate-3d-float {
          animation: float3D 3.5s ease-in-out infinite;
        }
        .dock-3d-perspective {
          perspective: 1000px;
        }
        .icon-3d-btn {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .icon-3d-btn:hover {
          transform: translateY(-12px) rotateX(15deg) rotateY(-10deg) scale(1.18);
        }
        .icon-3d-btn:active {
          transform: translateY(-2px) scale(0.95);
        }
      `}} />

      {/* Read-Only Notice Banner */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HeartHandshake className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-100">
              Portal Resmi Wali Santri — MPHM
            </h1>
          </div>
        </div>

        {wards.length > 1 && (
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200 focus:outline-none"
          >
            {wards.map((w, idx) => (
              <option key={w.profile.studentProfileId} value={idx}>
                {w.profile.fullName || `Santri #${idx + 1}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Hero Profile Card - ONLY shown on 'profile' tab */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-xl shrink-0">
              {profile.fullName ? profile.fullName.charAt(0) : <User className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {profile.fullName || 'Santri MPHM'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                  {profile.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Angkatan: {profile.entryYear} · Kamar Asrama: {profile.dormitoryRoom || 'Kamar 03 - Blok C'}
              </p>
              {currentClass && (
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  Kelas Aktif: {currentClass.className}
                </p>
              )}
            </div>
          </div>

          {/* 4 Quick Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl text-center border border-slate-100 dark:border-slate-800/40">
              <p className="text-[10px] font-medium text-slate-400 uppercase">Kehadiran</p>
              <p className="text-base font-bold text-emerald-600 mt-1">{summary.attendancePercentage}%</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl text-center border border-slate-100 dark:border-slate-800/40">
              <p className="text-[10px] font-medium text-slate-400 uppercase">Rata-Rata Nilai</p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">{summary.academicAverageScore}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl text-center border border-slate-100 dark:border-slate-800/40">
              <p className="text-[10px] font-medium text-slate-400 uppercase">Predikat Akhlaq</p>
              <p className="text-xs font-bold text-emerald-600 mt-2 truncate">{summary.akhlaqPredicate.split(' ')[0]}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl text-center border border-slate-100 dark:border-slate-800/40">
              <p className="text-[10px] font-medium text-slate-400 uppercase">Pelanggaran</p>
              <p className="text-base font-bold text-rose-500 mt-1">{summary.totalViolations}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="transition-all duration-350">
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
              <User className="w-4 h-4 text-emerald-600" />
              Data Diri & Profil Santriwati
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-3">
                <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Nama Lengkap</span>
                  <span className="font-bold text-slate-800 dark:text-white mt-0.5">{profile.fullName}</span>
                </div>
                <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">NISN</span>
                  <span className="font-semibold text-slate-850 dark:text-white mt-0.5">{profile.nisn || '-'}</span>
                </div>
                <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Tahun Ajaran Masuk</span>
                  <span className="font-semibold text-slate-850 dark:text-white mt-0.5">{profile.entryYear}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Status Kesantrian</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{profile.status.toUpperCase()}</span>
                </div>
                <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Kamar Pondok</span>
                  <span className="font-bold text-slate-800 dark:text-white mt-0.5">{profile.dormitoryRoom || 'Kamar 03 - Blok C'}</span>
                </div>
                <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wide">Rombel Kelas Saat Ini</span>
                  <span className="font-bold text-slate-850 dark:text-white mt-0.5">{currentClass?.className || 'Belum Ditetapkan'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Daftar Nilai Tamrin & Pelajaran Terakhir
              </h3>
              <span className="text-xs text-slate-400">Rata-Rata: {summary.academicAverageScore}</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-left">
                    <th className="py-2 font-bold uppercase tracking-wider">Mata Pelajaran</th>
                    <th className="py-2 text-center font-bold uppercase tracking-wider">Skor Angka</th>
                    <th className="py-2 text-center font-bold uppercase tracking-wider">Nilai Huruf</th>
                    <th className="py-2 text-right font-bold uppercase tracking-wider">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {mockGrades.map((g) => (
                    <tr key={g.subject} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{g.subject}</td>
                      <td className="py-3 text-center font-bold font-mono text-emerald-600">{g.score}</td>
                      <td className="py-3 text-center font-bold">{g.grade}</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded">
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Laporan & Rekap Absensi Bulanan
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full border-8 border-emerald-500/20 border-t-emerald-600 flex items-center justify-center text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {summary.attendancePercentage}%
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-4">Tingkat Kehadiran Kumulatif</p>
                <p className="text-[10px] text-slate-400 mt-1">Total kehadiran dalam Semester Ganjil berjalan</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Rincian Hari Kehadiran</h4>
                {[
                  { label: 'Hadir', count: '108 Hari', color: 'bg-emerald-500' },
                  { label: 'Sakit', count: '2 Hari', color: 'bg-blue-500' },
                  { label: 'Izin Resmi', count: '3 Hari', color: 'bg-amber-500' },
                  { label: 'Telat Kelas', count: '1 Kali', color: 'bg-purple-500' },
                  { label: 'Alpha (Tanpa Keterangan)', count: '0 Hari', color: 'bg-red-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'violations' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Catatan Pelanggaran & Kedisiplinan
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-full">
                {violations.length} Kasus Aktif
              </span>
            </div>

            {violations.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/20 rounded-xl">
                <Award className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Alhamdulillah, Nihil Pelanggaran</p>
                <p className="text-xs text-slate-400 mt-1">Anak asuh Anda menunjukkan budi pekerti yang sangat baik.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {violations.map((v) => (
                  <div key={v.id} className="p-4 rounded-xl bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100/40 dark:border-rose-900/10 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-700 dark:text-rose-450 uppercase">{v.typeName || 'Pelanggaran'}</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 rounded">
                        {v.severityName || 'Sedang'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-350">{v.description}</p>
                    <p className="text-[10px] text-slate-400 pt-1">Tanggal Kejadian: {v.incidentDate} · Status: {v.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'report' && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <FileText className="w-14 h-14 text-emerald-600 mx-auto bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl" />
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">E-Rapor Digital Semester Ganjil</h3>
              <p className="text-xs text-slate-400 mt-1">Tahun Ajaran 2025/2026 · Madrasah Putri Hidayatul Mubtadi&apos;at</p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-left space-y-2.5 border border-slate-100 dark:border-slate-800/50">
              <div className="flex justify-between">
                <span className="text-slate-400">Wali Kelas / Mustahiq:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Ustadz Charis Wahyudi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Kelulusan:</span>
                <span className="font-bold text-emerald-600">LULUS (MEMUASKAN)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tanggal Pengesahan:</span>
                <span className="font-semibold text-slate-850 dark:text-slate-300">11 Juli 2026</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating 3D Animated Dock (Centered & Responsive for ALL screen sizes) */}
      <div className="dock-3d-perspective fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md sm:max-w-lg px-4 py-3 bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl border border-white/20 dark:border-slate-800/40 rounded-[28px] shadow-[0_20px_45px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_45px_-8px_rgba(0,0,0,0.35)] flex justify-around items-center gap-1">
        {tabMeta.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'grades' | 'attendance' | 'violations' | 'report')}
              title={tab.label}
              className={`icon-3d-btn relative flex items-center justify-center w-12 h-12 rounded-[20px] transition-all cursor-pointer ${
                isActive
                  ? `bg-linear-to-br ${tab.gradient} ${tab.activeShadow} text-white animate-3d-float`
                  : `bg-slate-100/75 dark:bg-slate-800/70 ${tab.hoverGlow} text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200`
              }`}
            >
              <Icon className={`w-5.5 h-5.5 ${isActive ? 'stroke-[2.2px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]' : 'stroke-[1.8px]'}`} />
              
              {/* Subtle indicator dot below active icon */}
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

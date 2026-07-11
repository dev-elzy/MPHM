'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  PlusCircle,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  BarChart3,
  Award,
} from 'lucide-react';

interface SecurityDashboardData {
  todayCount: number;
  weekCount: number;
  statusBreakdown: {
    Dilaporkan: number;
    Diproses: number;
    Selesai: number;
  };
  topViolators: { studentName: string; studentNis: string; count: number }[];
  topViolationTypes: { typeName: string; categoryName: string; count: number }[];
  recentIncidents: Record<string, unknown>[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function SecurityDashboard() {
  const [data, setData] = useState<SecurityDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuickModal, setShowQuickModal] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/dashboard/security');
        const json = (await res.json()) as ApiResponse<SecurityDashboardData>;
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Fetch Security Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">
        Memuat analitik real-time Dashboard Petugas Keamanan...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Portal Keamanan & Ketertiban
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dashboard Petugas Keamanan</h1>
          <p className="text-sm text-slate-300 mt-1">
            Pantauan kedisiplinan harian santri, verifikasi kamar, dan pencatatan insiden secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Trigger global command palette search
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm transition-colors border border-white/15"
          >
            <Search className="w-4 h-4" />
            <span>Cari Santri (CTRL+K)</span>
          </button>
          <button
            onClick={() => setShowQuickModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-red-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Lapor Pelanggaran</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pelanggaran Hari Ini</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{data?.todayCount || 0}</p>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">● Pantauan Aktif</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Minggu Ini</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{data?.weekCount || 0}</p>
            <span className="text-xs text-slate-400 font-medium mt-1 inline-block">Total Insiden Tercatat</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status Diproses</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {data?.statusBreakdown.Diproses || 0}
            </p>
            <span className="text-xs text-blue-600 font-medium mt-1 inline-block">Dalam pembinaan</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Selesai Ditangani</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {data?.statusBreakdown.Selesai || 0}
            </p>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Tuntas</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Top Violators & Top Violation Types Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Violators Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Santri Terbanyak Melanggar</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Top 5 Leaderboard</span>
          </div>

          <div className="space-y-4">
            {(!data?.topViolators || data.topViolators.length === 0) ? (
              <p className="text-sm text-slate-500 text-center py-6">Belum ada data pelanggaran.</p>
            ) : (
              data.topViolators.map((v, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{v.studentName}</div>
                      <div className="text-xs text-slate-400">NIS: {v.studentNis}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                    {v.count} Kali
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Violation Types Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Jenis Pelanggaran Terbanyak</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Top 5 Statistik</span>
          </div>

          <div className="space-y-4">
            {(!data?.topViolationTypes || data.topViolationTypes.length === 0) ? (
              <p className="text-sm text-slate-500 text-center py-6">Belum ada statistik jenis pelanggaran.</p>
            ) : (
              data.topViolationTypes.map((vt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{vt.typeName}</div>
                    <div className="text-xs text-slate-400">Kategori: {vt.categoryName}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    {vt.count} Kasus
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showQuickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Lapor Pelanggaran Cepat</h3>
            <p className="text-sm text-slate-500">
              Silakan gunakan Modul Pelanggaran lengkap untuk mencatat insiden detail beserta bukti kejadian.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowQuickModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
              >
                Tutup
              </button>
              <a
                href="/dashboard/keamanan/pelanggaran"
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700"
              >
                Buka Modul Pelanggaran
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

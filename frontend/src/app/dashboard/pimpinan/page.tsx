'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users, BookOpen, GraduationCap, School, Activity,
  BarChart3, Clock, ClipboardCheck, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export default function PimpinanDashboardPage() {
  const { user } = useAuthSession();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold mb-2">
            Pimpinan Pesantren / Mundzir
          </span>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Ahlan wa Sahlan, {user?.name || 'Mudir'}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Pusat Monitoring Eksklusif Pimpinan Pesantren MPHM
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Santri Aktif', value: '320 Siswi', icon: GraduationCap, color: 'text-[#C9A050]', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { label: 'Total Alumni Ke-Alumnian', value: '1,450 Alumni', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Rombel Kelas Rinci', value: '12 Rombel', icon: School, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Total Laporan Pelanggaran', value: '12 Kejadian', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
        ].map((cfg) => {
          const Icon = cfg.icon;
          return (
            <Card key={cfg.label} className="dark:bg-zinc-950 overflow-hidden shadow-premium-3d border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">{cfg.label}</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{cfg.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${cfg.bg}`}>
                    <Icon className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress & Monitoring Action Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-panel shadow-premium-3d rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-zinc-400" />
              Statistik Kinerja Akademik Pondok
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Persentase Kehadiran Santri', pct: 97, color: 'bg-emerald-500' },
              { label: 'Pengisian Nilai Akademik', pct: 89, color: 'bg-blue-500' },
              { label: 'Tingkat Kelulusan Ujian Akhir', pct: 94, color: 'bg-indigo-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-600 dark:text-zinc-400">{item.label}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{item.pct}%</span>
                </div>
                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monitoring Actions */}
        <Card className="glass-panel shadow-premium-3d rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Activity className="h-4 w-4 text-zinc-400" />
              Monitoring Menyeluruh (Hanya Baca)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Database Siswi', href: '/dashboard/pimpinan/akademik/siswi', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                { label: 'Monitoring Nilai', href: '/dashboard/pimpinan/akademik/nilai', icon: BookOpen, color: 'text-[#C9A050]', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                { label: 'Monitoring Absensi', href: '/dashboard/pimpinan/akademik/absensi', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                { label: 'Monitoring Akhlaq', href: '/dashboard/pimpinan/akademik/akhlaq', icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                { label: 'Rombel Kelas', href: '/dashboard/pimpinan/akademik/kelas', icon: School, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
                { label: 'Pelanggaran Global', href: '/dashboard/pimpinan/pelanggaran', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all group"
                  >
                    <div className={`p-1.5 rounded-lg ${link.bg}`}>
                      <Icon className={`h-4 w-4 ${link.color}`} />
                    </div>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Users, BookOpen, GraduationCap, School, Activity,
  BarChart3, TrendingUp, Clock, CheckCircle, FileText,
  AlertCircle, Calendar, ClipboardCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { GuardianDashboardPage } from '@/features/guardian/components/GuardianDashboardPage';

interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalUsers: number;
  activeYear: { id: string; name: string; status: string } | null;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: { id: string; status: string; classId: string; updatedAt: number }[];
}

function useAdminDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', 'admin'],
    queryFn: async () => {
      const res = await fetch('/api/v1/dashboard/admin');
      if (!res.ok) throw new Error('Gagal mengambil data dashboard');
      const data = (await res.json()) as { data: DashboardData };
      return data.data;
    },
    staleTime: 60_000,
  });
}

function MustahiqDashboardView({ userName }: { userName: string }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            Staff Pengajar / Mustahiq
          </span>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Ahlan wa Sahlan, {userName}
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Portal Penilaian Akademik & Absensi Santriwati MPHM
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/akademik/nilai" className="group">
          <Card className="dark:bg-zinc-950 overflow-hidden shadow-premium-3d shadow-premium-3d-hover border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl transition-all group-hover:border-primary/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Mata Pelajaran</p>
                  <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Input Nilai</p>
                  <p className="text-xs text-zinc-400 mt-1.5">Nilai harian & ujian santriwati</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                  <BookOpen className="h-6 w-6 text-[#C9A050]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/akademik/absensi" className="group">
          <Card className="dark:bg-zinc-950 overflow-hidden shadow-premium-3d shadow-premium-3d-hover border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl transition-all group-hover:border-primary/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Kehadiran</p>
                  <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Absensi Harian</p>
                  <p className="text-xs text-zinc-400 mt-1.5">Catat kehadiran kelas</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/akademik/akhlaq" className="group">
          <Card className="dark:bg-zinc-950 overflow-hidden shadow-premium-3d shadow-premium-3d-hover border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl transition-all group-hover:border-primary/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Adab & Akhlaq</p>
                  <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Penilaian Akhlaq</p>
                  <p className="text-xs text-zinc-400 mt-1.5">Evaluasi perilaku santriwati</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                  <ClipboardCheck className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="glass-panel shadow-premium-3d rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-400" />
            Menu Pengajar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Input Nilai', href: '/dashboard/akademik/nilai', icon: BookOpen, color: 'text-[#C9A050]', bg: 'bg-amber-50 dark:bg-amber-500/10' },
              { label: 'Absensi Harian', href: '/dashboard/akademik/absensi', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
              { label: 'Penilaian Akhlaq', href: '/dashboard/akademik/akhlaq', icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
              { label: 'Jadwal Mengajar', href: '/dashboard/akademik/jadwal', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
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
  );
}

const STAT_CONFIG = [
  {
    key: 'totalStudents' as keyof DashboardStats,
    label: 'Total Siswi Aktif',
    icon: GraduationCap,
    color: 'text-[#C9A050]',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    trend: '+2 bulan ini',
  },
  {
    key: 'totalClasses' as keyof DashboardStats,
    label: 'Rombel Kelas',
    icon: School,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    trend: 'Aktif semester ini',
  },
  {
    key: 'totalUsers' as keyof DashboardStats,
    label: 'Staff & Mustahiq',
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    trend: 'Akun aktif',
  },
];

export default function DashboardPage() {
  const { user, isMustahiq, isGuardian } = useAuthSession();
  const { data, isLoading } = useAdminDashboard();

  const stats = data?.stats;
  const activity = React.useMemo(() => data?.recentActivity || [], [data?.recentActivity]);

  const sessionStatusCount = React.useMemo(() => {
    const counts = { draft: 0, ready: 0, final: 0, locked: 0 };
    activity.forEach((a) => {
      if (a.status in counts) counts[a.status as keyof typeof counts]++;
    });
    return counts;
  }, [activity]);

  if (isMustahiq) {
    return <MustahiqDashboardView userName={user?.name || 'Ustadz/ah'} />;
  }

  if (isGuardian) {
    return <GuardianDashboardPage />;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {stats?.activeYear
              ? `Tahun Ajaran Aktif: ${stats.activeYear.name}`
              : 'Belum ada Tahun Ajaran aktif'}
          </p>
        </div>
        {stats?.activeYear && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold ring-1 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Aktif
          </span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STAT_CONFIG.map((cfg) => {
          const Icon = cfg.icon;
          const value = stats ? (stats[cfg.key] as number) : null;
          return (
            <Card key={cfg.key} className="dark:bg-zinc-950 overflow-hidden shadow-premium-3d shadow-premium-3d-hover border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">{cfg.label}</p>
                    {isLoading ? (
                      <div className="h-8 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    ) : (
                      <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{value ?? '-'}</p>
                    )}
                    <p className="text-xs text-zinc-400 mt-1.5">{cfg.trend}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${cfg.bg}`}>
                    <Icon className={`h-6 w-6 ${cfg.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Score Session Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-panel shadow-premium-3d rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-zinc-400" />
              Progress Penilaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Draft', value: sessionStatusCount.draft, color: 'bg-blue-400', icon: FileText },
                  { label: 'Siap Finalisasi', value: sessionStatusCount.ready, color: 'bg-amber-400', icon: AlertCircle },
                  { label: 'Sudah Final', value: sessionStatusCount.final, color: 'bg-emerald-400', icon: CheckCircle },
                  { label: 'Dikunci', value: sessionStatusCount.locked, color: 'bg-zinc-400', icon: CheckCircle },
                ].map((item) => {
                  const total = activity.length || 1;
                  const pct = Math.round((item.value / total) * 100);
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-600 dark:text-zinc-400">{item.label}</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50">{item.value}</span>
                      </div>
                      <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${item.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="glass-panel shadow-premium-3d rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Activity className="h-4 w-4 text-zinc-400" />
              Akses Cepat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Input Nilai', href: '/dashboard/akademik/nilai', icon: BookOpen, color: 'text-[#C9A050]', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                { label: 'Absensi', href: '/dashboard/akademik/absensi', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                { label: 'Data Siswi', href: '/dashboard/akademik/siswi', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                { label: 'Pengguna', href: '/dashboard/pengguna', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
                { label: 'Penilaian Akhlaq', href: '/dashboard/akademik/akhlaq', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10' },
                { label: 'Kelas Rombel', href: '/dashboard/akademik/kelas', icon: School, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
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

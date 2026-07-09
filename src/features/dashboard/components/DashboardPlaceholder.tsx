'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, GraduationCap, Clock, Plus, ArrowUpRight, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

const stats = [
  {
    title: 'Santri Aktif',
    value: '1,248',
    trend: '+12%',
    description: 'vs bulan lalu',
    icon: Users,
  },
  {
    title: 'Kelas Berjalan',
    value: '42',
    trend: '+2',
    description: 'vs semester lalu',
    icon: BookOpen,
  },
  {
    title: 'Pengajar Aktif',
    value: '84',
    trend: '+5%',
    description: 'vs bulan lalu',
    icon: GraduationCap,
  },
  {
    title: 'Tingkat Kehadiran',
    value: '98.5%',
    trend: '+1.2%',
    description: 'vs minggu lalu',
    icon: Clock,
  },
];

const timeline = [
  { id: 1, user: 'Ahmad Faiz', action: 'Hadir di Kelas Fiqih', time: '2 menit yang lalu', type: 'success' },
  { id: 2, user: 'Ustadzah Halimah', action: 'Mengunggah Nilai UTS Kelas 4', time: '15 menit yang lalu', type: 'info' },
  { id: 3, user: 'Siti Aminah', action: 'Menyelesaikan Pendaftaran Ulang', time: '1 jam yang lalu', type: 'success' },
  { id: 4, user: 'Admin Sistem', action: 'Memperbarui Jadwal Semester Ganjil', time: '3 jam yang lalu', type: 'default' },
  { id: 5, user: 'Budi Santoso', action: 'Izin Sakit (Kelas Tauhid)', time: '5 jam yang lalu', type: 'warning' },
];

export function DashboardPlaceholder() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Overview</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Pantau ringkasan aktivitas akademik hari ini.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 shadow-sm text-zinc-700 dark:text-zinc-300">
            Unduh Laporan
          </Button>
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition-all">
            <Plus className="mr-2 h-4 w-4" /> Entri Baru
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.title}
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{stat.value}</div>
                  <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    {stat.trend}
                  </div>
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {/* Activity Timeline */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Linimasa Aktivitas</CardTitle>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Pembaruan terkini dari seluruh sistem akademik.</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                Lihat Semua <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={item.id} className="relative flex gap-4">
                  {i !== timeline.length - 1 && (
                    <div className="absolute left-[11px] top-7 bottom-[-24px] w-px bg-zinc-200/60 dark:bg-zinc-800/60" />
                  )}
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mt-0.5">
                    <div className={`h-2 w-2 rounded-full ${
                      item.type === 'success' ? 'bg-emerald-500' :
                      item.type === 'warning' ? 'bg-amber-500' :
                      item.type === 'info' ? 'bg-blue-500' :
                      'bg-zinc-400'
                    }`} />
                  </div>
                  <div className="flex flex-col flex-1 pb-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.user}</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">{item.time}</span>
                    </div>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{item.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & System Info */}
        <div className="col-span-full lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="px-6 pt-6 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start h-12 px-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all">
                <Users className="mr-3 h-4 w-4 text-zinc-400" />
                <span className="font-medium">Pendaftaran Santri Baru</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12 px-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all">
                <BookOpen className="mr-3 h-4 w-4 text-zinc-400" />
                <span className="font-medium">Kelola Jadwal Kelas</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12 px-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all">
                <FileText className="mr-3 h-4 w-4 text-zinc-400" />
                <span className="font-medium">Input Nilai Ujian</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Sistem Berjalan Normal</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Terakhir diperbarui 2 mnt lalu</p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Versi Database</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">v1.2.4</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Sinkronisasi</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Aktif</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

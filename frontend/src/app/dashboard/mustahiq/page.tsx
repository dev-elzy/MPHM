'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BookOpen, Clock, Calendar, ClipboardCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export default function MustahiqDashboardPage() {
  const { user } = useAuthSession();
  const userName = user?.name || 'Ustadz/ah';

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
        <Link href="/dashboard/mustahiq/nilai" className="group">
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

        <Link href="/dashboard/mustahiq/absensi" className="group">
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

        <Link href="/dashboard/mustahiq/akhlaq" className="group">
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
              { label: 'Input Nilai', href: '/dashboard/mustahiq/nilai', icon: BookOpen, color: 'text-[#C9A050]', bg: 'bg-amber-50 dark:bg-amber-500/10' },
              { label: 'Absensi Harian', href: '/dashboard/mustahiq/absensi', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
              { label: 'Penilaian Akhlaq', href: '/dashboard/mustahiq/akhlaq', icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
              { label: 'Jadwal Mengajar', href: '/dashboard/mustahiq/jadwal', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
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

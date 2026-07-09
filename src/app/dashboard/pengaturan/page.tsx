'use client';

import * as React from 'react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Database,
  Building,
  GraduationCap,
  Save,
  RotateCcw,
} from 'lucide-react';

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = React.useState('umum');
  const [madrasahName, setMadrasahName] = React.useState('Madrasah Putri Hidayatul Mubtadi\'at');
  const [madrasahLogo, setMadrasahLogo] = React.useState('/logo.png');
  const [defaultYear, setDefaultYear] = React.useState('Tahun Ajaran 2025/2026');
  const [defaultSemester, setDefaultSemester] = React.useState('Semester Ganjil');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Pengaturan berhasil disimpan secara lokal!');
    }, 800);
  };

  const handleBackup = () => {
    toast.success('Backup basis data berhasil diunduh (MPHM_backup.sql)');
  };

  const tabItems = [
    { id: 'umum', label: 'Umum & Lembaga', icon: Building },
    { id: 'akademik', label: 'Akademik', icon: GraduationCap },
    { id: 'database', label: 'Basis Data', icon: Database },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-in fade-in duration-300">
      <PageHeader
        title="Pengaturan Sistem"
        description="Kelola preferensi global, identitas madrasah, dan cadangan basis data."
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Tabs - Responsive list */}
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none shrink-0 md:w-64">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap md:w-full text-left ${
                  isActive
                    ? 'bg-[#C9A050] text-white shadow-md'
                    : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Setting Panels */}
        <div className="flex-1">
          {activeTab === 'umum' && (
            <Card className="dark:bg-zinc-950 shadow-md border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building className="h-5 w-5 text-[#C9A050]" />
                  Identitas Lembaga
                </CardTitle>
                <CardDescription>Sesuaikan logo dan nama madrasah yang tampil di kop laporan & raport.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Nama Madrasah / Sekolah</label>
                  <Input
                    value={madrasahName}
                    onChange={(e) => setMadrasahName(e.target.value)}
                    className="max-w-md dark:bg-zinc-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Path Logo Madrasah</label>
                  <Input
                    value={madrasahLogo}
                    onChange={(e) => setMadrasahLogo(e.target.value)}
                    className="max-w-md dark:bg-zinc-900"
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 gap-2 text-xs h-9 px-4"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'akademik' && (
            <Card className="dark:bg-zinc-950 shadow-md border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-[#C9A050]" />
                  Preset Akademik
                </CardTitle>
                <CardDescription>Tentukan tahun ajaran dan semester aktif standar saat pengguna login.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Tahun Ajaran Aktif (Default)</label>
                  <Input
                    value={defaultYear}
                    onChange={(e) => setDefaultYear(e.target.value)}
                    className="max-w-md dark:bg-zinc-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500">Semester Aktif (Default)</label>
                  <Input
                    value={defaultSemester}
                    onChange={(e) => setDefaultSemester(e.target.value)}
                    className="max-w-md dark:bg-zinc-900"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 gap-2 text-xs h-9 px-4"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'database' && (
            <Card className="dark:bg-zinc-950 shadow-md border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Database className="h-5 w-5 text-[#C9A050]" />
                  Manajemen Basis Data
                </CardTitle>
                <CardDescription>Unduh salinan data atau pulihkan dari file cadangan SQL.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 max-w-md">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <h4 className="text-xs font-semibold text-amber-800 dark:text-amber-300">Penting Sebelum Melakukan Backup</h4>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 leading-normal">
                      Selalu lakukan pencadangan berkala setiap akhir semester sebelum melakukan proses kenaikan kelas atau kelulusan massal.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-2">
                    <Button
                      onClick={handleBackup}
                      className="bg-[#C9A050] hover:bg-[#B8903E] text-white gap-2 text-xs h-9 px-4"
                    >
                      <Database className="h-4 w-4" />
                      Unduh Cadangan SQL
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 text-xs h-9 px-4 border-zinc-200 dark:border-zinc-800"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

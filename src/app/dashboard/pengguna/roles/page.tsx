'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Check, Shield, UserCheck, Settings, BookOpen, Users2 } from 'lucide-react';

interface PermissionRow {
  module: string;
  description: string;
  super_admin: boolean;
  admin: boolean;
  operator: boolean;
  mustahiq: boolean;
  mudir: boolean;
  mufatish: boolean;
}

export default function RolesPermissionsPage() {
  const permissionsMatrix: PermissionRow[] = [
    {
      module: 'Tahun Ajaran & Semester',
      description: 'Membuat tahun ajaran baru, mengaktifkan semester, mengkloning data akademik.',
      super_admin: true,
      admin: true,
      operator: true,
      mustahiq: false,
      mudir: false,
      mufatish: false,
    },
    {
      module: 'Kurikulum & Pelajaran',
      description: 'Mengelola standar kurikulum, KKM pelajaran, dan detail mata pelajaran.',
      super_admin: true,
      admin: true,
      operator: true,
      mustahiq: false,
      mudir: false,
      mufatish: true,
    },
    {
      module: 'Kelas Rombel',
      description: 'Membuat kelas rombel baru, mengganti wali kelas, menugaskan guru pengajar.',
      super_admin: true,
      admin: true,
      operator: true,
      mustahiq: false,
      mudir: false,
      mufatish: false,
    },
    {
      module: 'Database Siswi',
      description: 'Menambah siswi, mengedit profil, memindahkan rombel kelas, impor/ekspor massal.',
      super_admin: true,
      admin: true,
      operator: true,
      mustahiq: false,
      mudir: false,
      mufatish: false,
    },
    {
      module: 'Input Nilai & Absensi',
      description: 'Menginput nilai pelajaran harian/ujian, mengisi kehadiran santriwati, edit akhlaq.',
      super_admin: true,
      admin: true,
      operator: true,
      mustahiq: true,
      mudir: false,
      mufatish: true,
    },
    {
      module: 'Cetak & Finalisasi Raport',
      description: 'Menghitung ranking & nilai rata-rata, memfinalisasi raport santri, cetak raport PDF.',
      super_admin: true,
      admin: true,
      operator: true,
      mustahiq: true,
      mudir: true,
      mufatish: true,
    },
    {
      module: 'Manajemen Pengguna',
      description: 'Membuat akun pengguna, me-reset password staff, menonaktifkan pengguna.',
      super_admin: true,
      admin: true,
      operator: false,
      mustahiq: false,
      mudir: false,
      mufatish: false,
    },
    {
      module: 'Log Aktivitas (Audit)',
      description: 'Melihat log audit perubahan data sistem secara real-time.',
      super_admin: true,
      admin: true,
      operator: false,
      mustahiq: false,
      mudir: true,
      mufatish: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        breadcrumbs={[
          { label: 'Pengaturan', href: '/dashboard' },
          { label: 'Pengguna', href: '/dashboard/pengguna' },
          { label: 'Hak Akses' },
        ]}
        title="Matriks Hak Akses (Roles & Permissions)"
        description="Detail pemetaan wewenang operasional pengguna sistem berdasarkan fungsionalitas modul."
      />

      <div className="grid grid-cols-1 gap-6">
        {/* Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-zinc-200 dark:border-zinc-800 flex items-start gap-3 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl">
            <Shield className="h-9 w-9 text-red-600 p-1.5 bg-red-50 dark:bg-red-950/20 rounded-xl" />
            <div className="text-left">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 block">Administrator</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 block">
                Pemegang kendali penuh seluruh konfigurasi master data akademik dan data pengguna.
              </span>
            </div>
          </Card>

          <Card className="p-4 border-zinc-200 dark:border-zinc-800 flex items-start gap-3 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl">
            <Users2 className="h-9 w-9 text-emerald-600 p-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl" />
            <div className="text-left">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 block">Mustahiq (Wali Kelas)</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 block">
                Fokus operasional pada input nilai santri, absensi kelas, dan pengisian raport.
              </span>
            </div>
          </Card>

          <Card className="p-4 border-zinc-200 dark:border-zinc-800 flex items-start gap-3 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl">
            <BookOpen className="h-9 w-9 text-[#C9A050] p-1.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl" />
            <div className="text-left">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 block">Mudir (Mudir / Pengasuh)</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 block">
                Hak akses peninjauan (read-only) untuk memantau absensi, grafik nilai, dan log audit.
              </span>
            </div>
          </Card>

          <Card className="p-4 border-zinc-200 dark:border-zinc-800 flex items-start gap-3 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl">
            <Shield className="h-9 w-9 text-indigo-600 p-1.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl" />
            <div className="text-left">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 block">Mufatish (Pengawas Akademik)</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 block">
                Pengawasan akademik, monitoring kurikulum & evaluasi ujian, serta verifikasi nilai santriwati.
              </span>
            </div>
          </Card>
        </div>

        {/* Matrix Card */}
        <Card className="overflow-hidden border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-[220px]">
                    Modul Sistem
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider min-w-[200px]">
                    Deskripsi Hak Akses
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider w-[90px]">
                    Super Admin
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider w-[90px]">
                    Admin
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider w-[90px]">
                    Operator
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider w-[90px]">
                    Mustahiq
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider w-[90px]">
                    Mudir
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider w-[90px]">
                    Mufatish
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {permissionsMatrix.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50 text-left">
                      {row.module}
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-500 dark:text-zinc-400 text-left leading-relaxed">
                      {row.description}
                    </td>
                    <td className="py-4 px-2 text-center">
                      {row.super_admin ? (
                        <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center">
                      {row.admin ? (
                        <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center">
                      {row.operator ? (
                        <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center">
                      {row.mustahiq ? (
                        <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center">
                      {row.mudir ? (
                        <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center">
                      {row.mufatish ? (
                        <Check className="h-5 w-5 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  homeLabel?: string;
  className?: string;
}

// Map path segments to custom display names
const PATH_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  akademik: 'Akademik',
  'tahun-ajaran': 'Tahun Ajaran',
  semester: 'Semester',
  kelas: 'Kelas',
  kurikulum: 'Kurikulum',
  'mata-pelajaran': 'Mata Pelajaran',
  siswi: 'Siswa / Santri',
  pengguna: 'Pengguna',
  roles: 'Peran',
  audit: 'Audit Log',
  'recycle-bin': 'Recycle Bin',
  monitoring: 'Monitoring',
  penilaian: 'Penilaian',
  absensi: 'Absensi',
  akhlaq: 'Akhlaq',
  raport: 'Raport',
  jadwal: 'Jadwal Akademik',
  promosi: 'Kenaikan Kelas',
};

export function Breadcrumb({ homeLabel = 'Beranda', className = '' }: BreadcrumbProps) {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className={`flex items-center space-x-1.5 text-sm text-zinc-500 ${className}`} aria-label="Breadcrumb">
      {/* Home link */}
      <div className="flex items-center">
        <Home className="h-3.5 w-3.5 mr-1 text-zinc-400" />
        <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          {homeLabel}
        </Link>
      </div>

      {/* Dynamic segments */}
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const label = PATH_MAP[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        // If it's a UUID/ID or dashboard itself (we already showed Home), skip showing raw IDs or redundant dashboard link
        if (segment === 'dashboard' || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
          return null;
        }

        return (
          <div key={href} className="flex items-center">
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400 mx-1 shrink-0" />
            {isLast ? (
              <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[150px] sm:max-w-none">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors truncate max-w-[120px] sm:max-w-none">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, GraduationCap, Briefcase, ShieldAlert, User, ArrowRight, Database, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';

interface RoleBadge {
  type: string;
  label: string;
  badgeColor: string;
  detail?: string;
}

interface Person {
  id: string;
  nik?: string;
  fullName: string;
  gender: string;
  phone?: string;
  address?: string;
  roles: RoleBadge[];
}

function DataCenterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync activeFilter with URL params if it changes
  useEffect(() => {
    const filter = searchParams.get('filter') || 'all';
    setActiveFilter(filter);
  }, [searchParams]);

  // Load results from backend API
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Always fetch to allow browsing/filtering
      setLoading(true);
      try {
        const url = `/api/v1/data-center/search?q=${encodeURIComponent(query)}&role=${activeFilter}`;
        const res = await fetch(url);
        const json = await res.json() as { success: boolean; data?: { results?: Person[] } };
        if (json.success && json.data?.results) {
          setResults(json.data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Data center directory search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, activeFilter]);

  // Filter local results based on active tab
  const filteredResults = results.filter((person) => {
    if (activeFilter === 'all') return true;
    return person.roles.some((role) => {
      if (activeFilter === 'student') return role.type === 'student';
      if (activeFilter === 'alumni') return role.type === 'alumni';
      if (activeFilter === 'teacher') return role.type === 'teacher';
      if (activeFilter === 'organization') return role.type === 'organization';
      if (activeFilter === 'guardian') return role.type === 'guardian';
      return false;
    });
  });

  const getRoleIcon = (type: string) => {
    switch (type) {
      case 'student':
      case 'alumni':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'teacher':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'organization':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      default:
        return <User className="w-3.5 h-3.5" />;
    }
  };

  const getBadgeClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50';
      case 'purple':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/50';
      case 'blue':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/50';
      case 'amber':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50';
      default:
        return 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-350 border-zinc-200/50';
    }
  };

  const filters = [
    { id: 'all', label: 'Semua Warga' },
    { id: 'student', label: 'Santri Aktif' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'teacher', label: 'Mustahiq/Pengajar' },
    { id: 'organization', label: 'Pengurus' },
    { id: 'guardian', label: 'Wali Santri' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Pusat Data' },
        ]}
        title="Pusat Data Terpadu"
        description="Direktori dan pencarian profil 360° terintegrasi untuk seluruh civitas MPHM."
      />

      {/* Main search bar */}
      <div className="relative">
        <div className="flex items-center w-full h-12 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/80 transition-all">
          <Search className="w-5 h-5 mr-3 text-zinc-400 shrink-0" />
          <Input
            type="text"
            placeholder="Cari nama, NIK, NIS, alamat, atau nomor handphone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 shadow-none focus-visible:ring-0 p-0 text-sm sm:text-base placeholder-zinc-400 text-zinc-800 dark:text-zinc-100 h-full"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className="text-xs font-semibold text-zinc-500 cursor-pointer"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setActiveFilter(f.id);
              router.replace(`/dashboard/sekretariat/data-center?filter=${f.id}`);
            }}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
              activeFilter === f.id
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 animate-pulse">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-11 w-11 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800" />
                    <Skeleton className="h-3 w-48 bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredResults.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 flex flex-col items-center justify-center gap-3">
            <Database className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
            <p className="text-sm font-semibold">Tidak ada warga yang terdaftar sesuai kriteria.</p>
            <p className="text-xs text-zinc-400">Ketik kata kunci pencarian di kolom atas untuk memulai pencarian database.</p>
          </div>
        ) : (
          filteredResults.map((person) => (
            <Card
              key={person.id}
              onClick={() => router.push(`/dashboard/data-center/profile/${person.id}`)}
              className="border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 hover:bg-white dark:bg-zinc-950/40 dark:hover:bg-zinc-900/40 hover:shadow-md cursor-pointer transition-all duration-300 group rounded-2xl"
            >
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-500/20">
                    {person.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block truncate">
                      {person.fullName}
                    </span>
                    <span className="text-xs text-zinc-500 block truncate mt-0.5">
                      {person.phone || person.address || 'Pusat Data Terpadu'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col gap-1 items-end">
                    {person.roles.map((role, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full border ${getBadgeClass(
                          role.badgeColor
                        )}`}
                      >
                        {getRoleIcon(role.type)}
                        {role.label}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default function DataCenterPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    }>
      <DataCenterContent />
    </Suspense>
  );
}

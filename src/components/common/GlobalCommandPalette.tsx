'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Command, User, GraduationCap, Briefcase, ShieldAlert, ArrowRight, X } from 'lucide-react'; 

interface RoleBadge {
  type: string;
  label: string;
  badgeColor: string;
  detail?: string;
}

interface SearchResult {
  id: string;
  nik?: string;
  fullName: string;
  gender: string;
  phone?: string;
  address?: string;
  roles: RoleBadge[];
}

interface SearchApiResponse {
  success: boolean;
  data?: {
    results?: SearchResult[];
  };
  message?: string;
}

export function GlobalCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/data-center/search?q=${encodeURIComponent(query)}`);
        const data = (await res.json()) as SearchApiResponse;
        if (data.success && data.data?.results) {
          setResults(data.data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Command Palette Search Error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative flex items-center w-full h-9.5 px-3.5 bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 rounded-full border border-zinc-200/60 dark:border-zinc-800 text-sm text-zinc-500 transition-all cursor-pointer shadow-sm group"
      >
        <Search className="w-4 h-4 mr-2.5 text-zinc-400 group-hover:text-emerald-500 shrink-0 transition-colors" />
        <span className="truncate text-xs sm:text-sm">Cari santri, pengajar, kelas...</span>
        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-[10px] font-semibold text-zinc-500 shrink-0">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </button>
    );
  }

  const getRoleIcon = (type: string) => {
    switch (type) {
      case 'student':
      case 'alumni':
        return <GraduationCap className="w-4 h-4" />;
      case 'teacher':
        return <Briefcase className="w-4 h-4" />;
      case 'organization':
        return <ShieldAlert className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getBadgeClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
      case 'purple':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400';
      case 'blue':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400';
      case 'amber':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Input Bar (stays in place) */}
      <div className="flex items-center w-full h-9.5 px-3.5 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-full border border-zinc-200/60 dark:border-zinc-800 text-sm transition-all shadow-sm">
        <Search className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0" />
        <input
          type="text"
          autoFocus
          placeholder="Cari santri, pengajar, kelas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-xs sm:text-sm"
        />
        <button
          onClick={() => {
            setQuery('');
            setResults([]);
            setIsOpen(false);
          }}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Dropdown Results Card */}
      <div className="absolute top-11 right-0 w-full min-w-[320px] sm:min-w-[480px] md:min-w-[560px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-slate-500">Mencari di Pusat Data MPHM...</div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              {query ? 'Tidak ada data warga yang sesuai pencarian.' : 'Ketik nama, NIS, atau nomor HP untuk mencari.'}
            </div>
          ) : (
            results.map((person) => (
              <div
                key={person.id}
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/dashboard/data-center/profile/${person.id}`);
                }}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {person.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {person.fullName}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {person.phone || person.address || 'Pusat Data MPHM'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {person.roles.map((role, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getBadgeClass(
                        role.badgeColor
                      )}`}
                    >
                      {getRoleIcon(role.type)}
                      {role.label}
                    </span>
                  ))}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all ml-1" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Bar info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Gunakan <kbd className="font-semibold">ESC</kbd> untuk menutup
          </span>
          <span>Pusat Data Terpadu MPHM</span>
        </div>
      </div>
    </div>
  );
}

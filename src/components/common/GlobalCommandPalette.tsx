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
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/data-center/search?q=${encodeURIComponent(query)}`);
        const data: any = await res.json();
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
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Cari Pusat Data...</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-semibold text-slate-500 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
          <Command className="w-3 h-3" /> K
        </kbd>
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mx-4">
        {/* Top Search Input */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Cari warga MPHM (Nama, NIS, HP, Alamat)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 text-base bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-slate-500">Mencari di Pusat Data...</div>
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
                  router.push(`/data-center/profile/${person.id}`);
                }}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {person.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
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
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all ml-1" />
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

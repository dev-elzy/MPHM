'use client';

import * as React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isWali, isKeamanan, isMustahiq, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        {/* Sidebar Skeleton (Desktop only) */}
        <aside className="hidden lg:flex h-screen w-64 flex-col fixed inset-y-0 z-50 p-4">
          <div className="flex h-full flex-col bg-slate-900/90 dark:bg-zinc-900/90 rounded-3xl border border-zinc-200/10 p-5 gap-6 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-zinc-200/20 dark:bg-zinc-800/40 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-200/20 dark:bg-zinc-800/40 rounded-md w-3/4" />
                <div className="h-3 bg-zinc-200/20 dark:bg-zinc-800/40 rounded-md w-1/2" />
              </div>
            </div>
            <div className="space-y-4 flex-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-9 bg-zinc-200/20 dark:bg-zinc-800/40 rounded-xl w-full" />
              ))}
            </div>
            <div className="h-12 bg-zinc-200/20 dark:bg-zinc-800/40 rounded-2xl w-full mt-auto" />
          </div>
        </aside>

        {/* Content Skeleton */}
        <div className="flex flex-col flex-1 w-full lg:pl-64 overflow-hidden">
          {/* Header Skeleton */}
          <header className="h-16 border-b border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-between px-4 lg:px-8 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md">
            <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-36 animate-pulse" />
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-9 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-full hidden md:block" />
              <div className="h-9 w-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <div className="h-9 w-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <div className="h-9 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>
          </header>

          {/* Main Content Area Skeleton */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-5 border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 rounded-2xl space-y-3 shadow-xs">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2" />
                    <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3" />
                  </div>
                ))}
              </div>

              {/* Grid content mockup */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Large content card */}
                <div className="lg:col-span-2 p-5 border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 rounded-2xl h-80 space-y-4">
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/4" />
                  <div className="h-full bg-zinc-100 dark:bg-zinc-900/60 rounded-xl" />
                </div>
                {/* Side content card */}
                <div className="p-5 border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 rounded-2xl h-80 space-y-4">
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3" />
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4" />
                          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Wali Santri (isWali), Keamanan (isKeamanan), and Mustahiq (isMustahiq) are app-style (no sidebar)
  const isAppStyle = isWali || isKeamanan || isMustahiq;

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {!isAppStyle && <Sidebar />}
      <div className={`flex flex-col flex-1 w-full ${isAppStyle ? '' : 'lg:pl-64'} overflow-hidden`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className={`mx-auto w-full max-w-7xl ${isAppStyle ? 'pb-20 lg:pb-24' : ''}`}>
            {children}
          </div>
        </main>
        {isAppStyle && <BottomNav isWali={isWali} isKeamanan={isKeamanan} isMustahiq={isMustahiq} />}
      </div>
    </div>
  );
}

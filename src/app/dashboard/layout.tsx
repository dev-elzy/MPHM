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
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 gap-3">
        <div className="h-8 w-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
        <p className="text-sm text-zinc-500 font-medium">Memuat Layanan...</p>
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

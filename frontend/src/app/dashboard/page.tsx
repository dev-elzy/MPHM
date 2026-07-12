'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export default function DashboardPage() {
  const { user, isMustahiq, isWali, isKeamanan, isSekretariat, isPimpinan, isMufattisy, isLoading } = useAuthSession();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;

    if (user) {
      if (isSekretariat) {
        router.replace('/dashboard/sekretariat');
      } else if (isMustahiq) {
        router.replace('/dashboard/mustahiq');
      } else if (isWali) {
        router.replace('/dashboard/parent'); // keeping parent/wali route as parent
      } else if (isKeamanan) {
        router.replace('/dashboard/keamanan');
      } else if (isMufattisy) {
        router.replace('/dashboard/mufattisy');
      } else if (isPimpinan) {
        router.replace('/dashboard/pimpinan');
      } else {
        router.replace('/dashboard/pimpinan'); // default fallback monitoring
      }
    }
  }, [user, isMustahiq, isWali, isKeamanan, isSekretariat, isPimpinan, isMufattisy, isLoading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <div className="h-8 w-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      <p className="text-sm text-zinc-500 font-medium">Mengarahkan ke Dashboard Anda...</p>
    </div>
  );
}

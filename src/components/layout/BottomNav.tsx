'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, GraduationCap, Clock, AlertTriangle, User, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  isWali: boolean;
  isKeamanan: boolean;
}

export function BottomNav({ isWali, isKeamanan }: BottomNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'profile';

  if (isWali) {
    const items = [
      {
        label: 'Profil',
        icon: User,
        href: '/dashboard/parent?tab=profile',
        active: pathname === '/dashboard/parent' && activeTabParam === 'profile',
      },
      {
        label: 'Nilai',
        icon: GraduationCap,
        href: '/dashboard/parent?tab=grades',
        active: pathname === '/dashboard/parent' && activeTabParam === 'grades',
      },
      {
        label: 'Absensi',
        icon: Clock,
        href: '/dashboard/parent?tab=attendance',
        active: pathname === '/dashboard/parent' && activeTabParam === 'attendance',
      },
      {
        label: 'Pelanggaran',
        icon: AlertTriangle,
        href: '/dashboard/parent?tab=violations',
        active: pathname === '/dashboard/parent' && activeTabParam === 'violations',
      },
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-around px-4 shadow-lg lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-md lg:rounded-2xl lg:border border-zinc-200 dark:border-zinc-800">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1 gap-1 text-[10px] font-semibold transition-all duration-200 active:scale-95',
                item.active
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400'
              )}
            >
              <Icon className={cn('h-5 w-5', item.active ? 'stroke-[2.5px]' : 'stroke-[1.8px]')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  if (isKeamanan) {
    const items = [
      {
        label: 'Dashboard',
        icon: Home,
        href: '/dashboard/keamanan',
        active: pathname === '/dashboard/keamanan',
      },
      {
        label: 'Lapor Pelanggaran',
        icon: ShieldAlert,
        href: '/dashboard/keamanan/pelanggaran',
        active: pathname === '/dashboard/keamanan/pelanggaran',
      },
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-around px-6 shadow-lg lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-xs lg:rounded-2xl lg:border border-zinc-200 dark:border-zinc-800">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1 gap-1 text-[10px] font-semibold transition-all duration-200 active:scale-95',
                item.active
                  ? 'text-red-600 dark:text-red-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400'
              )}
            >
              <Icon className={cn('h-5 w-5', item.active ? 'stroke-[2.5px]' : 'stroke-[1.8px]')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return null;
}

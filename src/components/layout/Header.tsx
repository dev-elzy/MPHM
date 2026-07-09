'use client';

import * as React from 'react';
import Image from 'next/image';
import { MobileSidebar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { UserNav } from '@/components/layout/UserNav';
import { GlobalCommandPalette } from '@/components/common/GlobalCommandPalette';
import { Bell } from 'lucide-react';
import { Breadcrumb } from '@/components/ui-custom/Breadcrumb';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md border-b border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-between px-4 lg:px-8 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <MobileSidebar />
        <div className="flex items-center gap-2 lg:hidden">
          <Image src="/logo.png" alt="Logo MPHM" width={32} height={32} className="h-8 w-8 object-contain" priority unoptimized />
          <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 truncate">MPHM Portal</span>
        </div>
        {/* Dynamic Indonesia-translated Breadcrumb */}
        <Breadcrumb className="hidden lg:flex" />
      </div>

      <div className="flex items-center gap-3">
        {/* Global Command Palette search bar inside Header */}
        <div className="w-64 lg:w-96">
          <GlobalCommandPalette />
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200/50 dark:border-zinc-800/50">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg relative">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
          </Button>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

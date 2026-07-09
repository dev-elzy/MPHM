'use client';

import * as React from 'react';
import { MobileSidebar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { UserNav } from '@/components/layout/UserNav';
import { Input } from '@/components/ui/input';
import { Search, Bell } from 'lucide-react';
import { Breadcrumb } from '@/components/ui-custom/Breadcrumb';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md border-b border-zinc-200/20 dark:border-zinc-800/20 flex items-center justify-between px-4 lg:px-8 transition-all">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        {/* Dynamic Indonesia-translated Breadcrumb */}
        <Breadcrumb className="hidden lg:flex" />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center w-64 lg:w-80 group">
          <Search className="absolute left-3 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 pl-9 pr-12 rounded-lg border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-primary h-9 text-sm shadow-none transition-all placeholder:text-zinc-500"
          />
          <div className="absolute right-2 flex items-center justify-center h-5 w-5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pointer-events-none">
            <span className="text-[10px] font-medium text-zinc-500">/</span>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200/50 dark:border-zinc-800/50">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg relative">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-brand-gold rounded-full ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
          </Button>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

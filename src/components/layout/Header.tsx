'use client';

import * as React from 'react';
import Image from 'next/image';
import { MobileSidebar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { UserNav } from '@/components/layout/UserNav';
import { GlobalCommandPalette } from '@/components/common/GlobalCommandPalette';
import { Bell, Trash2, Check, Inbox } from 'lucide-react';
import { Breadcrumb } from '@/components/ui-custom/Breadcrumb';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

export function Header() {
  const queryClient = useQueryClient();

  // Fetch real notifications from database
  const { data: notificationsList = [], refetch } = useQuery<any[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/v1/notifications');
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
      return [];
    },
    refetchInterval: 10000, // Poll every 10 seconds for real-time emulation
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/notifications?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus notifikasi');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notifikasi berhasil dihapus');
    },
  });

  const unreadCount = notificationsList.length;

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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg relative cursor-pointer">
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl overflow-hidden" align="end">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Notifikasi</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">{unreadCount} baru</span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800 text-left">
                {notificationsList.length === 0 ? (
                  <div className="py-8 px-4 flex flex-col items-center justify-center text-center text-zinc-400">
                    <Inbox className="h-8 w-8 text-zinc-300 mb-2" />
                    <p className="text-xs">Tidak ada notifikasi baru</p>
                  </div>
                ) : (
                  notificationsList.map((notif) => (
                    <div key={notif.id} className="p-3.5 flex items-start gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group">
                      <div className="flex-1 space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{notif.title}</span>
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            notif.type === 'error' ? 'bg-red-500' :
                            notif.type === 'warning' ? 'bg-amber-500' :
                            notif.type === 'success' ? 'bg-emerald-500' :
                            'bg-blue-500'
                          }`} />
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal line-clamp-2">{notif.message}</p>
                        <span className="text-[9px] text-zinc-400 block pt-0.5">
                          {new Date(notif.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(notif.id)}
                        className="h-6 w-6 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}

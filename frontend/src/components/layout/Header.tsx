'use client';

import * as React from 'react';
import Image from 'next/image';
import { MobileSidebar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { UserNav } from '@/components/layout/UserNav';
import { GlobalCommandPalette } from '@/components/common/GlobalCommandPalette';
import { Bell, Check, Inbox } from 'lucide-react';
import { Breadcrumb } from '@/components/ui-custom/Breadcrumb';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

interface NotificationItem {
  id: string;
  title: string;
  type: string;
  message: string;
  createdAt: string | number | Date;
}

import { usePathname } from 'next/navigation';

export function Header() {
  const { isWali, isKeamanan, isMustahiq } = useAuthSession();
  const isAppStyle = isWali || isKeamanan || isMustahiq;
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // Fetch real notifications from database
  const { data: notificationsList = [] } = useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/v1/notifications');
      if (res.ok) {
        const json = (await res.json()) as { data?: NotificationItem[] };
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

  const getMobileTitle = (path: string) => {
    if (path.includes('/data-center/profile/')) return 'Profil 360°';
    if (path.includes('/data-center')) return 'Pusat Data';
    if (path.includes('/siswi')) return 'Data Santri';
    if (path.includes('/nilai')) return 'Input Nilai';
    if (path.includes('/absensi')) return 'Absensi';
    if (path.includes('/akhlaq')) return 'Akhlaq';
    if (path.includes('/violations') || path.includes('/pelanggaran')) return 'Pelanggaran';
    if (path.includes('/audit')) return 'Audit Log';
    if (path.includes('/recycle-bin')) return 'Recycle Bin';
    if (path.includes('/pengguna')) return 'Pengguna';
    if (path.includes('/pengaturan')) return 'Pengaturan';
    if (path.includes('/akademik/tahun-ajaran')) return 'Tahun Ajaran';
    if (path.includes('/akademik/semester')) return 'Semester';
    if (path.includes('/akademik/kelas')) return 'Kelas';
    if (path.includes('/akademik/kurikulum')) return 'Kurikulum';
    if (path.includes('/akademik/mata-pelajaran')) return 'Mata Pelajaran';
    if (path.includes('/akademik/jadwal')) return 'Jadwal';
    if (path.includes('/akademik/promosi')) return 'Promosi';
    return 'MPHM Portal';
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md border-b border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-between px-4 lg:px-8 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        {!isAppStyle && <MobileSidebar />}
        <div className="flex items-center gap-2 lg:hidden min-w-0">
          <Image src="/logo.png" alt="Logo MPHM" width={28} height={28} className="h-7 w-7 object-contain shrink-0" priority unoptimized />
          <span className="font-extrabold text-xs tracking-tight text-zinc-900 dark:text-zinc-100 shrink-0">MPHM</span>
          <span className="text-zinc-300 dark:text-zinc-700 text-xs shrink-0">/</span>
          <span className="font-bold text-xs text-[#C9A050] truncate">{getMobileTitle(pathname)}</span>
        </div>
        {/* Dynamic Indonesia-translated Breadcrumb */}
        <Breadcrumb className="hidden lg:flex" />
      </div>

      <div className="flex items-center gap-3">
        {/* Global Command Palette search bar inside Header - hidden for Wali Santri and on mobile/tablet for others */}
        {!isAppStyle && (
          <div className="hidden md:block w-64 lg:w-96">
            <GlobalCommandPalette />
          </div>
        )}

        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200/50 dark:border-zinc-800/50">
          <Popover>
            <PopoverTrigger className="h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg relative cursor-pointer flex items-center justify-center">
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
              )}
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

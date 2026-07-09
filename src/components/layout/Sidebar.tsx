'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Settings,
  Menu,
  Layers,
  ChevronDown,
  ClipboardCheck,
  Activity,
  UsersRound,
  Calendar,
} from 'lucide-react';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

interface SidebarItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  subItems?: { label: string; href: string }[];
  allowedRoles?: string[];
}

const routes: SidebarItem[] = [
  {
    label: 'Ringkasan',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Manajemen Akademik',
    icon: GraduationCap,
    href: '/dashboard/akademik',
    allowedRoles: ['super_admin', 'admin', 'operator', 'mudir', 'mufatish'],
    subItems: [
      { label: 'Tahun Ajaran', href: '/dashboard/akademik/tahun-ajaran' },
      { label: 'Semester', href: '/dashboard/akademik/semester' },
      { label: 'Kelas (Rombel)', href: '/dashboard/akademik/kelas' },
      { label: 'Kurikulum', href: '/dashboard/akademik/kurikulum' },
      { label: 'Mata Pelajaran', href: '/dashboard/akademik/mata-pelajaran' },
      { label: 'Jadwal Akademik', href: '/dashboard/akademik/jadwal' },
      { label: 'Kenaikan Kelas', href: '/dashboard/akademik/promosi' },
    ],
  },
  {
    label: 'Jadwal Mengajar',
    icon: Calendar,
    href: '/dashboard/akademik/jadwal',
    allowedRoles: ['mustahiq', 'teacher', 'ustadz'],
  },
  {
    label: 'Data Santri',
    icon: Users,
    href: '/dashboard/akademik/siswi',
  },
  {
    label: 'Penilaian & Absensi',
    icon: ClipboardCheck,
    href: '/dashboard/akademik/nilai',
    subItems: [
      { label: 'Input Nilai', href: '/dashboard/akademik/nilai' },
      { label: 'Absensi Harian', href: '/dashboard/akademik/absensi' },
      { label: 'Penilaian Akhlaq', href: '/dashboard/akademik/akhlaq' },
    ],
  },
  {
    label: 'Monitoring & Audit',
    icon: Activity,
    href: '/dashboard/audit',
    allowedRoles: ['super_admin', 'admin', 'operator', 'mudir', 'mufatish'],
    subItems: [
      { label: 'Audit System Log', href: '/dashboard/audit' },
      { label: 'Recycle Bin', href: '/dashboard/recycle-bin' },
    ],
  },
  {
    label: 'Manajemen Pengguna',
    icon: UsersRound,
    href: '/dashboard/pengguna',
    allowedRoles: ['super_admin', 'admin', 'operator'],
    subItems: [
      { label: 'Daftar Staff', href: '/dashboard/pengguna' },
      { label: 'Hak Akses & Role', href: '/dashboard/pengguna/roles' },
    ],
  },
  {
    label: 'Pengaturan Sistem',
    icon: Settings,
    href: '/dashboard/pengaturan',
    allowedRoles: ['super_admin', 'admin'],
  },
];

interface SidebarContentProps {
  onNavigate?: () => void;
}

function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { user, role } = useAuthSession();
  
  // Track which submenus are expanded
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    'Manajemen Akademik': pathname.startsWith('/dashboard/akademik') && !pathname.endsWith('/siswi'),
    'Penilaian & Absensi': pathname.startsWith('/dashboard/akademik/nilai') || pathname.startsWith('/dashboard/akademik/absensi') || pathname.startsWith('/dashboard/akademik/akhlaq'),
    'Monitoring & Audit': pathname.startsWith('/dashboard/audit') || pathname.startsWith('/dashboard/recycle-bin'),
    'Manajemen Pengguna': pathname.startsWith('/dashboard/pengguna'),
  });

  const toggleExpand = (label: string) => {
    setExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const filteredRoutes = React.useMemo(() => {
    if (!role) return routes.filter((r) => !r.allowedRoles);
    return routes.filter((route) => {
      if (!route.allowedRoles) return true;
      return route.allowedRoles.includes(role);
    });
  }, [role]);

  const getRoleBadgeLabel = (r: string) => {
    switch (r) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Administrator';
      case 'operator': return 'Operator Akademik';
      case 'mustahiq': return 'Staff Pengajar';
      case 'mudir': return 'Mudir (Pimpinan)';
      case 'mufatish': return 'Mufatish (Pengawas Akademik)';
      default: return r || 'Pengguna';
    }
  };

  return (
    <div className="flex h-full flex-col glass-panel rounded-2xl shadow-premium-3d text-left overflow-hidden">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-zinc-200/20 dark:border-zinc-800/20 bg-white/10 dark:bg-black/10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white dark:text-zinc-900 shadow-md shadow-primary/20">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight text-sm leading-none">
              MPHM Portal
            </span>
            <span className="text-[10px] text-brand-gold font-semibold mt-1 uppercase tracking-wider">
              Academic Hub
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-none">
        <nav className="flex flex-col gap-1.5">
          {filteredRoutes.map((route) => {
            const hasSubItems = !!route.subItems;
            
            // Highlight parent link if path active
            const isActive = hasSubItems
              ? pathname.startsWith(route.href) && !pathname.endsWith('/siswi')
              : pathname === route.href || (route.href !== '/dashboard' && pathname.startsWith(route.href + '/'));

            const isExpanded = !!expanded[route.label];

            return (
              <div key={route.label} className="flex flex-col gap-1">
                {hasSubItems ? (
                  // Expandable Menu Header
                  <button
                    type="button"
                    onClick={() => toggleExpand(route.label)}
                    className={cn(
                      'group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer w-full text-left active:scale-[0.98]',
                      isActive
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground border-l-2 border-brand-gold pl-2 rounded-l-none'
                        : 'text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <route.icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive ? 'text-brand-gold' : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-400'
                        )}
                      />
                      {route.label}
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 text-zinc-400 transition-transform duration-200',
                        isExpanded ? 'transform rotate-180' : ''
                      )}
                    />
                  </button>
                ) : (
                  // Direct Navigation Link
                  <Link
                    href={route.href}
                    onClick={onNavigate}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                      isActive
                        ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground border-l-2 border-brand-gold pl-2 rounded-l-none shadow-sm shadow-primary/5'
                        : 'text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-50'
                    )}
                  >
                    <route.icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive ? 'text-brand-gold' : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-400'
                      )}
                    />
                    {route.label}
                  </Link>
                )}

                {/* Sub-menu Items */}
                {hasSubItems && isExpanded && (
                  <div className="ml-4 flex flex-col gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-3 mt-0.5 mb-1.5 animate-in slide-in-from-top-1 duration-150">
                    {route.subItems?.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onNavigate}
                          className={cn(
                            'block rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200',
                            isSubActive
                              ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground font-semibold border-l-2 border-brand-gold pl-2 rounded-l-none'
                              : 'text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/30 dark:hover:text-zinc-50'
                          )}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* AdminHMD-style User Profile Card & System Status Footer */}
      <div className="p-3 border-t border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/70 dark:bg-zinc-900/40 flex flex-col gap-2.5">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="h-9 w-9 rounded-full bg-primary/15 dark:bg-primary/25 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 shadow-inner">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AV'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {user?.name || 'Admin Hasan'}
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium truncate">
              {user ? getRoleBadgeLabel(role) : 'Active Workspace'}
            </span>
          </div>
        </div>

        {/* System running smoothly status line */}
        <div className="flex items-center gap-2 px-1 py-0.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 tracking-tight">
            System running smoothly
          </span>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col fixed inset-y-0 z-50 p-4">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <SheetContent side="left" className="p-0 w-72 bg-white dark:bg-zinc-950">
        <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
        <div className="h-full p-4 bg-zinc-50 dark:bg-zinc-950">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

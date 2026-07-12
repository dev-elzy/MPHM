'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trash2, RefreshCw, GraduationCap, Users, School, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/ui-custom/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RecycleBinItem {
  module: string;
  items: { id: string; name: string; deletedAt: number }[];
}

const MODULE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  students: { label: 'Siswi', icon: GraduationCap, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  users: { label: 'Pengguna', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  classes: { label: 'Kelas', icon: School, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  curriculums: { label: 'Kurikulum', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
};

function useRecycleBin() {
  return useQuery({
    queryKey: ['recycle-bin'],
    queryFn: async () => {
      const res = await fetch('/api/v1/recycle-bin');
      if (!res.ok) throw new Error('Gagal mengambil data recycle bin');
      const data = (await res.json()) as { data?: RecycleBinItem[] };
      return data.data || [];
    },
  });
}

export default function RecycleBinPage() {
  const { data, isLoading, refetch } = useRecycleBin();
  const [isRestoring, setIsRestoring] = React.useState<string | null>(null);

  const totalItems = React.useMemo(() => data?.reduce((acc, d) => acc + d.items.length, 0) ?? 0, [data]);

  const handleRestore = async (moduleName: string, id: string) => {
    setIsRestoring(id);
    try {
      const res = await fetch('/api/v1/recycle-bin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: moduleName, id }),
      });
      const resJson = (await res.json()) as { success?: boolean; message?: string };
      if (res.ok && resJson.success) {
        toast.success(resJson.message || 'Item berhasil dipulihkan!');
        refetch();
      } else {
        toast.error(resJson.message || 'Gagal memulihkan data');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghubungi server');
    } finally {
      setIsRestoring(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Recycle Bin"
        description="Data yang dihapus disimpan sementara di sini. Data akan dihapus permanen secara otomatis setelah 30 hari."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : totalItems === 0 ? (
        <Card className="flex flex-col items-center py-24 border-dashed dark:bg-zinc-950">
          <Trash2 className="h-12 w-12 text-zinc-200 dark:text-zinc-700 mb-4" />
          <p className="text-sm font-semibold text-zinc-500">Recycle Bin Kosong</p>
          <p className="text-xs text-zinc-400 mt-1">Tidak ada data yang sedang menunggu penghapusan permanen.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data || []).map((group) => {
            const cfg = MODULE_CONFIG[group.module];
            if (!cfg || group.items.length === 0) return null;
            const Icon = cfg.icon;

            return (
              <Card key={group.module} className="dark:bg-zinc-950 shadow-premium-3d rounded-2xl">
                <CardHeader className="flex flex-row items-center gap-3 pb-3">
                  <div className={`p-2 rounded-lg ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{cfg.label}</CardTitle>
                    <p className="text-xs text-zinc-400">{group.items.length} item terhapus</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {group.items.map((item) => {
                      const deletedDate = new Date(item.deletedAt * 1000);
                      const daysLeft = 30 - Math.floor((Date.now() / 1000 - item.deletedAt) / 86400);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 px-3 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{item.name}</p>
                            <p className="text-xs text-zinc-400">
                              Dihapus: {deletedDate.toLocaleDateString('id-ID')} •{' '}
                              <span className={daysLeft <= 7 ? 'text-red-500 font-semibold' : 'text-zinc-400'}>
                                {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Kadaluarsa'}
                              </span>
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 gap-1.5 rounded-lg"
                            disabled={isRestoring === item.id}
                            onClick={() => handleRestore(group.module, item.id)}
                          >
                            {isRestoring === item.id ? 'Memulihkan...' : 'Restore'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
        <strong className="text-zinc-700 dark:text-zinc-300">Info:</strong> Data yang dihapus akan otomatis dihapus permanen setelah 30 hari melalui Cloudflare Cron Worker. Data yang sudah dihapus permanen tidak dapat dipulihkan.
      </div>
    </div>
  );
}

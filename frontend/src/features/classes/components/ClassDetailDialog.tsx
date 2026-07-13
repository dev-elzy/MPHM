import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, ShieldCheck, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Class } from '@/features/classes/types';

interface ClassDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cls: Class | null;
}

export function ClassDetailDialog({ open, onOpenChange, cls }: ClassDetailDialogProps) {
  const [search, setSearch] = React.useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['class-hierarchy', cls?.id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/classes/${cls?.id}/hierarchy`);
      if (!res.ok) throw new Error('Gagal mengambil detail kelas');
      return res.json().then((d: any) => d.data);
    },
    enabled: !!cls?.id && open,
  });

  const filteredStudents = React.useMemo(() => {
    const students = data?.students;
    if (!students) return [];
    return students.filter((s: any) => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      (s.nis && s.nis.includes(search))
    );
  }, [data?.students, search]);

  if (!cls) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{cls.name}</DialogTitle>
              <DialogDescription className="mt-1">
                Data Lengkap Rombongan Belajar {cls.jenjang} Tingkat {cls.tingkat}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-500 border-amber-200 dark:border-amber-800">
                Total: {data?.totalStudents || 0} Siswi
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <span className="text-sm text-zinc-500 animate-pulse">Memuat hierarki kelas...</span>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Hierarki Pengurus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 flex items-center gap-4 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Mufatish / Pengawas</div>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-lg">
                      {data?.mufatish?.name || <span className="italic text-zinc-400 text-sm">Belum Ditugaskan</span>}
                    </div>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-4 border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Mustahiq / Wali Kelas</div>
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-lg">
                      {data?.mustahiq?.name || <span className="italic text-zinc-400 text-sm">Belum Ditugaskan</span>}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Daftar Siswi */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-zinc-400" /> Daftar Siswi ({filteredStudents.length})
                  </h3>
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input 
                      placeholder="Cari nama atau NIS..." 
                      className="pl-9 h-9 text-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s: any) => (
                      <div 
                        key={s.profileId} 
                        className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-300 dark:hover:border-amber-700 transition-colors cursor-pointer"
                        onClick={() => window.open(`/dashboard/sekretariat/data-center/profile/${s.profileId}`, '_blank')}
                      >
                        <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold uppercase">
                          {s.name.charAt(0)}
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden">
                          <span className="font-semibold text-sm truncate" title={s.name}>{s.name}</span>
                          <span className="text-xs text-zinc-500">NIS: {s.nis || '-'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-zinc-500 text-sm">
                      {search ? 'Tidak ada siswi yang cocok dengan pencarian.' : 'Belum ada siswi yang terdaftar di kelas ini.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

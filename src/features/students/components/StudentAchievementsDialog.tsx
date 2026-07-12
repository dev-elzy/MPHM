'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Trash2, Plus, Calendar, Award, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  studentId: string;
  title: string;
  level: 'Kecamatan' | 'Kabupaten' | 'Provinsi' | 'Nasional' | 'Internal';
  date: string;
  notes?: string | null;
}

interface StudentAchievementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
}

export function StudentAchievementsDialog({
  open,
  onOpenChange,
  studentId,
  studentName,
}: StudentAchievementsDialogProps) {
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form states
  const [title, setTitle] = React.useState('');
  const [level, setLevel] = React.useState<'Kecamatan' | 'Kabupaten' | 'Provinsi' | 'Nasional' | 'Internal'>('Internal');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = React.useState('');

  const fetchAchievements = React.useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/students/achievements?studentId=${studentId}`);
      if (!res.ok) throw new Error('Gagal mengambil data prestasi');
      const data = await res.json() as { data: Achievement[] };
      setAchievements(data.data || []);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengambil data prestasi');
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  React.useEffect(() => {
    if (open && studentId) {
      fetchAchievements();
      // Reset form
      setTitle('');
      setLevel('Internal');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [open, studentId, fetchAchievements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Judul prestasi wajib diisi');
      return;
    }
    if (!date) {
      toast.error('Tanggal prestasi wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/students/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          title,
          level,
          date,
          notes: notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as { message?: string }).message || 'Gagal mencatat prestasi');
      }

      toast.success('Prestasi berhasil dicatat');
      // Reset form
      setTitle('');
      setLevel('Internal');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      // Refresh list
      fetchAchievements();
    } catch (err: any) {
      toast.error(err.message || 'Gagal mencatat prestasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (achievementId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) return;

    try {
      const res = await fetch(`/api/v1/students/achievements/${achievementId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as { message?: string }).message || 'Gagal menghapus prestasi');
      }

      toast.success('Prestasi berhasil dihapus');
      fetchAchievements();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus prestasi');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white dark:bg-zinc-950 p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <Trophy className="h-5 w-5 text-amber-500" />
            Prestasi & Penghargaan — {studentName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
          {/* Form Column */}
          <form onSubmit={handleSubmit} className="md:col-span-5 flex flex-col gap-4 border-r border-zinc-100 dark:border-zinc-800/80 pr-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Catat Prestasi Baru</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Nama Prestasi</label>
              <Input
                placeholder="Contoh: Juara 1 MQK"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-sm dark:bg-zinc-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Tingkat</label>
              <Select value={level} onValueChange={(v: any) => setLevel(v)}>
                <SelectTrigger className="h-9 text-sm dark:bg-zinc-900">
                  <SelectValue placeholder="Pilih Tingkat" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900">
                  <SelectItem value="Internal">Internal (Pesantren)</SelectItem>
                  <SelectItem value="Kecamatan">Kecamatan</SelectItem>
                  <SelectItem value="Kabupaten">Kabupaten / Kota</SelectItem>
                  <SelectItem value="Provinsi">Provinsi</SelectItem>
                  <SelectItem value="Nasional">Nasional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Tanggal</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 text-sm dark:bg-zinc-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Catatan</label>
              <textarea
                placeholder="Keterangan tambahan..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 dark:border-zinc-800"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 h-9.5 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Catat Prestasi
                </>
              )}
            </Button>
          </form>

          {/* List Column */}
          <div className="md:col-span-7 flex flex-col gap-4 min-h-[300px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Daftar Penghargaan</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center flex-1">
                <Loader2 className="h-6 w-6 text-zinc-300 animate-spin" />
              </div>
            ) : achievements.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-center text-zinc-400">
                <Award className="h-8 w-8 text-zinc-300 mb-2" />
                <p className="text-xs">Belum ada prestasi tercatat.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-1">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="flex items-start justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          ach.level === 'Nasional' ? 'bg-purple-100 text-purple-700' :
                          ach.level === 'Provinsi' ? 'bg-blue-100 text-blue-700' :
                          ach.level === 'Kabupaten' ? 'bg-amber-100 text-amber-700' :
                          ach.level === 'Kecamatan' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {ach.level}
                        </span>
                        <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ach.date}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{ach.title}</p>
                      {ach.notes && <p className="text-xs text-zinc-500 italic mt-0.5">{ach.notes}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(ach.id)}
                      className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

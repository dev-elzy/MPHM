import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

import { Student } from '@/features/students/types';

const mutasiSchema = z.object({
  mutationType: z.enum(['cuti', 'boyong', 'dikeluarkan', 'khidmah', 'alumni']),
  note: z.string().optional(),
  khidmahLocation: z.string().optional(),
  university: z.string().optional(),
  profession: z.string().optional(),
});

type MutasiFormValues = z.infer<typeof mutasiSchema>;

interface MutasiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export function MutasiDialog({ open, onOpenChange, student }: MutasiDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<MutasiFormValues>({
    resolver: zodResolver(mutasiSchema),
    defaultValues: {
      mutationType: 'cuti',
      note: '',
      khidmahLocation: '',
      university: '',
      profession: '',
    },
  });

  const watchMutationType = form.watch('mutationType');

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open && student) {
      form.reset({
        mutationType: 'cuti',
        note: '',
        khidmahLocation: '',
        university: '',
        profession: '',
      });
    }
  }, [open, student, form]);

  const mutateAsync = async (data: MutasiFormValues) => {
    if (!student) return;
    const res = await fetch(`/api/v1/data-center/students/${student.id}/mutate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const err: any = await res.json();
      const errMessage = err.message || 'Gagal mengubah status siswi';
      throw new Error(err.error || errMessage);
    }
    return res.json();
  };

  const mutation = useMutation({
    mutationFn: mutateAsync,
    onSuccess: () => {
      toast.success('Berhasil melakukan mutasi pada santriwati');
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (data: MutasiFormValues) => {
    mutation.mutate(data);
  };

  if (!student) return null;

  // Smart logic for available options
  // Assuming student.className contains format like "Aliyyah 3-A" or "Ibtidaiyyah 1-B"
  const isAliyyah = student.className?.toLowerCase().includes('aliyyah');
  const isAkhir = student.className?.includes('3-') || student.className?.includes('III') || student.className?.includes('12');
  const isAkhirAliyyah = isAliyyah && isAkhir;
  const isKhidmah = student.status === 'khidmah'; // Need status to verify if they can graduate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mutasi Santriwati</DialogTitle>
          <DialogDescription>
            Ubah status <strong>{student.name}</strong>. Aksi ini akan mempengaruhi aktifitas akademik dan riwayat kelasnya.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            
            <FormField
              control={form.control}
              name="mutationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Mutasi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Jenis Mutasi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cuti">Cuti Sementara</SelectItem>
                      <SelectItem value="boyong">Boyong / Pindah</SelectItem>
                      <SelectItem value="dikeluarkan">Dikeluarkan</SelectItem>
                      {isAkhirAliyyah && (
                        <SelectItem value="khidmah">Tugas Khidmah (Akhir Aliyyah)</SelectItem>
                      )}
                      {isKhidmah && (
                        <SelectItem value="alumni">Lulus (Alumnus)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchMutationType === 'alumni' && (
              <>
                <FormField
                  control={form.control}
                  name="khidmahLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi Pengabdian / Khidmah Sebelumnya</FormLabel>
                      <FormControl>
                        <Input placeholder="Cth: Ponpes Al-Anwar..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Universitas Lanjutan (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Cth: Al-Azhar Kairo..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan / Alasan Mutasi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan catatan pendukung mutasi..."
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Memproses...' : 'Simpan Mutasi'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

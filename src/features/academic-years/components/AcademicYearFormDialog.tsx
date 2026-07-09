'use client';

import * as React from 'react';

import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AcademicYear } from '../types';
import { academicYearSchema, type AcademicYearFormData } from '../schemas';
import { useCreateAcademicYear, useUpdateAcademicYear } from '../mutations';

interface AcademicYearFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: AcademicYear;
}

export function AcademicYearFormDialog({ open, onOpenChange, initialData }: AcademicYearFormDialogProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateAcademicYear();
  const updateMutation = useUpdateAcademicYear();

  const form = useReactHookForm<AcademicYearFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(academicYearSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      status: initialData?.status || 'Draft',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      description: initialData?.description || '',
      semesters: initialData?.semesters || [],
    },
  });

  // Reset form when opened with new data
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          status: initialData.status,
          startDate: initialData.startDate,
          endDate: initialData.endDate,
          description: initialData.description || '',
          semesters: initialData.semesters,
        });
      } else {
        form.reset({
          name: '',
          status: 'Draft',
          startDate: '',
          endDate: '',
          description: '',
          semesters: [],
        });
      }
    }
  }, [open, initialData, form]);

  const onSubmit = async (data: AcademicYearFormData) => {
    if (isEditing && initialData) {
      await updateMutation.mutateAsync({ id: initialData.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Tahun Ajaran' : 'Buat Tahun Ajaran'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Perbarui informasi tahun ajaran yang sudah ada.' 
              : 'Tahun ajaran baru akan menjadi dasar seluruh data akademik (kelas, siswa, nilai).'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Tahun Ajaran</FormLabel>
                  <FormControl>
                    <Input placeholder="2024/2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Mulai</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Selesai</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active (Aktif)</SelectItem>
                      <SelectItem value="Archived">Archived (Arsip)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[13px] opacity-80 mt-2">
                    Peringatan: Mengubah ke &apos;Active&apos; akan otomatis menonaktifkan tahun ajaran aktif lainnya.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading} className="rounded-lg">
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.2)] dark:shadow-[0_2px_10px_-3px_rgba(255,255,255,0.2)] transition-all">
                {isLoading ? 'Menyimpan...' : 'Simpan Tahun Ajaran'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

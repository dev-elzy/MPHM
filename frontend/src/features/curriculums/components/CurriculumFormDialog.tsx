'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Curriculum } from '../types';
import { curriculumFormSchema, type CurriculumFormData } from '../schemas';
import { useCreateCurriculum, useUpdateCurriculum } from '../mutations';
import { useAcademicYears } from '@/features/academic-years/queries/useAcademicYears';

interface CurriculumFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Curriculum;
  defaultAcademicYearId?: string;
}

export function CurriculumFormDialog({
  open,
  onOpenChange,
  initialData,
  defaultAcademicYearId = '',
}: CurriculumFormDialogProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateCurriculum();
  const updateMutation = useUpdateCurriculum();

  const { data: years } = useAcademicYears();

  const form = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumFormSchema),
    defaultValues: {
      name: '',
      academicYearId: defaultAcademicYearId,
      description: '',
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name || '',
        academicYearId: initialData?.academicYearId || defaultAcademicYearId,
        description: initialData?.description || '',
      });
    }
  }, [open, initialData, defaultAcademicYearId, form]);

  const onSubmit = async (values: CurriculumFormData) => {
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      onOpenChange(false);
    } catch {
      // Handled by react query mutation callback notifications
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {isEditing ? 'Ubah Kurikulum' : 'Tambah Kurikulum'}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            {isEditing
              ? 'Perbarui detail nama atau catatan dari kurikulum terpilih.'
              : 'Tambahkan kerangka kurikulum baru untuk tahun ajaran aktif.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-3 text-left">
            <FormField
              control={form.control}
              name="academicYearId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Tahun Ajaran</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEditing || !!defaultAcademicYearId}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9.5 text-sm">
                        <SelectValue placeholder="Pilih Tahun Ajaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years?.map((y) => (
                        <SelectItem key={y.id} value={y.id} className="cursor-pointer text-sm">
                          {y.name} {y.status === 'Active' && '(Aktif)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Nama Kurikulum</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Kurikulum Merdeka KMI 2026" className="h-9.5 text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Keterangan / Deskripsi</FormLabel>
                  <FormControl>
                    <Input placeholder="Tambahkan deskripsi singkat..." className="h-9.5 text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-zinc-150 dark:border-zinc-800/80">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="h-9.5 text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-9.5 text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
              >
                {isPending ? 'Menyimpan...' : 'Simpan Kurikulum'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

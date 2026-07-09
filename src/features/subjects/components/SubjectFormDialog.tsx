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
import { Subject } from '../../curriculums/types';
import { subjectFormSchema, type SubjectFormData } from '../schemas';
import { useCreateSubject, useUpdateSubject } from '../mutations';

interface SubjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Subject;
}

export function SubjectFormDialog({ open, onOpenChange, initialData }: SubjectFormDialogProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: '',
      arabicName: '',
      code: '',
      description: '',
      category: 'KMI',
    },
  });

  // Sync form state on open / initialData changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name || '',
        arabicName: initialData?.arabicName || '',
        code: initialData?.code || '',
        description: initialData?.description || '',
        category: initialData?.category || 'KMI',
      });
    }
  }, [open, initialData, form]);

  const onSubmit = async (values: SubjectFormData) => {
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
            {isEditing ? 'Ubah Mata Pelajaran' : 'Tambah Mata Pelajaran'}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            {isEditing
              ? 'Perbarui detail mata pelajaran ini. Pastikan kode tidak ganda.'
              : 'Tambahkan data mata pelajaran master baru ke dalam database.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-3 text-left">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Kode Pelajaran</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ARB-101" className="h-9.5 text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9.5 text-sm">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="KMI" className="cursor-pointer text-sm">KMI (Madrasah)</SelectItem>
                        <SelectItem value="Kepesantrenan" className="cursor-pointer text-sm">Kepesantrenan</SelectItem>
                        <SelectItem value="Tahfidz" className="cursor-pointer text-sm">Tahfidz</SelectItem>
                        <SelectItem value="Umum" className="cursor-pointer text-sm">Umum</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Nama Pelajaran (Indonesia)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bahasa Arab" className="h-9.5 text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arabicName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Nama Pelajaran (Arab / Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. اللغة العربية" dir="rtl" className="h-9.5 text-sm font-medium text-right" {...field} />
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
                  <FormLabel className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Deskripsi / Catatan</FormLabel>
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
                {isPending ? 'Menyimpan...' : 'Simpan Pelajaran'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

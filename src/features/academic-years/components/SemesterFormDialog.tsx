import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Semester, AcademicYear } from '../types';
import { semesterFormSchema, type SemesterFormData } from '../schemas';
import { useCreateSemester, useUpdateSemester } from '../mutations';

interface SemesterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYearId: string;
  parentYear?: AcademicYear;
  initialData?: Semester;
}

export function SemesterFormDialog({ 
  open, 
  onOpenChange, 
  academicYearId,
  parentYear,
  initialData 
}: SemesterFormDialogProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateSemester();
  const updateMutation = useUpdateSemester();

  const form = useForm<SemesterFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(semesterFormSchema) as any,
    defaultValues: {
      academicYearId: academicYearId,
      name: initialData?.name || '',
      status: initialData?.status || 'Draft',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
    },
  });

  // Reset form when dialog opens/closes or initialData changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        academicYearId: academicYearId,
        name: initialData?.name || '',
        status: initialData?.status || 'Draft',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
      });
    }
  }, [open, initialData, academicYearId, form]);

  const onSubmit = (data: SemesterFormData) => {
    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Semester' : 'Tambah Semester Baru'}</DialogTitle>
          <DialogDescription>
            {parentYear ? (
              <span>
                Semester ini akan ditambahkan pada Tahun Ajaran <strong>{parentYear.name}</strong> 
                ({new Date(parentYear.startDate).toLocaleDateString('id-ID')} - {new Date(parentYear.endDate).toLocaleDateString('id-ID')}).
              </span>
            ) : (
              'Masukkan detail semester baru di bawah ini.'
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Semester</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Ganjil" {...field} />
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
                      <SelectTrigger className="h-10 rounded-[10px] bg-zinc-50/50 shadow-xs border-zinc-200">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-zinc-200 shadow-xl">
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active (Aktif)</SelectItem>
                      <SelectItem value="Completed">Completed (Selesai)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[13px] opacity-80 mt-2">
                    Peringatan: Mengubah ke &apos;Active&apos; akan otomatis menyelesaikan (Completed) semester aktif lainnya di tahun ajaran ini.
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
                {isLoading ? 'Menyimpan...' : 'Simpan Semester'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

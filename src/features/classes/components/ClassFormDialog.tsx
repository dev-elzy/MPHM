import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
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

import { Class, Jenjang, Tingkat } from '../types';
import { classSchema, type ClassFormData } from '../schemas';
import { useCreateClass, useUpdateClass } from '../mutations';
import { useCurriculumLookup, useMustahiqLookup } from '../queries';

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYearId: string;
  semesterId: string;
  initialData?: Class;
}

const JENJANG_TINGKAT_MAP: Record<Jenjang, Tingkat[]> = {
  'I\'dadiyyah': ['I', 'II', 'III'],
  'Ibtida\'iyyah': ['I', 'II', 'III', 'IV', 'V', 'VI'],
  'Tsanawiyyah': ['I', 'II', 'III'],
  'Aliyyah': ['I', 'II', 'III'],
};

export function ClassFormDialog({
  open,
  onOpenChange,
  academicYearId,
  semesterId,
  initialData,
}: ClassFormDialogProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateClass();
  const updateMutation = useUpdateClass();

  const { data: curriculums, isLoading: isLoadingCurriculums } = useCurriculumLookup();
  const { data: mustahiqs, isLoading: isLoadingMustahiqs } = useMustahiqLookup();

  const form = useForm<ClassFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(classSchema) as any,
    defaultValues: {
      academicYearId,
      semesterId,
      jenjang: initialData?.jenjang || undefined,
      tingkat: initialData?.tingkat || undefined,
      bagian: initialData?.bagian || '',
      curriculumId: initialData?.curriculumId || '',
      mustahiqId: initialData?.mustahiqId || '',
      status: initialData?.status || 'Active',
    },
  });

  const { setValue, control } = form;
  const selectedJenjang = useWatch({ control, name: 'jenjang' });
  const selectedTingkat = useWatch({ control, name: 'tingkat' });
  const selectedBagian = useWatch({ control, name: 'bagian' });

  React.useEffect(() => {
    if (open) {
      form.reset({
        academicYearId,
        semesterId,
        jenjang: initialData?.jenjang || undefined,
        tingkat: initialData?.tingkat || undefined,
        bagian: initialData?.bagian || '',
        curriculumId: initialData?.curriculumId || '',
        mustahiqId: initialData?.mustahiqId || '',
        status: initialData?.status || 'Active',
      });
    }
  }, [open, initialData, academicYearId, semesterId, form]);

  const onSubmit = (data: ClassFormData) => {
    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const validTingkats = selectedJenjang ? JENJANG_TINGKAT_MAP[selectedJenjang] : [];

  const previewName = (selectedJenjang && selectedTingkat && selectedBagian)
    ? `${selectedJenjang} ${selectedTingkat}-${selectedBagian}`
    : 'Menunggu input...';

  const isFormError = createMutation.isError || updateMutation.isError;
  const errorMsg = createMutation.error?.message || updateMutation.error?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Kelas' : 'Tambah Kelas Baru'}</DialogTitle>
          <DialogDescription>
            Atur identitas kelas dan penugasan dasar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jenjang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenjang</FormLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        // Reset tingkat when jenjang changes
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        setValue('tingkat', undefined as any, { shouldValidate: true });
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 bg-zinc-50/50 shadow-xs border-zinc-200">
                          <SelectValue placeholder="Pilih jenjang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="I'dadiyyah">I&apos;dadiyyah</SelectItem>
                        <SelectItem value="Ibtida'iyyah">Ibtida&apos;iyyah</SelectItem>
                        <SelectItem value="Tsanawiyyah">Tsanawiyyah</SelectItem>
                        <SelectItem value="Aliyyah">Aliyyah</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tingkat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tingkat</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedJenjang}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-zinc-50/50 shadow-xs border-zinc-200">
                          <SelectValue placeholder="Pilih tingkat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {validTingkats.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bagian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bagian</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: A, B, C, atau Unggulan" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ketik bagian kelas (contoh: A, B, C).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800/50 p-3 flex flex-col gap-1 border border-zinc-200/50 dark:border-zinc-800">
              <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Preview Identitas Kelas</span>
              <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                {previewName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="curriculumId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kurikulum</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-zinc-50/50 shadow-xs border-zinc-200">
                          <SelectValue placeholder={isLoadingCurriculums ? "Memuat..." : "Pilih kurikulum"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {curriculums?.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mustahiqId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mustahiq (Opsional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-zinc-50/50 shadow-xs border-zinc-200">
                          <SelectValue placeholder={isLoadingMustahiqs ? "Memuat..." : "Pilih wali kelas"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">-- Belum ada --</SelectItem>
                        {mustahiqs?.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isFormError && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-md border border-red-200 dark:border-red-900/50">
                {errorMsg}
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition-all rounded-lg">
                {isLoading ? 'Menyimpan...' : 'Simpan Kelas'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

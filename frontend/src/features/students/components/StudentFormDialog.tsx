'use client';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { Student } from '../types';
import { studentSchema, type StudentFormData } from '../schemas';
import { useCreateStudent, useUpdateStudent } from '../mutations';
import { useClasses } from '@/features/classes/queries/useClasses';
import { AddressSelector } from './AddressSelector';
import { PhotoUpload } from './PhotoUpload';

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYearId: string;
  semesterId: string;
  initialData?: Student;
}

export function StudentFormDialog({
  open,
  onOpenChange,
  academicYearId,
  semesterId,
  initialData,
}: StudentFormDialogProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateStudent(academicYearId, semesterId);
  const updateMutation = useUpdateStudent(academicYearId, semesterId);

  // Fetch list of classes for selection
  const { data: classesData } = useClasses(academicYearId, semesterId);

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      nis: '',
      nisn: '',
      name: '',
      birthPlace: '',
      birthDate: '',
      gender: 'female',
      phone: '',
      parentName: '',
      parentPhone: '',
      province: '',
      city: '',
      district: '',
      subDistrict: '',
      postalCode: '',
      address: '',
      entryYear: '',
      entryJenjang: '',
      status: 'active',
      notes: '',
      classId: '',
      photo: null,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        nis: initialData?.nis || '',
        nisn: initialData?.nisn || '',
        name: initialData?.name || '',
        birthPlace: initialData?.birthPlace || '',
        birthDate: initialData?.birthDate || '',
        gender: initialData?.gender || 'female',
        phone: initialData?.phone || '',
        parentName: initialData?.parentName || '',
        parentPhone: initialData?.parentPhone || '',
        province: (initialData as any)?.province || '',
        city: (initialData as any)?.city || '',
        district: (initialData as any)?.district || '',
        subDistrict: (initialData as any)?.subDistrict || '',
        postalCode: (initialData as any)?.postalCode || '',
        address: initialData?.address || '',
        entryYear: initialData?.entryYear || '',
        entryJenjang: initialData?.entryJenjang || '',
        status: initialData?.status || 'active',
        notes: initialData?.notes || '',
        classId: initialData?.classId || '',
        photo: null,
      });
    }
  }, [open, initialData, form]);

  const onSubmit = async (data: Record<string, unknown>) => {
    const values = data as unknown as StudentFormData;
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      onOpenChange(false);
    } catch {
      // Mutation query onError handles notification toasts
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const watchProvince = form.watch('province');
  const watchCity = form.watch('city');
  const watchDistrict = form.watch('district');
  const watchSubDistrict = form.watch('subDistrict');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {isEditing ? 'Ubah Profil Siswi' : 'Daftarkan Siswi Baru'}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            {isEditing
              ? 'Ubah informasi profil lengkap data siswi pesantren.'
              : 'Daftarkan data siswi baru dan hubungkan langsung dengan Rombel Kelas.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            
            <div className="flex justify-center mb-6">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PhotoUpload 
                        value={field.value} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-center mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 1: Nama */}
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Nama Lengkap Siswi <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama lengkap siswi"
                        className="h-9.5 text-sm dark:bg-zinc-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: NIS & NISN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nomor Induk Siswi (NIS)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan NIS"
                        className="h-9.5 text-sm dark:bg-zinc-900"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nisn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">NISN (Nasional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan NISN jika ada"
                        className="h-9.5 text-sm dark:bg-zinc-900"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: TTL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Tempat Lahir</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tempat lahir"
                        className="h-9.5 text-sm dark:bg-zinc-900"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-9.5 text-sm dark:bg-zinc-900"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 4: Class & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Kelas Rombel (Semester Ini)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'none'}>
                      <FormControl>
                        <SelectTrigger className="h-9.5 text-sm dark:bg-zinc-900">
                          <SelectValue placeholder="Pilih Kelas Rombel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-zinc-950">
                        <SelectItem value="none">Belum Ditugaskan / Non-Kelas</SelectItem>
                        {classesData?.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Status Keaktifan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9.5 text-sm dark:bg-zinc-900">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-zinc-950">
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="mutasi">Mutasi / Keluar</SelectItem>
                        <SelectItem value="lulus">Lulus</SelectItem>
                        <SelectItem value="alumnus">Alumnus</SelectItem>
                        <SelectItem value="non_active">Non-Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 5: Wali / Parent */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nama Wali / Orang Tua</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama orang tua/wali"
                        className="h-9.5 text-sm dark:bg-zinc-900"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">HP Orang Tua / Wali</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="08xxxxxxxxxx"
                        className="h-9.5 text-sm dark:bg-zinc-900"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Informasi Alamat (Emsifa)</h4>
              
              <AddressSelector
                provinceVal={watchProvince || ''}
                cityVal={watchCity || ''}
                districtVal={watchDistrict || ''}
                subDistrictVal={watchSubDistrict || ''}
                onProvinceChange={(id) => { form.setValue('province', id); form.setValue('city', ''); form.setValue('district', ''); form.setValue('subDistrict', ''); }}
                onCityChange={(id) => { form.setValue('city', id); form.setValue('district', ''); form.setValue('subDistrict', ''); }}
                onDistrictChange={(id) => { form.setValue('district', id); form.setValue('subDistrict', ''); }}
                onSubDistrictChange={(id) => form.setValue('subDistrict', id)}
              />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Alamat Lengkap (Jalan, RT/RW, dll)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detail alamat..."
                            className="min-h-[40px] text-sm dark:bg-zinc-900 resize-none"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Kode Pos</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Kode Pos"
                            className="h-14 text-sm dark:bg-zinc-900"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Catatan Lainnya</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Catatan prestasi, riwayat kesehatan, atau beasiswa"
                      className="h-9.5 text-sm dark:bg-zinc-900"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9.5 text-sm rounded-lg"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-9.5 text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg shadow-sm"
              >
                {isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

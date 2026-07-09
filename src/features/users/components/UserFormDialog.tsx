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
import { Button } from '@/components/ui/button';

import { User } from '../types';
import { userSchema, type UserFormData } from '../schemas';
import { useCreateUser, useUpdateUser } from '../mutations';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: User;
}

export function UserFormDialog({
  open,
  onOpenChange,
  initialData,
}: UserFormDialogProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      role: 'mustahiq',
      status: 'active',
      phone: '',
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        email: initialData?.email || '',
        name: initialData?.name || '',
        password: '', // Always reset password to empty
        role: initialData?.role || 'mustahiq',
        status: initialData?.status || 'active',
        phone: initialData?.phone || '',
      });
    }
  }, [open, initialData, form]);

  const onSubmit = async (data: Record<string, unknown>) => {
    const values = data as unknown as UserFormData;
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data: values });
      } else {
        // Enforce password required on create
        if (!values.password) {
          form.setError('password', { message: 'Password wajib diisi untuk pengguna baru' });
          return;
        }
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
            {isEditing ? 'Ubah Pengguna' : 'Tambah Pengguna Baru'}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            {isEditing
              ? 'Ubah informasi pengguna sistem dan wali kelas.'
              : 'Daftarkan pengguna baru dan berikan hak akses operasional.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField<UserFormData>
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama lengkap" className="h-9.5 text-sm dark:bg-zinc-900" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Alamat Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@domain.com"
                      className="h-9.5 text-sm dark:bg-zinc-900"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Password {isEditing ? '(Kosongkan jika tidak diubah)' : ''}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={isEditing ? '••••••••' : 'Masukkan password'}
                      className="h-9.5 text-sm dark:bg-zinc-900"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Hak Akses (Role)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9.5 text-sm dark:bg-zinc-900">
                          <SelectValue placeholder="Pilih Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-zinc-950">
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="operator">Operator Akademik</SelectItem>
                        <SelectItem value="mustahiq">Mustahiq / Guru</SelectItem>
                        <SelectItem value="mudir">Mudir Pesantren</SelectItem>
                        <SelectItem value="mufatish">Mufatish / Pengawas</SelectItem>
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
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Status Akun</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9.5 text-sm dark:bg-zinc-900">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-zinc-950">
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Non-Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">No HP / WhatsApp</FormLabel>
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

            <DialogFooter className="pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-5 text-sm rounded-full border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-10 px-6 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-95 rounded-full shadow-md shadow-primary/20 cursor-pointer transition-all"
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

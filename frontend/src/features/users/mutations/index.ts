import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import { UserFormData } from '../schemas';
import { User } from '../types';
import { toast } from 'sonner';

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, UserFormData>({
    mutationFn: (data) => usersService.create(data),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`Pengguna ${newUser.name} berhasil dibuat`);
    },
    onError: (err) => {
      toast.error(err.message || 'Gagal membuat pengguna');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation<User, Error, { id: string; data: UserFormData }>({
    mutationFn: ({ id, data }) => usersService.update(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-detail', updatedUser.id] });
      toast.success(`Pengguna ${updatedUser.name} berhasil diperbarui`);
    },
    onError: (err) => {
      toast.error(err.message || 'Gagal memperbarui pengguna');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Pengguna berhasil dipindahkan ke Recycle Bin');
    },
    onError: (err) => {
      toast.error(err.message || 'Gagal menghapus pengguna');
    },
  });
}

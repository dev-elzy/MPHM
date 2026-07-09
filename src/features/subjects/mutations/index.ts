import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subjectsService } from '../services/subjects.service';
import { SUBJECTS_QUERY_KEY } from '../queries/useSubjects';

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subjectsService.create,
    onSuccess: () => {
      toast.success('Mata pelajaran berhasil dibuat');
      queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error('Gagal membuat mata pelajaran', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof subjectsService.update>[1] }) =>
      subjectsService.update(id, data),
    onSuccess: () => {
      toast.success('Mata pelajaran berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error('Gagal memperbarui mata pelajaran', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subjectsService.delete,
    onSuccess: () => {
      toast.success('Mata pelajaran dipindahkan ke Recycle Bin');
      queryClient.invalidateQueries({ queryKey: SUBJECTS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error('Gagal menghapus mata pelajaran', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

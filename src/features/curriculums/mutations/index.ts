import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { curriculumsService } from '../services/curriculums.service';
import { CURRICULUMS_QUERY_KEY } from '../queries/useCurriculums';

export function useCreateCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: curriculumsService.create,
    onSuccess: () => {
      toast.success('Kurikulum berhasil dibuat');
      queryClient.invalidateQueries({ queryKey: CURRICULUMS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error('Gagal membuat Kurikulum', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

export function useUpdateCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof curriculumsService.update>[1] }) =>
      curriculumsService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Kurikulum berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: CURRICULUMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['curriculum-subjects', variables.id] });
    },
    onError: (error) => {
      toast.error('Gagal memperbarui Kurikulum', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

export function useDeleteCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: curriculumsService.delete,
    onSuccess: () => {
      toast.success('Kurikulum dipindahkan ke Recycle Bin');
      queryClient.invalidateQueries({ queryKey: CURRICULUMS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error('Gagal menghapus Kurikulum', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

export function useUpdateCurriculumSubjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ curriculumId, subjects }: { curriculumId: string; subjects: Parameters<typeof curriculumsService.updateSubjects>[1] }) =>
      curriculumsService.updateSubjects(curriculumId, subjects),
    onSuccess: (_, variables) => {
      toast.success('Mata pelajaran kurikulum berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['curriculum-subjects', variables.curriculumId] });
    },
    onError: (error) => {
      toast.error('Gagal memperbarui mata pelajaran kurikulum', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

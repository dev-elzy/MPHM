import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { academicYearsService } from '../services/academic-years.service';
import { ACADEMIC_YEARS_QUERY_KEY } from '../queries/useAcademicYears';

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: academicYearsService.create,
    onSuccess: () => {
      toast.success('Tahun Ajaran berhasil dibuat');
      queryClient.invalidateQueries({ queryKey: ACADEMIC_YEARS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error('Gagal membuat Tahun Ajaran', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof academicYearsService.update>[1] }) =>
      academicYearsService.update(id, data),
    onSuccess: () => {
      toast.success('Tahun Ajaran berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ACADEMIC_YEARS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error('Gagal memperbarui Tahun Ajaran', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

export function useDeleteAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: academicYearsService.delete,
    onSuccess: () => {
      toast.success('Tahun Ajaran dipindahkan ke Recycle Bin');
      queryClient.invalidateQueries({ queryKey: ACADEMIC_YEARS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error('Gagal menghapus Tahun Ajaran', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

export * from './useSemesterMutations';

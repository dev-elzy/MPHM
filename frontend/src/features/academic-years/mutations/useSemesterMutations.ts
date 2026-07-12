import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { semestersService } from '../services/semesters.service';
import { SemesterFormData } from '../schemas';

export function useCreateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SemesterFormData) => semestersService.createSemester(data),
    onSuccess: (_, variables) => {
      toast.success('Semester berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['semesters', variables.academicYearId] });
    },
    onError: (error) => {
      toast.error('Gagal menambahkan semester', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

export function useUpdateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SemesterFormData }) =>
      semestersService.updateSemester(id, data),
    onSuccess: (_, variables) => {
      toast.success('Semester berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['semesters', variables.data.academicYearId] });
    },
    onError: (error) => {
      toast.error('Gagal memperbarui semester', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; academicYearId: string }) => 
      semestersService.deleteSemester(id),
    onSuccess: (_, variables) => {
      toast.success('Semester berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['semesters', variables.academicYearId] });
    },
    onError: (error) => {
      toast.error('Gagal menghapus semester', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
      });
    },
  });
}

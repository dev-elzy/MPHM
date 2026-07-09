import { useMutation, useQueryClient } from '@tanstack/react-query';
import { semestersService } from '../services/semesters.service';
import { SemesterFormData } from '../schemas';

export function useCreateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SemesterFormData) => semestersService.createSemester(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['semesters', variables.academicYearId] });
    },
  });
}

export function useUpdateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SemesterFormData }) =>
      semestersService.updateSemester(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['semesters', variables.data.academicYearId] });
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; academicYearId: string }) => 
      semestersService.deleteSemester(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['semesters', variables.academicYearId] });
    },
  });
}

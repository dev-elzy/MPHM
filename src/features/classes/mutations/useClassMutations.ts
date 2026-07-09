import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesService } from '../services/classes.service';
import { ClassFormData } from '../schemas';

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClassFormData) => classesService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['classes', variables.academicYearId, variables.semesterId],
      });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassFormData }) =>
      classesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['classes', variables.data.academicYearId, variables.data.semesterId],
      });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; academicYearId: string; semesterId: string }) =>
      classesService.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['classes', variables.academicYearId, variables.semesterId],
      });
    },
  });
}

export function useAssignMustahiqClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, mustahiqId }: { classId: string; mustahiqId: string; academicYearId: string; semesterId: string }) =>
      classesService.assignMustahiq(classId, mustahiqId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['classes', variables.academicYearId, variables.semesterId],
      });
    },
  });
}

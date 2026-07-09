import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsService } from '../services/students.service';
import { StudentFormData } from '../schemas';
import { Student } from '../types';
import { toast } from 'sonner';

export function useCreateStudent(academicYearId?: string | null, semesterId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation<
    Student,
    Error,
    StudentFormData
  >({
    mutationFn: (data) => studentsService.create(data, academicYearId, semesterId),
    onSuccess: (newStudent) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success(`Siswi ${newStudent.name} berhasil didaftarkan`);
    },
    onError: (err) => {
      toast.error(err.message || 'Gagal mendaftarkan siswi');
    },
  });
}

export function useUpdateStudent(academicYearId?: string | null, semesterId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation<
    Student,
    Error,
    { id: string; data: StudentFormData }
  >({
    mutationFn: ({ id, data }) => studentsService.update(id, data, academicYearId, semesterId),
    onSuccess: (updatedStudent) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student-detail', updatedStudent.id] });
      toast.success(`Profil ${updatedStudent.name} berhasil diperbarui`);
    },
    onError: (err) => {
      toast.error(err.message || 'Gagal memperbarui profil siswi');
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => studentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Profil siswi berhasil dipindahkan ke Recycle Bin');
    },
    onError: (err) => {
      toast.error(err.message || 'Gagal menghapus data siswi');
    },
  });
}

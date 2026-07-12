import { useQuery } from '@tanstack/react-query';
import { studentsService } from '../services/students.service';
import { Student } from '../types';

export function useStudents(params: {
  search?: string;
  status?: string;
  classId?: string;
  academicYearId?: string;
  semesterId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<{ items: Student[]; total: number }, Error>({
    queryKey: ['students', params],
    queryFn: () => studentsService.getAll(params),
    placeholderData: (prev) => prev,
  });
}

export function useStudentDetail(id: string, academicYearId?: string, semesterId?: string) {
  return useQuery<Student | undefined, Error>({
    queryKey: ['student-detail', id, academicYearId, semesterId],
    queryFn: () => studentsService.getById(id, academicYearId, semesterId),
    enabled: !!id,
  });
}

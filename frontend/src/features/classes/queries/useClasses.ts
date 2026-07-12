import { useQuery } from '@tanstack/react-query';
import { classesService } from '../services/classes.service';
import { Class } from '../types';

export function useClasses(academicYearId: string, semesterId: string) {
  return useQuery<Class[], Error>({
    queryKey: ['classes', academicYearId, semesterId],
    queryFn: () => classesService.getByAcademicYearAndSemester(academicYearId, semesterId),
    enabled: !!academicYearId && !!semesterId, // Only fetch if both IDs are provided
  });
}

import { useQuery } from '@tanstack/react-query';
import { semestersService } from '../services/semesters.service';

export function useSemesters(academicYearId: string) {
  return useQuery({
    queryKey: ['semesters', academicYearId],
    queryFn: () => semestersService.getSemestersByAcademicYear(academicYearId),
    enabled: !!academicYearId,
  });
}

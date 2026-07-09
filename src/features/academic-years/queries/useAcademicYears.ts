import { useQuery } from '@tanstack/react-query';
import { academicYearsService } from '../services/academic-years.service';

export const ACADEMIC_YEARS_QUERY_KEY = ['academic-years'] as const;

export function useAcademicYears() {
  return useQuery({
    queryKey: ACADEMIC_YEARS_QUERY_KEY,
    queryFn: academicYearsService.getAll,
  });
}

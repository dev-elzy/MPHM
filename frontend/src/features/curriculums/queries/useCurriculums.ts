import { useQuery } from '@tanstack/react-query';
import { curriculumsService } from '../services/curriculums.service';

export const CURRICULUMS_QUERY_KEY = ['curriculums'] as const;

export function useCurriculums(academicYearId?: string) {
  return useQuery({
    queryKey: academicYearId ? [...CURRICULUMS_QUERY_KEY, academicYearId] : CURRICULUMS_QUERY_KEY,
    queryFn: () => curriculumsService.getAll(academicYearId),
  });
}

export function useCurriculumSubjects(curriculumId: string) {
  return useQuery({
    queryKey: ['curriculum-subjects', curriculumId] as const,
    queryFn: () => curriculumsService.getSubjects(curriculumId),
    enabled: !!curriculumId,
  });
}

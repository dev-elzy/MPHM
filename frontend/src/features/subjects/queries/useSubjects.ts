import { useQuery } from '@tanstack/react-query';
import { subjectsService } from '../services/subjects.service';

export const SUBJECTS_QUERY_KEY = ['subjects'] as const;

export function useSubjects(category?: string) {
  return useQuery({
    queryKey: category ? [...SUBJECTS_QUERY_KEY, category] : SUBJECTS_QUERY_KEY,
    queryFn: () => subjectsService.getAll(category),
  });
}

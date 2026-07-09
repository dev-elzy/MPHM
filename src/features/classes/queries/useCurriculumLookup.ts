import { useQuery } from '@tanstack/react-query';
import { curriculumService } from '../services/curriculum.service';
import { CurriculumLookup } from '../types';

export function useCurriculumLookup() {
  return useQuery<CurriculumLookup[], Error>({
    queryKey: ['curriculum-lookup'],
    queryFn: () => curriculumService.getAll(),
  });
}

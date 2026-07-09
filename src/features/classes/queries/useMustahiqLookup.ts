import { useQuery } from '@tanstack/react-query';
import { mustahiqService } from '../services/mustahiq.service';
import { MustahiqLookup } from '../types';

export function useMustahiqLookup() {
  return useQuery<MustahiqLookup[], Error>({
    queryKey: ['mustahiq-lookup'],
    queryFn: () => mustahiqService.getAll(),
  });
}

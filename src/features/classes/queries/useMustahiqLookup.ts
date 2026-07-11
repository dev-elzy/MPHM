import { useQuery } from '@tanstack/react-query';
import { mustahiqService } from '../services/mustahiq.service';
import { MustahiqLookup } from '../types';

export function useMustahiqLookup(enabled: boolean = true) {
  return useQuery<MustahiqLookup[], Error>({
    queryKey: ['mustahiq-lookup'],
    queryFn: () => mustahiqService.getAll(),
    enabled,
  });
}

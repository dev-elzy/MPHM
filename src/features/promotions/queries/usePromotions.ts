import { useQuery } from '@tanstack/react-query';

export function usePromotions() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const res = await fetch('/api/v1/promotions');
      if (!res.ok) throw new Error('Gagal mengambil data promosi');
      const json = (await res.json()) as { data?: { items?: unknown[] } };
      return json.data?.items || [];
    },
  });
}

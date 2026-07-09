import { MustahiqLookup } from '../types';

interface MustahiqDbItem {
  id: string;
  name: string;
}

class MustahiqService {
  async getAll(): Promise<MustahiqLookup[]> {
    const res = await fetch('/api/v1/users?role=mustahiq');
    if (!res.ok) return [];
    
    const data = (await res.json()) as { data?: MustahiqDbItem[] };
    const items = data.data || [];
    return items.map((u: MustahiqDbItem) => ({
      id: u.id,
      name: u.name,
    }));
  }
}

export const mustahiqService = new MustahiqService();

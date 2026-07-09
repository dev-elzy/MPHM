import { CurriculumLookup } from '../types';

interface CurriculumDbItem {
  id: string;
  name: string;
}

class CurriculumService {
  async getAll(): Promise<CurriculumLookup[]> {
    const res = await fetch('/api/v1/curriculums?limit=100');
    if (!res.ok) return [];
    
    const data = (await res.json()) as { data?: { items?: CurriculumDbItem[] } };
    const items = data.data?.items || [];
    return items.map((c: CurriculumDbItem) => ({
      id: c.id,
      name: c.name,
    }));
  }
}

export const curriculumService = new CurriculumService();

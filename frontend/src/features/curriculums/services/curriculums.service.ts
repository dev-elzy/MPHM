import { Curriculum, CurriculumSubject } from '../types';
import { CurriculumFormData } from '../schemas';


export const curriculumsService = {
  getAll: async (academicYearId?: string): Promise<Curriculum[]> => {
    let url = '/api/v1/curriculums?limit=100';
    if (academicYearId) {
      url += `&academicYearId=${academicYearId}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data kurikulum' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data kurikulum');
    }
    const data = (await res.json()) as { data?: { items?: Curriculum[] } };
    return data.data?.items || [];
  },

  getById: async (id: string): Promise<Curriculum | undefined> => {
    const res = await fetch(`/api/v1/curriculums/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data kurikulum' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data kurikulum');
    }
    const data = (await res.json()) as { data?: Curriculum };
    return data.data;
  },

  create: async (data: CurriculumFormData): Promise<Curriculum> => {
    const res = await fetch('/api/v1/curriculums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal membuat kurikulum' }))) as { message?: string };
      throw new Error(err.message || 'Gagal membuat kurikulum');
    }
    const resJson = (await res.json()) as { data: { id: string } };
    const newId = resJson.data.id;
    const finalRecord = await curriculumsService.getById(newId);
    if (!finalRecord) throw new Error('Gagal memuat data kurikulum baru');
    return finalRecord;
  },

  update: async (id: string, data: CurriculumFormData): Promise<Curriculum> => {
    const res = await fetch(`/api/v1/curriculums/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal memperbarui kurikulum' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memperbarui kurikulum');
    }

    const finalRecord = await curriculumsService.getById(id);
    if (!finalRecord) throw new Error('Gagal memuat data kurikulum');
    return finalRecord;
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`/api/v1/curriculums/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menghapus kurikulum' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menghapus kurikulum');
    }
  },

  // Subjects link/unlink relation helper
  getSubjects: async (curriculumId: string): Promise<CurriculumSubject[]> => {
    const res = await fetch(`/api/v1/curriculums/${curriculumId}/subjects`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil mata pelajaran kurikulum' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil mata pelajaran kurikulum');
    }
    const data = (await res.json()) as { data?: CurriculumSubject[] };
    return data.data || [];
  },

  updateSubjects: async (
    curriculumId: string,
    subjects: {
      subjectId: string;
      sortOrder: number;
      maxScore: number;
      minScore: number;
      weight: number;
      notes?: string;
    }[]
  ): Promise<void> => {
    const res = await fetch(`/api/v1/curriculums/${curriculumId}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjects }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal memperbarui mata pelajaran kurikulum' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memperbarui mata pelajaran kurikulum');
    }
  },
};

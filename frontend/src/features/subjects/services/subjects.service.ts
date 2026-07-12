import { Subject } from '../../curriculums/types';
import { SubjectFormData } from '../schemas';

export const subjectsService = {
  getAll: async (category?: string): Promise<Subject[]> => {
    let url = '/api/v1/subjects?limit=100';
    if (category) {
      url += `&category=${category}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data mata pelajaran' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data mata pelajaran');
    }
    const data = (await res.json()) as { data?: { items?: Subject[] } };
    return data.data?.items || [];
  },

  getById: async (id: string): Promise<Subject | undefined> => {
    const res = await fetch(`/api/v1/subjects/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data mata pelajaran' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data mata pelajaran');
    }
    const data = (await res.json()) as { data?: Subject };
    return data.data;
  },

  create: async (data: SubjectFormData): Promise<Subject> => {
    const res = await fetch('/api/v1/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal membuat mata pelajaran' }))) as { message?: string };
      throw new Error(err.message || 'Gagal membuat mata pelajaran');
    }
    const resJson = (await res.json()) as { data: { id: string } };
    const newId = resJson.data.id;
    const finalRecord = await subjectsService.getById(newId);
    if (!finalRecord) throw new Error('Gagal memuat data mata pelajaran baru');
    return finalRecord;
  },

  update: async (id: string, data: SubjectFormData): Promise<Subject> => {
    const res = await fetch(`/api/v1/subjects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal memperbarui mata pelajaran' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memperbarui mata pelajaran');
    }

    const finalRecord = await subjectsService.getById(id);
    if (!finalRecord) throw new Error('Gagal memuat data mata pelajaran');
    return finalRecord;
  },

  importConfirm: async (items: Omit<Subject, 'id' | 'status' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>[]): Promise<void> => {
    const res = await fetch('/api/v1/subjects/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengimpor mata pelajaran' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengimpor mata pelajaran');
    }
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`/api/v1/subjects/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menghapus mata pelajaran' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menghapus mata pelajaran');
    }
  },
};

import { Semester } from '../types';
import { SemesterFormData } from '../schemas';

interface SemesterDbItem {
  id: string;
  academicYearId: string;
  name: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export const semestersService = {
  getSemestersByAcademicYear: async (academicYearId: string): Promise<Semester[]> => {
    const res = await fetch(`/api/v1/semesters?academicYearId=${academicYearId}`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data semester' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data semester');
    }
    const data = (await res.json()) as { data?: SemesterDbItem[] };
    const items = data.data || [];

    return items.map((s: SemesterDbItem) => ({
      id: s.id,
      academicYearId: s.academicYearId,
      name: s.name,
      status: s.isActive ? 'Active' : 'Completed',
      startDate: s.startDate || '',
      endDate: s.endDate || '',
    }));
  },

  createSemester: async (data: SemesterFormData): Promise<Semester> => {
    const res = await fetch('/api/v1/semesters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal membuat semester' }))) as { message?: string };
      throw new Error(err.message || 'Gagal membuat semester');
    }

    const yearSemesters = await semestersService.getSemestersByAcademicYear(data.academicYearId);
    return yearSemesters.find((s) => s.name === data.name) || yearSemesters[yearSemesters.length - 1];
  },

  updateSemester: async (id: string, data: SemesterFormData): Promise<Semester> => {
    // 1. If form status is changed to Active, trigger activation endpoint
    if (data.status === 'Active') {
      const actRes = await fetch(`/api/v1/semesters/${id}/activate`, {
        method: 'PATCH',
      });
      if (!actRes.ok) {
        const err = (await actRes.json().catch(() => ({ message: 'Gagal mengaktifkan semester' }))) as { message?: string };
        throw new Error(err.message || 'Gagal mengaktifkan semester');
      }
    }

    // 2. Perform detail update (dates, name, status)
    const res = await fetch(`/api/v1/semesters/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        isActive: data.status === 'Active',
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal memperbarui data semester' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memperbarui data semester');
    }

    const yearSemesters = await semestersService.getSemestersByAcademicYear(data.academicYearId);
    const updated = yearSemesters.find((s) => s.id === id);
    if (!updated) throw new Error('Gagal memuat data semester terbaru');
    return updated;
  },

  deleteSemester: async (_id: string): Promise<void> => {
    // Semesters are bound to Year lifespan. Manual deleting is restricted to soft delete of parent year.
    throw new Error('Semester terikat dengan daur hidup Tahun Ajaran dan tidak dapat dihapus secara manual.');
  },
};

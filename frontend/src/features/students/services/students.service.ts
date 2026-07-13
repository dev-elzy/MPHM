import { Student, ImportPreviewResult } from '../types';
import { StudentFormData } from '../schemas';

interface FetchStudentsParams {
  search?: string;
  status?: string;
  classId?: string;
  academicYearId?: string;
  semesterId?: string;
  page?: number;
  limit?: number;
}

class StudentsService {
  async getAll(params: FetchStudentsParams): Promise<{ items: Student[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.classId) searchParams.append('classId', params.classId);
    if (params.academicYearId) searchParams.append('academicYearId', params.academicYearId);
    if (params.semesterId) searchParams.append('semesterId', params.semesterId);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));

    const res = await fetch(`/api/v1/data-center/students?${searchParams.toString()}`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data siswi' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data siswi');
    }

    const data = (await res.json()) as { data?: { items?: Student[]; meta?: { totalItems?: number } } };
    return {
      items: data.data?.items || [],
      total: data.data?.meta?.totalItems || 0,
    };
  }

  async getById(id: string, academicYearId?: string, semesterId?: string): Promise<Student | undefined> {
    const params = new URLSearchParams();
    if (academicYearId) params.append('academicYearId', academicYearId);
    if (semesterId) params.append('semesterId', semesterId);

    const res = await fetch(`/api/v1/data-center/students/${id}?${params.toString()}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil detail siswi' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil detail siswi');
    }

    const data = (await res.json()) as { data?: Student };
    return data.data;
  }

  async create(
    data: StudentFormData,
    academicYearId?: string | null,
    semesterId?: string | null
  ): Promise<Student> {
    const res = await fetch('/api/v1/data-center/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        academicYearId,
        semesterId,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mendaftarkan siswi' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mendaftarkan siswi');
    }

    const resJson = (await res.json()) as { data: { id: string } };
    const detail = await this.getById(resJson.data.id, academicYearId || undefined, semesterId || undefined);
    if (!detail) throw new Error('Gagal memuat data siswi terbaru');
    return detail;
  }

  async update(
    id: string,
    data: StudentFormData,
    academicYearId?: string | null,
    semesterId?: string | null
  ): Promise<Student> {
    const res = await fetch(`/api/v1/data-center/students/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        academicYearId,
        semesterId,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal memperbarui profil siswi' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memperbarui profil siswi');
    }

    const detail = await this.getById(id, academicYearId || undefined, semesterId || undefined);
    if (!detail) throw new Error('Gagal memuat data siswi terbaru');
    return detail;
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/v1/data-center/students/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menghapus data siswi' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menghapus data siswi');
    }
  }

  // Bulk Import
  async importPreview(
    list: Omit<Student, 'id' | 'status'>[],
    classId?: string | null,
    academicYearId?: string | null,
    semesterId?: string | null
  ): Promise<ImportPreviewResult> {
    const res = await fetch('/api/v1/students/import?mode=preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        students: list,
        classId,
        academicYearId,
        semesterId,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menganalisis file impor' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menganalisis file impor');
    }

    const data = (await res.json()) as { data?: ImportPreviewResult };
    if (!data.data) throw new Error('Gagal mendapatkan preview impor');
    return data.data;
  }

  async importConfirm(
    list: Omit<Student, 'id' | 'status'>[],
    classId?: string | null,
    academicYearId?: string | null,
    semesterId?: string | null
  ): Promise<void> {
    const res = await fetch('/api/v1/students/import?mode=confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        students: list,
        classId,
        academicYearId,
        semesterId,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menyimpan data impor' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menyimpan data impor');
    }
  }
}

export const studentsService = new StudentsService();

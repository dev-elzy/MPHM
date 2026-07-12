import { Class, Jenjang, Tingkat } from '../types';
import { ClassFormData } from '../schemas';

// Helper to map DB status to Client status
function mapDbStatusToClient(status: string): Class['status'] {
  return status === 'active' ? 'Active' : 'Archived';
}

// Helper to map Client status to DB status
function mapClientStatusToDb(status?: Class['status']): string {
  return status === 'Active' ? 'active' : 'inactive';
}

interface ClassDbItem {
  id: string;
  academicYearId: string;
  semesterId?: string | null;
  curriculumId?: string | null;
  jenjang: string;
  tingkat: string;
  bagian: string;
  name: string;
  status: string;
  waliKelasId?: string | null;
  waliKelasName?: string | null;
  studentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

class ClassesService {
  async getByAcademicYearAndSemester(academicYearId: string, semesterId: string): Promise<Class[]> {
    const res = await fetch(
      `/api/v1/classes?academicYearId=${academicYearId}&semesterId=${semesterId}&limit=100`
    );
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data kelas rombel' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data kelas');
    }
    const data = (await res.json()) as { data?: { items?: ClassDbItem[] } };
    const items = data.data?.items || [];

    return items.map((c: ClassDbItem) => ({
      id: c.id,
      academicYearId: c.academicYearId,
      semesterId: c.semesterId || '',
      curriculumId: c.curriculumId || '',
      jenjang: c.jenjang as Jenjang, // Cast string to Jenjang type (safe as values are checked by schema)
      tingkat: c.tingkat as Tingkat, // Cast string to Tingkat type
      bagian: c.bagian,
      name: c.name,
      status: mapDbStatusToClient(c.status),
      mustahiqId: c.waliKelasId || undefined,
      waliKelasName: c.waliKelasName || undefined,
      studentCount: c.studentCount || 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  async create(data: ClassFormData): Promise<Class> {
    const res = await fetch('/api/v1/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        academicYearId: data.academicYearId,
        semesterId: data.semesterId,
        curriculumId: data.curriculumId,
        jenjang: data.jenjang,
        tingkat: data.tingkat,
        bagian: data.bagian,
        waliKelasId: data.mustahiqId || null,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal membuat kelas rombel' }))) as { message?: string };
      throw new Error(err.message || 'Gagal membuat kelas');
    }

    const resJson = (await res.json()) as { data: { id: string } };
    const newId = resJson.data.id;

    // Retrieve full detail
    const detail = await this.getById(newId);
    if (!detail) throw new Error('Gagal memuat data kelas yang baru dibuat');
    return detail;
  }

  async getById(id: string): Promise<Class | undefined> {
    const res = await fetch(`/api/v1/classes/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      const err = (await res.json().catch(() => ({ message: 'Gagal memuat detail kelas' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memuat detail kelas');
    }
    const data = (await res.json()) as { data?: ClassDbItem };
    const c = data.data;
    if (!c) return undefined;

    return {
      id: c.id,
      academicYearId: c.academicYearId,
      semesterId: c.semesterId || '',
      curriculumId: c.curriculumId || '',
      jenjang: c.jenjang as Jenjang,
      tingkat: c.tingkat as Tingkat,
      bagian: c.bagian,
      name: c.name,
      status: mapDbStatusToClient(c.status),
      mustahiqId: c.waliKelasId || undefined,
      waliKelasName: c.waliKelasName || undefined,
      studentCount: c.studentCount || 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  async update(id: string, data: ClassFormData): Promise<Class> {
    const res = await fetch(`/api/v1/classes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        curriculumId: data.curriculumId || null,
        jenjang: data.jenjang,
        tingkat: data.tingkat,
        bagian: data.bagian,
        status: mapClientStatusToDb(data.status),
        waliKelasId: data.mustahiqId || null,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal memperbarui kelas rombel' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memperbarui kelas');
    }

    const detail = await this.getById(id);
    if (!detail) throw new Error('Gagal memuat data kelas');
    return detail;
  }

  async importConfirm(payload: {
    academicYearId: string;
    semesterId?: string;
    curriculumId?: string;
    items: { name: string; jenjang: string; tingkat: string; description?: string | null }[];
  }): Promise<void> {
    const res = await fetch('/api/v1/classes/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengimpor kelas rombel' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengimpor kelas');
    }
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/v1/classes/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menghapus kelas rombel' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menghapus kelas');
    }
  }

  async assignMustahiq(classId: string, mustahiqId: string): Promise<Class> {
    const res = await fetch(`/api/v1/classes/${classId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        waliKelasId: mustahiqId,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menugaskan wali kelas' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menugaskan wali kelas');
    }

    const detail = await this.getById(classId);
    if (!detail) throw new Error('Gagal memuat data kelas');
    return detail;
  }
}

export const classesService = new ClassesService();

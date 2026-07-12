import { AcademicYear, AcademicYearStatus } from '../types';
import { AcademicYearFormData } from '../schemas';

// Helper to map DB record status to client status
function mapDbStatusToClient(status: string): AcademicYearStatus {
  switch (status) {
    case 'active':
      return 'Active';
    case 'archived':
      return 'Archived';
    default:
      return 'Draft';
  }
}

// Helper to map client status to DB status
function mapClientStatusToDb(status: AcademicYearStatus): string {
  switch (status) {
    case 'Active':
      return 'active';
    case 'Archived':
      return 'archived';
    default:
      return 'draft';
  }
}

interface SemesterDbItem {
  id: string;
  academicYearId: string;
  name: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

interface AcademicYearDbItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  status: string;
  semesters?: SemesterDbItem[];
  createdAt: string;
  updatedAt: string;
}

export const academicYearsService = {
  getAll: async (): Promise<AcademicYear[]> => {
    const res = await fetch('/api/v1/academic-years?limit=100');
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data tahun ajaran');
    }
    const data = (await res.json()) as { data?: { items?: AcademicYearDbItem[] } };
    const items = data.data?.items || [];

    return items.map((item: AcademicYearDbItem) => ({
      id: item.id,
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description || undefined,
      status: mapDbStatusToClient(item.status),
      semesters: (item.semesters || []).map((s: SemesterDbItem) => ({
        id: s.id,
        academicYearId: s.academicYearId,
        name: s.name,
        status: s.isActive ? 'Active' : 'Completed',
        startDate: s.startDate || '',
        endDate: s.endDate || '',
      })),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  },

  getById: async (id: string): Promise<AcademicYear | undefined> => {
    const res = await fetch(`/api/v1/academic-years/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data tahun ajaran');
    }
    const data = (await res.json()) as { data?: AcademicYearDbItem };
    const item = data.data;
    if (!item) return undefined;

    // Fetch semesters for this year specifically
    const semRes = await fetch(`/api/v1/semesters?academicYearId=${id}`);
    const semData = (await semRes.json()) as { data?: SemesterDbItem[] };
    const dbSemesters = semData.data || [];

    return {
      id: item.id,
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description || undefined,
      status: mapDbStatusToClient(item.status),
      semesters: dbSemesters.map((s: SemesterDbItem) => ({
        id: s.id,
        academicYearId: s.academicYearId,
        name: s.name,
        status: s.isActive ? 'Active' : 'Completed',
        startDate: s.startDate || '',
        endDate: s.endDate || '',
      })),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  },

  create: async (data: AcademicYearFormData): Promise<AcademicYear> => {
    const res = await fetch('/api/v1/academic-years', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal membuat tahun ajaran' }))) as { message?: string };
      throw new Error(err.message || 'Gagal membuat tahun ajaran');
    }

    const resJson = (await res.json()) as { data: { id: string } };
    const newYearId = resJson.data.id;

    // If the selected status is Active, trigger activation workflow
    if (data.status === 'Active') {
      const workflowRes = await fetch(`/api/v1/academic-years/${newYearId}/workflow`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      if (!workflowRes.ok) {
        const err = (await workflowRes.json().catch(() => ({ message: 'Gagal mengaktifkan tahun ajaran baru' }))) as { message?: string };
        throw new Error(err.message || 'Tahun ajaran berhasil dibuat tetapi gagal diaktifkan');
      }
    }

    const finalRecord = await academicYearsService.getById(newYearId);
    if (!finalRecord) throw new Error('Gagal memuat tahun ajaran yang baru dibuat');
    return finalRecord;
  },

  update: async (id: string, data: AcademicYearFormData): Promise<AcademicYear> => {
    const res = await fetch(`/api/v1/academic-years/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal memperbarui tahun ajaran' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memperbarui tahun ajaran');
    }

    // Trigger workflow change if target status differs
    const currentRecord = await academicYearsService.getById(id);
    if (currentRecord && currentRecord.status !== data.status) {
      const workflowRes = await fetch(`/api/v1/academic-years/${id}/workflow`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: mapClientStatusToDb(data.status) }),
      });
      if (!workflowRes.ok) {
        const err = (await workflowRes.json().catch(() => ({ message: 'Gagal merubah status tahun ajaran' }))) as { message?: string };
        throw new Error(err.message || 'Perubahan data sukses tetapi gagal memperbarui status');
      }
    }

    const finalRecord = await academicYearsService.getById(id);
    if (!finalRecord) throw new Error('Gagal memuat data tahun ajaran');
    return finalRecord;
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`/api/v1/academic-years/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menghapus tahun ajaran' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menghapus tahun ajaran');
    }
  },

  // Added cloning endpoint triggers
  clone: async (sourceId: string, targetYearId: string): Promise<void> => {
    const res = await fetch(`/api/v1/academic-years/${sourceId}/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetYearId }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengkloning tahun ajaran' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengkloning struktur akademik');
    }
  },
};

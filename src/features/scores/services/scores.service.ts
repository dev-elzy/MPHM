import {
  ScoreSession,
  Score,
  ScoreEntryRow,
  AttendanceRecord,
  AttendanceSummary,
  AkhlaqRecord,
  Report,
} from '../types';

interface ScoreSessionParams {
  academicYearId?: string;
  semesterId?: string;
  classId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

class ScoresService {
  // ─── Score Sessions ─────────────────────────────────────────────────────────

  async getSessions(
    params: ScoreSessionParams
  ): Promise<{ items: ScoreSession[]; total: number }> {
    const sp = new URLSearchParams();
    if (params.academicYearId) sp.append('academicYearId', params.academicYearId);
    if (params.semesterId) sp.append('semesterId', params.semesterId);
    if (params.classId) sp.append('classId', params.classId);
    if (params.status) sp.append('status', params.status);
    if (params.page) sp.append('page', String(params.page));
    if (params.limit) sp.append('limit', String(params.limit));

    const res = await fetch(`/api/v1/score-sessions?${sp.toString()}`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil sesi nilai' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil sesi nilai');
    }
    const data = (await res.json()) as { data?: { items?: ScoreSession[]; meta?: { totalItems?: number } } };
    return { items: data.data?.items || [], total: data.data?.meta?.totalItems || 0 };
  }

  async getSessionById(id: string): Promise<ScoreSession | undefined> {
    const res = await fetch(`/api/v1/score-sessions/${id}`);
    if (!res.ok) return undefined;
    const data = (await res.json()) as { data?: ScoreSession };
    return data.data;
  }

  async createSession(payload: {
    academicYearId: string;
    semesterId: string;
    classId: string;
    curriculumSubjectId: string;
  }): Promise<ScoreSession> {
    const res = await fetch('/api/v1/score-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal membuat sesi nilai' }))) as { message?: string };
      throw new Error(err.message || 'Gagal membuat sesi nilai');
    }
    const data = (await res.json()) as { data: ScoreSession };
    return data.data;
  }

  async finalizeSession(id: string): Promise<void> {
    const res = await fetch(`/api/v1/score-sessions/${id}/finalize`, { method: 'POST' });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal memfinalisasi nilai' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memfinalisasi nilai');
    }
  }

  // ─── Score Entry Rows ────────────────────────────────────────────────────────

  async getScoreEntries(sessionId: string): Promise<ScoreEntryRow[]> {
    const res = await fetch(`/api/v1/score-sessions/${sessionId}/entries`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data nilai' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data nilai');
    }
    const data = (await res.json()) as { data?: ScoreEntryRow[] };
    return data.data || [];
  }

  async saveScore(payload: {
    scoreSessionId: string;
    studentId: string;
    scoreType: 'tamrin' | 'ujian';
    score: number | null;
    notes?: string;
  }): Promise<Score> {
    const res = await fetch('/api/v1/scores', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menyimpan nilai' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menyimpan nilai');
    }
    const data = (await res.json()) as { data: Score };
    return data.data;
  }

  // ─── Attendance ──────────────────────────────────────────────────────────────

  async getAttendance(params: {
    academicYearId: string;
    semesterId: string;
    classId: string;
    hijriMonth?: number | null;
    hijriYear?: number | null;
  }): Promise<AttendanceRecord[]> {
    const qp: Record<string, string> = {
      academicYearId: params.academicYearId,
      semesterId: params.semesterId,
      classId: params.classId,
    };
    if (params.hijriMonth !== undefined && params.hijriMonth !== null) {
      qp.hijriMonth = params.hijriMonth.toString();
    }
    if (params.hijriYear !== undefined && params.hijriYear !== null) {
      qp.hijriYear = params.hijriYear.toString();
    }
    const sp = new URLSearchParams(qp);
    const res = await fetch(`/api/v1/attendance?${sp.toString()}`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data absensi' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data absensi');
    }
    const data = (await res.json()) as { data?: AttendanceRecord[] };
    return data.data || [];
  }

  async getAttendanceSummary(params: {
    academicYearId: string;
    semesterId: string;
    classId: string;
  }): Promise<AttendanceSummary[]> {
    const sp = new URLSearchParams({ ...params, summary: 'true' });
    const res = await fetch(`/api/v1/attendance?${sp.toString()}`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil rekap absensi' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil rekap absensi');
    }
    const data = (await res.json()) as { data?: AttendanceSummary[] };
    return data.data || [];
  }

  async saveBulkAttendance(payload: {
    academicYearId: string;
    semesterId: string;
    classId: string;
    hijriMonth: number;
    hijriYear: number;
    records: { studentId: string; sickCount: number; permissionCount: number; absentCount: number; notes?: string | null }[];
  }): Promise<void> {
    const res = await fetch('/api/v1/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menyimpan absensi' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menyimpan absensi');
    }
  }

  // ─── Akhlaq ─────────────────────────────────────────────────────────────────

  async getAkhlaq(params: {
    academicYearId: string;
    semesterId: string;
    classId: string;
  }): Promise<AkhlaqRecord[]> {
    const sp = new URLSearchParams(params as Record<string, string>);
    const res = await fetch(`/api/v1/akhlaq?${sp.toString()}`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data akhlaq' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data akhlaq');
    }
    const data = (await res.json()) as { data?: AkhlaqRecord[] };
    return data.data || [];
  }

  async saveBulkAkhlaq(payload: {
    academicYearId: string;
    semesterId: string;
    classId: string;
    records: {
      studentId: string;
      category: string;
      grade: string;
      description?: string;
      notes?: string;
    }[];
  }): Promise<void> {
    const res = await fetch('/api/v1/akhlaq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menyimpan penilaian akhlaq' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menyimpan penilaian akhlaq');
    }
  }

  // ─── Reports ─────────────────────────────────────────────────────────────────

  async getReports(params: {
    academicYearId: string;
    semesterId: string;
    classId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Report[]; total: number }> {
    const sp = new URLSearchParams();
    if (params.academicYearId) sp.append('academicYearId', params.academicYearId);
    if (params.semesterId) sp.append('semesterId', params.semesterId);
    if (params.classId) sp.append('classId', params.classId);
    if (params.status) sp.append('status', params.status);
    if (params.page) sp.append('page', String(params.page));
    if (params.limit) sp.append('limit', String(params.limit));

    const res = await fetch(`/api/v1/reports?${sp.toString()}`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil data raport' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil data raport');
    }
    const data = (await res.json()) as { data?: { items?: Report[]; meta?: { totalItems?: number } } };
    return { items: data.data?.items || [], total: data.data?.meta?.totalItems || 0 };
  }

  async generateReports(payload: {
    academicYearId: string;
    semesterId: string;
    classId: string;
  }): Promise<void> {
    const res = await fetch('/api/v1/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal generate raport' }))) as { message?: string };
      throw new Error(err.message || 'Gagal generate raport');
    }
  }

  async finalizeReports(payload: {
    academicYearId: string;
    semesterId: string;
    classId: string;
  }): Promise<void> {
    const res = await fetch('/api/v1/reports/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal memfinalisasi raport' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memfinalisasi raport');
    }
  }
}

export const scoresService = new ScoresService();

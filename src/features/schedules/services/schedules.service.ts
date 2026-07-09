import { Schedule } from '../types';
import { ScheduleFormValues } from '../schemas';

export class SchedulesService {
  static async getSchedules(params: {
    academicYearId?: string;
    semesterId?: string;
    targetType?: string;
    jenjang?: string;
    tingkat?: string;
    classId?: string;
  }): Promise<Schedule[]> {
    const sp = new URLSearchParams();
    if (params.academicYearId) sp.append('academicYearId', params.academicYearId);
    if (params.semesterId) sp.append('semesterId', params.semesterId);
    if (params.targetType) sp.append('targetType', params.targetType);
    if (params.jenjang) sp.append('jenjang', params.jenjang);
    if (params.tingkat) sp.append('tingkat', params.tingkat);
    if (params.classId) sp.append('classId', params.classId);

    const res = await fetch(`/api/v1/schedules?${sp.toString()}`);
    if (!res.ok) throw new Error('Gagal mengambil data jadwal');
    const json = (await res.json()) as { data?: { items?: Schedule[] } };
    return json.data?.items || [];
  }

  static async createSchedule(data: ScheduleFormValues): Promise<Schedule> {
    const res = await fetch('/api/v1/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Gagal membuat jadwal');
    const json = (await res.json()) as { data: Schedule };
    return json.data;
  }

  static async updateSchedule(id: string, data: Partial<ScheduleFormValues>): Promise<Schedule> {
    const res = await fetch(`/api/v1/schedules?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Gagal memperbarui jadwal');
    const json = (await res.json()) as { data: Schedule };
    return json.data;
  }

  static async deleteSchedule(id: string): Promise<void> {
    const res = await fetch(`/api/v1/schedules?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Gagal menghapus jadwal');
  }
}

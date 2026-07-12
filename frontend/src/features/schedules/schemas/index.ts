import { z } from 'zod';

export const scheduleSchema = z.object({
  academicYearId: z.string().min(1, 'Tahun Ajaran wajib dipilih'),
  semesterId: z.string().min(1, 'Semester wajib dipilih'),
  targetType: z.enum(['jenjang', 'tingkat', 'class']),
  jenjang: z.string().optional(),
  tingkat: z.string().optional(),
  classId: z.string().optional(),
  day: z.enum(['sabtu', 'ahad', 'senin', 'selasa', 'rabu', 'kamis', 'jumat']),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format waktu tidak valid (HH:MM)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format waktu tidak valid (HH:MM)'),
  activity: z.string().min(1, 'Kegiatan wajib diisi'),
  subjectId: z.string().optional().nullable(),
  teacherId: z.string().optional().nullable(),
  room: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isOverride: z.boolean().default(false),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;

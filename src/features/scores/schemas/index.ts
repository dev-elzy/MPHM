import { z } from 'zod';

export const scoreEntrySchema = z.object({
  studentId: z.string().uuid(),
  tamrinScore: z.coerce.number().min(0).max(100).nullable().optional(),
  ujianScore: z.coerce.number().min(0).max(100).nullable().optional(),
  notes: z.string().optional(),
});

export const bulkScoreSchema = z.object({
  scores: z.array(scoreEntrySchema),
});

export const attendanceSchema = z.object({
  date: z.string().min(1, 'Tanggal wajib diisi'),
  studentId: z.string().uuid(),
  status: z.enum(['present', 'absent', 'sick', 'permission', 'late']),
  notes: z.string().optional(),
});

export const bulkAttendanceSchema = z.object({
  date: z.string().min(1, 'Tanggal wajib diisi'),
  records: z.array(z.object({
    studentId: z.string().uuid(),
    status: z.enum(['present', 'absent', 'sick', 'permission', 'late']),
    notes: z.string().optional(),
  })),
});

export const akhlaqSchema = z.object({
  studentId: z.string().uuid(),
  category: z.string().min(1, 'Kategori wajib diisi'),
  grade: z.enum(['A', 'B', 'C', 'D']),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export type ScoreEntryFormData = z.infer<typeof scoreEntrySchema>;
export type BulkScoreFormData = z.infer<typeof bulkScoreSchema>;
export type AttendanceFormData = z.infer<typeof attendanceSchema>;
export type BulkAttendanceFormData = z.infer<typeof bulkAttendanceSchema>;
export type AkhlaqFormData = z.infer<typeof akhlaqSchema>;

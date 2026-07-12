import { z } from 'zod';

export const curriculumFormSchema = z.object({
  name: z.string().min(3, 'Nama kurikulum minimal 3 karakter (misal: Kurikulum Merdeka 2026)'),
  academicYearId: z.string().uuid('Tahun ajaran wajib dipilih'),
  description: z.string().optional(),
});

export type CurriculumFormData = z.infer<typeof curriculumFormSchema>;

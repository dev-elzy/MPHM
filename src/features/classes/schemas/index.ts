import { z } from 'zod';

export const classSchema = z.object({
  id: z.string().optional(),
  academicYearId: z.string().min(1, 'Tahun Ajaran wajib dipilih'),
  semesterId: z.string().min(1, 'Semester wajib dipilih'),
  curriculumId: z.string().min(1, 'Kurikulum wajib dipilih'),
  
  jenjang: z.enum(['I\'dadiyyah', 'Ibtida\'iyyah', 'Tsanawiyyah', 'Aliyyah'], {
    message: 'Jenjang wajib dipilih',
  }),
  tingkat: z.enum(['I', 'II', 'III', 'IV', 'V', 'VI'], {
    message: 'Tingkat wajib dipilih',
  }),
  bagian: z.string().min(1, 'Bagian wajib diisi').max(20, 'Bagian terlalu panjang'),
  
  status: z.enum(['Active', 'Archived']).default('Active'),

  // Optional because it's handled via assignments, but can be set during creation
  mustahiqId: z.string().optional(),
});

export type ClassFormData = z.infer<typeof classSchema>;

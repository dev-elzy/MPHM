import { z } from 'zod';

export const semesterSchema = z.object({
  id: z.string().optional(),
  academicYearId: z.string().min(1, 'Tahun Ajaran wajib dipilih'),
  name: z.string().min(1, 'Nama semester wajib diisi'),
  status: z.enum(['Draft', 'Active', 'Completed']).default('Draft'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
});

// We can refine in the component by passing the parent academic year bounds, 
// but for standard zod schema:
export const semesterFormSchema = semesterSchema.refine(
  (data) => {
    return new Date(data.startDate) <= new Date(data.endDate);
  },
  {
    message: 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
    path: ['endDate'],
  }
);

export const academicYearSchema = z.object({
  id: z.string().optional(),
  name: z.string().regex(/^\d{4}\/\d{4}$/, 'Format harus YYYY/YYYY (contoh: 2024/2025)'),
  status: z.enum(['Draft', 'Active', 'Archived']).default('Draft'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  description: z.string().optional(),
  // Semesters might not be heavily nested anymore since we manage them separately, 
  // but we'll keep it for backward compatibility or overview endpoints.
  semesters: z.array(semesterSchema).default([]),
}).refine(
  (data) => {
    return new Date(data.startDate) <= new Date(data.endDate);
  },
  {
    message: 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
    path: ['endDate'],
  }
);

export type AcademicYearFormData = z.infer<typeof academicYearSchema>;
export type SemesterFormData = z.infer<typeof semesterFormSchema>;

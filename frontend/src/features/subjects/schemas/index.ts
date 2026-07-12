import { z } from 'zod';

export const subjectFormSchema = z.object({
  name: z.string().min(2, 'Nama mata pelajaran wajib diisi'),
  arabicName: z.string().optional(),
  code: z.string().min(2, 'Kode mata pelajaran wajib diisi'),
  description: z.string().optional(),
  category: z.string().min(2, 'Kategori mata pelajaran wajib dipilih'), // KMI, Kepesantrenan, dll
});

export type SubjectFormData = z.infer<typeof subjectFormSchema>;

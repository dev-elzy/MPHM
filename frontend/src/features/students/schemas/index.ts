import { z } from 'zod';

export const studentSchema = z.object({
  nis: z.string().optional(),
  nisn: z.string().optional(),
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  birthDate: z.string().optional(),
  birthPlace: z.string().optional(),
  gender: z.enum(['male', 'female']).default('female'),
  address: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  phone: z.string().optional(),
  entryYear: z.string().optional(),
  entryJenjang: z.string().optional(),
  status: z.string().default('active'),
  notes: z.string().optional(),
  // Class binding fields
  classId: z.string().optional().or(z.literal('')),
});

export type StudentFormData = z.infer<typeof studentSchema>;

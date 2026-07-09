import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
  role: z.enum(['super_admin', 'admin', 'operator', 'mustahiq', 'mudir']),
  status: z.enum(['active', 'inactive']).catch('active' as const),
  phone: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

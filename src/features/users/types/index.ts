export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'operator' | 'mustahiq' | 'mudir' | 'mufatish' | 'security';
  status: 'active' | 'inactive';
  phone?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

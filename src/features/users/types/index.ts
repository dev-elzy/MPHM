export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'operator' | 'mustahiq' | 'mudir';
  status: 'active' | 'inactive';
  phone?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

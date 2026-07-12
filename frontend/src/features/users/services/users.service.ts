import { User } from '../types';
import { UserFormData } from '../schemas';

class UsersService {
  async getAll(search?: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const res = await fetch(`/api/v1/users?${params.toString()}`);
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil daftar pengguna' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil daftar pengguna');
    }

    const data = (await res.json()) as { data?: User[] };
    return data.data || [];
  }

  async getById(id: string): Promise<User | undefined> {
    const res = await fetch(`/api/v1/users/${id}`);
    if (!res.ok) {
      if (res.status === 404) return undefined;
      const err = (await res.json().catch(() => ({ message: 'Gagal mengambil detail pengguna' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengambil detail pengguna');
    }

    const data = (await res.json()) as { data?: User };
    return data.data;
  }

  async create(data: UserFormData): Promise<User> {
    const res = await fetch('/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal membuat pengguna baru' }))) as { message?: string };
      throw new Error(err.message || 'Gagal membuat pengguna baru');
    }

    const resJson = (await res.json()) as { data: { id: string } };
    const detail = await this.getById(resJson.data.id);
    if (!detail) throw new Error('Gagal memuat data pengguna terbaru');
    return detail;
  }

  async update(id: string, data: UserFormData): Promise<User> {
    // If password field is empty string, we omit it from payload so password is not updated
    const payload = { ...data };
    if (!payload.password) {
      delete payload.password;
    }

    const res = await fetch(`/api/v1/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal memperbarui pengguna' }))) as { message?: string };
      throw new Error(err.message || 'Gagal memperbarui pengguna');
    }

    const detail = await this.getById(id);
    if (!detail) throw new Error('Gagal memuat data pengguna terbaru');
    return detail;
  }

  async importConfirm(items: Omit<User, 'id' | 'status' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    const res = await fetch('/api/v1/users/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal mengimpor pengguna' }))) as { message?: string };
      throw new Error(err.message || 'Gagal mengimpor pengguna');
    }
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/v1/users/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({ message: 'Gagal menghapus pengguna' }))) as { message?: string };
      throw new Error(err.message || 'Gagal menghapus pengguna');
    }
  }
}

export const usersService = new UsersService();

import { LoginFormData } from '../schemas/login.schema';
import { LoginResponse } from '../types';

export async function loginAction(data: LoginFormData): Promise<LoginResponse> {
  try {
    const { email, password } = data;

    // Panggil melalui Edge Proxy kita yang akan meroute ke backend secara otomatis.
    // Karena dipanggil dari client, browser akan otomatis memproses header `Set-Cookie`.
    const res = await fetch(`/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errJson = (await res.json().catch(() => ({}))) as any;
      return { success: false, message: errJson.message || 'Email atau password salah' };
    }

    const json = (await res.json()) as any;
    
    return {
      success: true,
      user: json.data,
    };
  } catch (error) {
    console.error('Client login error:', error);
    return {
      success: false,
      message: 'Koneksi ke server gagal',
    };
  }
}

export async function logoutAction() {
  try {
    await fetch(`/api/v1/auth/logout`, { 
      method: 'POST' 
    }).catch(console.error);
    
    // Opsional: kita bisa memaksa menghapus cookie dari sisi client jika memungkinkan,
    // namun endpoint logout di backend seharusnya sudah mengirim 'Set-Cookie: ... Max-Age=0'
  } catch (error) {
    console.error('Client logout error:', error);
  }
}

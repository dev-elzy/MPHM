'use server';

import { cookies } from 'next/headers';
import { LoginFormData } from '../schemas/login.schema';
import { LoginResponse } from '../types';

export async function loginAction(data: LoginFormData): Promise<LoginResponse> {
  try {
    const { email, password } = data;

    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.m.p3hm.my.id' 
      : 'http://localhost:8787';

    const res = await fetch(`${backendUrl}/api/v1/auth/login`, {
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
    
    // Extract token from Hono's set-cookie header and set it in Next.js cookie store
    const cookieHeader = res.headers.get('set-cookie');
    if (cookieHeader) {
      const cookieStore = await cookies();
      const match = cookieHeader.match(/mphm_session=([^;]+)/);
      if (match) {
        cookieStore.set({
          name: 'mphm_session',
          value: match[1],
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? '.m.p3hm.my.id' : undefined,
          maxAge: 7 * 24 * 60 * 60,
        });
      }
    }

    return {
      success: true,
      user: json.data,
    };
  } catch (error) {
    console.error('Server action login error:', error);
    return {
      success: false,
      message: 'Koneksi ke server gagal',
    };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('mphm_session');

    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.m.p3hm.my.id' 
      : 'http://localhost:8787';

    await fetch(`${backendUrl}/api/v1/auth/logout`, { 
      method: 'POST' 
    }).catch(console.error);
  } catch (error) {
    console.error('Server action logout error:', error);
  }
}


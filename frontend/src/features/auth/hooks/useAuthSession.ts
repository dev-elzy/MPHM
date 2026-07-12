import { useQuery } from '@tanstack/react-query';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'operator' | 'mustahiq' | 'mudir' | string;
  roleId: string | null;
  institutionId: string;
  avatarUrl?: string;
}

export function useAuthSession() {
  const query = useQuery<AuthUser>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await fetch('/api/v1/auth/me');
      if (!res.ok) {
        throw new Error('Sesi tidak ditemukan');
      }
      const json = (await res.json()) as { data: AuthUser };
      return json.data;
    },
    staleTime: 0, // Resolve instantly on role change/login
    retry: false,
  });

  const user = query.data;
  const role = user?.role?.toLowerCase() || '';

  const isSekretariat = role === 'sekretariat' || role === 'super_admin' || role === 'admin' || role === 'operator';
  const isMustahiq = role === 'mustahiq' || role === 'teacher' || role === 'ustadz';
  const isMufattisy = role === 'mufattisy' || role === 'mufatish' || role === 'pengawas';
  const isPimpinan = role === 'pimpinan' || role === 'mundzir' || role === 'mudir';
  const isKeamanan = role === 'petugas_keamanan' || role === 'security' || role === 'keamanan';
  const isWali = role === 'wali_santri' || role === 'guardian' || role === 'parent' || role === 'wali';

  // Backward compatibility with legacy role checks
  const isAdmin = isSekretariat;
  const isMudir = isPimpinan;
  const isMufatish = isMufattisy;
  const isGuardian = isWali;

  return {
    ...query,
    user,
    role,
    isSekretariat,
    isMustahiq,
    isMufattisy,
    isPimpinan,
    isKeamanan,
    isWali,
    isAdmin,
    isMudir,
    isMufatish,
    isGuardian,
  };
}

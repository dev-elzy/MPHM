import { useQuery } from '@tanstack/react-query';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'operator' | 'mustahiq' | 'mudir' | string;
  roleId: string | null;
  institutionId: string;
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

  const isAdmin = role === 'super_admin' || role === 'admin' || role === 'operator';
  const isMustahiq = role === 'mustahiq' || role === 'teacher' || role === 'ustadz';
  const isMudir = role === 'mudir';
  const isMufatish = role === 'mufatish' || role === 'pengawas';

  return {
    ...query,
    user,
    role,
    isAdmin,
    isMustahiq,
    isMudir,
    isMufatish,
  };
}

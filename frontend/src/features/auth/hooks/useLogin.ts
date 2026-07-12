import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginAction } from '../services/auth.service';
import { LoginFormData } from '../schemas/login.schema';
import { LoginResponse } from '../types';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: async (data: LoginFormData) => {
      const result = await loginAction(data);
      if (!result.success) {
        throw new Error(result.message || 'Login gagal');
      }
      return result;
    },
    onSuccess: () => {
      // Clear any stale auth cache before navigating
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      router.push('/dashboard');
    },
  });
};


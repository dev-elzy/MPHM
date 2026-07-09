import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import { User } from '../types';

export function useUsers(search?: string) {
  return useQuery<User[], Error>({
    queryKey: ['users', search],
    queryFn: () => usersService.getAll(search),
  });
}

export function useUserDetail(id: string) {
  return useQuery<User | undefined, Error>({
    queryKey: ['user-detail', id],
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  });
}

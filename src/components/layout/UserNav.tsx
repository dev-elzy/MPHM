'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logoutAction } from '@/features/auth/services/auth.service';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export function UserNav() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { user } = useAuthSession();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      router.push('/login');
    });
  };

  const name = user?.name || 'Admin MPHM';
  const email = user?.email || 'admin@mphm.id';
  const avatarUrl = (user as any)?.avatarUrl || '';
  const initials = name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "relative h-9 w-9 rounded-full px-0")}>
        <Avatar className="h-9 w-9">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/pengaturan?tab=profil')} className="cursor-pointer">
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/pengaturan?tab=pengaturan')} className="cursor-pointer">
            Pengaturan
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isPending} className="text-destructive focus:text-destructive cursor-pointer">
          {isPending ? 'Keluar...' : 'Keluar'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

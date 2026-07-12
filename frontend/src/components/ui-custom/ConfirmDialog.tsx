'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ConfirmVariant = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  onConfirm: () => void;
}

const VARIANT_CONFIG: Record<
  ConfirmVariant,
  { icon: React.ElementType; iconBg: string; iconColor: string; btnClass: string }
> = {
  danger: {
    icon: AlertTriangle,
    iconBg: 'bg-red-50 dark:bg-red-950/30',
    iconColor: 'text-red-500',
    btnClass: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-50 dark:bg-amber-950/30',
    iconColor: 'text-amber-500',
    btnClass: 'bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-50 dark:bg-blue-950/30',
    iconColor: 'text-blue-500',
    btnClass: 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200',
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'danger',
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const { icon: Icon, iconBg, iconColor, btnClass } = VARIANT_CONFIG[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                iconBg
              )}
            >
              <Icon className={cn('h-5 w-5', iconColor)} />
            </div>
            <div className="flex flex-col gap-1 pt-0.5">
              <DialogTitle className="text-base font-semibold leading-none">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-lg"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn('rounded-lg shadow-sm transition-all', btnClass)}
          >
            {isLoading ? 'Memproses...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

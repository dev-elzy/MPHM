'use client';

import * as React from 'react';
import { useSemesters } from '../queries/useSemesters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SemesterSelectorProps {
  academicYearId: string;
  value: string;
  onChange: (value: string) => void;
}

export function SemesterSelector({ academicYearId, value, onChange }: SemesterSelectorProps) {
  const { data: semesters, isLoading } = useSemesters(academicYearId);

  // Auto-select active semester if none is selected
  React.useEffect(() => {
    if (semesters && semesters.length > 0 && !value) {
      const active = semesters.find(s => s.status.toLowerCase() === 'active');
      if (active) {
        onChange(active.id);
      } else {
        onChange(semesters[0].id);
      }
    }
  }, [semesters, value, onChange]);

  if (!academicYearId) return null;

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <span className="text-sm text-zinc-300 font-medium hidden sm:inline-block shrink-0">Semester:</span>
      <Select value={value} onValueChange={(val) => onChange(val || '')} disabled={isLoading || !semesters?.length}>
        <SelectTrigger className="w-full sm:w-[170px] max-w-full h-10 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 shadow-sm focus:ring-primary/40 transition-all font-medium cursor-pointer">
          <SelectValue placeholder={isLoading ? 'Memuat...' : 'Pilih Semester'} />
        </SelectTrigger>
        <SelectContent>
          {semesters?.map(s => (
            <SelectItem key={s.id} value={s.id}>
              {s.name} {s.status === 'Active' ? '(Aktif)' : ''}
            </SelectItem>
          ))}
          {semesters?.length === 0 && (
            <div className="px-2 py-2 text-sm text-zinc-500 text-center">Belum ada semester</div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

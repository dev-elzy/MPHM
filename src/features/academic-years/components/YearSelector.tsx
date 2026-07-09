import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicYears } from '../queries/useAcademicYears';

interface YearSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

export function YearSelector({ value, onChange }: YearSelectorProps) {
  const { data: years, isLoading } = useAcademicYears();

  React.useEffect(() => {
    if (!value && years && years.length > 0) {
      // Auto-select the active year, or the first one if none is active
      const activeYear = years.find((y) => y.status.toLowerCase() === 'active');
      onChange(activeYear ? activeYear.id : years[0].id);
    }
  }, [value, years, onChange]);

  if (isLoading) {
    return (
      <div className="h-10 w-[240px] animate-pulse rounded-[10px] bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  if (!years || years.length === 0) {
    return null; // The parent page will handle empty state
  }

  return (
    <Select value={value} onValueChange={(val) => { if (val) onChange(val); }}>
      <SelectTrigger className="w-[240px] h-10 rounded-[10px] bg-white dark:bg-zinc-950 shadow-sm border-zinc-200 dark:border-zinc-800 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all">
        <SelectValue placeholder="Pilih Tahun Ajaran" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl">
        {years.map((year) => (
          <SelectItem key={year.id} value={year.id} className="rounded-lg cursor-pointer">
            {year.name} {year.status === 'Active' ? '(Aktif)' : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

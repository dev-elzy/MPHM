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
      <SelectTrigger className="w-[230px] h-10 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 shadow-sm focus:ring-primary/40 transition-all font-medium cursor-pointer">
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

'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchBox({
  value,
  onChange,
  placeholder = 'Cari...',
  className = '',
  debounceMs = 300,
}: SearchBoxProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const [prevValue, setPrevValue] = React.useState(value);

  // Sync internal state with external value changes
  if (value !== prevValue) {
    setLocalValue(value);
    setPrevValue(value);
  }

  // Debounce the change handler
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value, debounceMs]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={`relative flex items-center max-w-md w-full group ${className}`}>
      <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-10 pr-9 h-9.5 w-full bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 focus-visible:bg-white dark:focus-visible:bg-zinc-950 focus-visible:ring-1 focus-visible:ring-primary rounded-full transition-all text-sm shadow-sm placeholder:text-zinc-400"
      />
      {localValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-2 h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-full cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

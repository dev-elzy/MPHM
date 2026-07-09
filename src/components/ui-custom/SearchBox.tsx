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
    <div className={`relative flex items-center max-w-sm w-full ${className}`}>
      <Search className="absolute left-3 h-4 w-4 text-zinc-400 pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-9 pr-8 h-9 w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-700"
      />
      {localValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1.5 h-6 w-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-md"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

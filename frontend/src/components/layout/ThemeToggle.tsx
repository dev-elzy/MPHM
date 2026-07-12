'use client';

import * as React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting until mounted on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9.5 w-9.5 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9.5 w-9.5 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 group cursor-pointer active:scale-90"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500 group-hover:animate-pulse" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-sky-400 group-hover:animate-pulse" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

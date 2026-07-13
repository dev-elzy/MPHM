import * as React from 'react';
import { Users, BookOpen, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Class } from '@/features/classes/types';

interface ClassGridProps {
  data: Class[];
  onEdit: (item: Class) => void;
  onDelete: (item: Class) => void;
  onViewDetails: (item: Class) => void;
}

export function ClassGrid({ data, onEdit, onDelete, onViewDetails }: ClassGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {data.map((cls) => (
        <Card 
          key={cls.id} 
          className="group relative overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
          onClick={() => onViewDetails(cls)}
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-start border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div>
              <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-100">{cls.name}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                  {cls.jenjang}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Tingkat {cls.tingkat}
                </span>
              </div>
            </div>
            
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(cls)}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(cls)} className="text-red-600 focus:text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Body */}
          <div className="p-4 flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Wali Kelas / Mustahiq</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {cls.waliKelasName || <span className="italic text-zinc-400">Belum Ditugaskan</span>}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm mt-1">
              <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Total Siswi</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {(cls as any).totalStudents || 0} Siswi
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

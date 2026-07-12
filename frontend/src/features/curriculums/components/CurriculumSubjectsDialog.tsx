'use client';

import * as React from 'react';
import { useSubjects } from '@/features/subjects/queries/useSubjects';
import { useCurriculumSubjects } from '../queries/useCurriculums';
import { useUpdateCurriculumSubjects } from '../mutations';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Search, HelpCircle, Loader2 } from 'lucide-react';

interface CurriculumSubjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curriculumId: string;
  curriculumName: string;
}

interface SubjectSetting {
  subjectId: string;
  checked: boolean;
  sortOrder: number;
  maxScore: number;
  minScore: number;
  weight: number;
}

export function CurriculumSubjectsDialog({
  open,
  onOpenChange,
  curriculumId,
  curriculumName,
}: CurriculumSubjectsDialogProps) {
  const [search, setSearch] = React.useState('');
  const [settings, setSettings] = React.useState<Record<string, SubjectSetting>>({});

  const { data: allSubjects, isLoading: isLoadingAll } = useSubjects();
  const { data: activeSubjects, isLoading: isLoadingActive } = useCurriculumSubjects(curriculumId);
  const updateMutation = useUpdateCurriculumSubjects();

  // Sync state when data is loaded
  React.useEffect(() => {
    if (open && allSubjects) {
      const initialSettings: Record<string, SubjectSetting> = {};
      
      // Initialize all master subjects with default settings
      allSubjects.forEach((sub) => {
        initialSettings[sub.id] = {
          subjectId: sub.id,
          checked: false,
          sortOrder: 1,
          maxScore: 100,
          minScore: 60,
          weight: 1,
        };
      });

      // Overlay currently active curriculum subjects
      if (activeSubjects) {
        activeSubjects.forEach((ac) => {
          if (initialSettings[ac.subjectId]) {
            initialSettings[ac.subjectId] = {
              subjectId: ac.subjectId,
              checked: true,
              sortOrder: ac.sortOrder,
              maxScore: ac.maxScore,
              minScore: ac.minScore,
              weight: ac.weight,
            };
          }
        });
      }

      // Avoid synchronous setState during render by scheduling it
      setTimeout(() => {
        setSettings(initialSettings);
      }, 0);
    }
  }, [open, allSubjects, activeSubjects]);

  const handleCheckboxChange = (subjectId: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        checked,
      },
    }));
  };

  const handleNumericChange = (subjectId: string, field: keyof SubjectSetting, val: number) => {
    setSettings((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: val,
      },
    }));
  };

  const handleSave = async () => {
    // Map selected settings to array
    const payload = Object.values(settings)
      .filter((s) => s.checked)
      .map((s) => ({
        subjectId: s.subjectId,
        sortOrder: Number(s.sortOrder),
        maxScore: Number(s.maxScore),
        minScore: Number(s.minScore),
        weight: Number(s.weight),
      }));

    try {
      await updateMutation.mutateAsync({ curriculumId, subjects: payload });
      onOpenChange(false);
    } catch {
      // Notification handled by react query callbacks
    }
  };

  const filteredMaster = React.useMemo(() => {
    if (!allSubjects) return [];
    return allSubjects.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [allSubjects, search]);

  const isLoading = isLoadingAll || isLoadingActive;
  const isSaving = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px] max-h-[85vh] flex flex-col p-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-150 dark:border-zinc-900/60 text-left">
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#C9A050]" />
            Atur Mata Pelajaran — {curriculumName}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 mt-1">
            Pilih mata pelajaran master yang diajarkan dalam kurikulum ini dan sesuaikan bobot nilai serta kriteria KKM (Kriteria Ketuntasan Minimal).
          </DialogDescription>
        </DialogHeader>

        {/* Search tool */}
        <div className="px-6 py-3 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-zinc-150 dark:border-zinc-900/60 flex items-center gap-2.5">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari nama pelajaran atau kode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-850 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden"
          />
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-hidden p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              <span className="text-xs text-zinc-500">Memuat data pelajaran...</span>
            </div>
          ) : filteredMaster.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
              <HelpCircle className="h-8 w-8 mb-2" />
              <span className="text-xs">Tidak ada mata pelajaran yang cocok dengan pencarian Anda.</span>
            </div>
          ) : (
            <ScrollArea className="h-[40vh] pr-2">
              <div className="space-y-3 text-left">
                {/* Header row */}
                <div className="hidden sm:grid grid-cols-12 gap-3 px-3 py-1 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <div className="col-span-5">Mata Pelajaran</div>
                  <div className="col-span-2 text-center">Urutan</div>
                  <div className="col-span-2 text-center">KKM (Min)</div>
                  <div className="col-span-1.5 text-center">Max</div>
                  <div className="col-span-1.5 text-center">Bobot</div>
                </div>

                {filteredMaster.map((sub) => {
                  const set = settings[sub.id] || {
                    subjectId: sub.id,
                    checked: false,
                    sortOrder: 1,
                    maxScore: 100,
                    minScore: 60,
                    weight: 1,
                  };

                  return (
                    <div
                      key={sub.id}
                      className={`grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-xl border transition-all ${
                        set.checked
                          ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30'
                          : 'border-zinc-200/60 dark:border-zinc-850 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10'
                      }`}
                    >
                      {/* Left: Checkbox + info */}
                      <div className="col-span-1 sm:col-span-5 flex items-center gap-3.5">
                        <Checkbox
                          id={`chk-${sub.id}`}
                          checked={set.checked}
                          onCheckedChange={(checked) => handleCheckboxChange(sub.id, !!checked)}
                        />
                        <label htmlFor={`chk-${sub.id}`} className="flex flex-col cursor-pointer min-w-0">
                          <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 truncate">
                            {sub.name}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">
                            {sub.code} • {sub.category}
                          </span>
                        </label>
                      </div>

                      {/* Right Settings (Inputs) - Only enabled if checked */}
                      <div className="col-span-1 sm:col-span-7 grid grid-cols-4 gap-2 items-center">
                        <div>
                          <span className="sm:hidden text-[10px] text-zinc-400 font-medium block mb-1">Urutan</span>
                          <Input
                            type="number"
                            min={1}
                            value={set.sortOrder}
                            disabled={!set.checked}
                            onChange={(e) => handleNumericChange(sub.id, 'sortOrder', Number(e.target.value))}
                            className="h-8 text-center text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <span className="sm:hidden text-[10px] text-zinc-400 font-medium block mb-1">KKM</span>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={set.minScore}
                            disabled={!set.checked}
                            onChange={(e) => handleNumericChange(sub.id, 'minScore', Number(e.target.value))}
                            className="h-8 text-center text-xs"
                          />
                        </div>
                        <div>
                          <span className="sm:hidden text-[10px] text-zinc-400 font-medium block mb-1">Max</span>
                          <Input
                            type="number"
                            min={0}
                            max={500}
                            value={set.maxScore}
                            disabled={!set.checked}
                            onChange={(e) => handleNumericChange(sub.id, 'maxScore', Number(e.target.value))}
                            className="h-8 text-center text-xs"
                          />
                        </div>
                        <div>
                          <span className="sm:hidden text-[10px] text-zinc-400 font-medium block mb-1">Bobot</span>
                          <Input
                            type="number"
                            min={1}
                            value={set.weight}
                            disabled={!set.checked}
                            onChange={(e) => handleNumericChange(sub.id, 'weight', Number(e.target.value))}
                            className="h-8 text-center text-xs font-semibold text-amber-600 dark:text-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="p-6 border-t border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/10 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
            className="h-9.5 text-xs"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="h-9.5 text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Pembagian'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

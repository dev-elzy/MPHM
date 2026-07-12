'use client';

import * as React from 'react';
import { Download, FileSpreadsheet, FileText, FileDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export type ExportFormat = 'excel' | 'csv' | 'pdf';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: ExportFormat) => void;
  title?: string;
  description?: string;
}

export function ExportDialog({
  isOpen,
  onClose,
  onExport,
  title = 'Ekspor Data',
  description = 'Silakan pilih format ekspor dokumen yang Anda butuhkan.',
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = React.useState<ExportFormat>('excel');
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(selectedFormat);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const formats: { id: ExportFormat; label: string; ext: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'excel',
      label: 'Microsoft Excel',
      ext: '.xlsx',
      icon: <FileSpreadsheet className="h-8 w-8 text-emerald-600" />,
      desc: 'Sangat cocok untuk manipulasi data besar dan laporan tabular.',
    },
    {
      id: 'csv',
      label: 'Comma Separated Values (CSV)',
      ext: '.csv',
      icon: <FileText className="h-8 w-8 text-zinc-500" />,
      desc: 'Format text sederhana untuk transfer data antar program.',
    },
    {
      id: 'pdf',
      label: 'Adobe PDF Document',
      ext: '.pdf',
      icon: <FileDown className="h-8 w-8 text-red-500" />,
      desc: 'Format dokumen siap cetak yang tidak dapat diedit secara bebas.',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Download className="h-5 w-5 text-zinc-500" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className={`flex items-start gap-4 p-3.5 text-left border rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/45 transition-all outline-none ${
                selectedFormat === fmt.id
                  ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50/50 dark:bg-zinc-900/30 ring-1 ring-zinc-900 dark:ring-zinc-100'
                  : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="shrink-0 mt-0.5">{fmt.icon}</div>
              <div className="space-y-0.5">
                <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {fmt.label} <span className="text-xs text-zinc-400 font-normal">{fmt.ext}</span>
                </div>
                <div className="text-xs text-zinc-500">{fmt.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
            className="h-9 text-xs"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="h-9 text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
          >
            {isExporting ? 'Mengekspor...' : 'Unduh Dokumen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

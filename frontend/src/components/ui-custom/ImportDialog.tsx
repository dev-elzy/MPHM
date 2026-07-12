'use client';

import * as React from 'react';
import {
  Upload,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  Trash2,
  Download,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ValidationError {
  row: number;
  column: string;
  value: string;
  message: string;
  solution?: string;
}

export interface ImportPreviewData {
  total: number;
  valid: number;
  errorsCount: number;
  duplicatesCount: number;
  previewRows: Record<string, unknown>[];
  errorsList: ValidationError[];
}

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadTemplate: () => void;
  onUploadFile: (file: File) => Promise<ImportPreviewData>;
  onExecuteImport: () => Promise<void>;
  title?: string;
  moduleName?: string;
}

export function ImportDialog({
  isOpen,
  onClose,
  onDownloadTemplate,
  onUploadFile,
  onExecuteImport,
  title = 'Impor Data',
  moduleName = 'data',
}: ImportDialogProps) {
  const [step, setStep] = React.useState<'upload' | 'preview' | 'importing'>('upload');
  const [file, setFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [previewData, setPreviewData] = React.useState<ImportPreviewData | null>(null);
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      // Reset state on close inside async timeout to prevent cascading renders warning
      const timer = setTimeout(() => {
        setStep('upload');
        setFile(null);
        setProgress(0);
        setPreviewData(null);
        setUploadError(null);
        setIsExecuting(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      await processSelectedFile(droppedFile);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await processSelectedFile(selectedFile);
    }
  };

  const processSelectedFile = async (selectedFile: File) => {
    // Validate file type
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      setUploadError('Hanya file Microsoft Excel (.xlsx, .xls) yang diperbolehkan');
      return;
    }

    setFile(selectedFile);
    setUploadError(null);
    setStep('importing');

    // Simulate progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 10;
      });
    }, 80);

    try {
      const data = await onUploadFile(selectedFile);
      setProgress(100);
      setPreviewData(data);
      setStep('preview');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memproses file impor';
      setUploadError(message);
      setStep('upload');
      setFile(null);
    } finally {
      clearInterval(timer);
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await onExecuteImport();
      onClose();
    } catch (err) {
      console.error('Import execution failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Upload className="h-5 w-5 text-zinc-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Unggah file Excel sesuai template untuk mengimpor {moduleName} secara massal.
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: Upload File */}
        {step === 'upload' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {/* Download Template instruction */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Template Impor Excel
                  </div>
                  <div className="text-xs text-zinc-500">
                    Gunakan format template resmi agar data terbaca dengan benar.
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDownloadTemplate}
                className="h-8 text-xs border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh Template
              </Button>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl p-10 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-all text-center group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                className="hidden"
              />
              <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full group-hover:scale-110 transition-transform mb-4">
                <Upload className="h-6 w-6 text-zinc-500" />
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Tarik & Lepas File ke Sini
              </p>
              <p className="text-xs text-zinc-500">
                Atau klik untuk memilih file dari komputer Anda (.xlsx, .xls)
              </p>
            </div>

            {uploadError && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl border border-red-200 dark:border-red-900/40 text-left">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="text-xs font-medium">{uploadError}</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Processing / Progress Bar */}
        {step === 'importing' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <FileSpreadsheet className="h-10 w-10 text-zinc-400 animate-pulse" />
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Membaca dan Memvalidasi File...
              </p>
              {file && <p className="text-xs text-zinc-400 mt-1">{file.name}</p>}
            </div>
            <div className="w-full max-w-xs">
              <Progress value={progress} className="h-1.5" />
            </div>
          </div>
        )}

        {/* STEP 3: Preview Data & Error Validation */}
        {step === 'preview' && previewData && (
          <div className="flex-1 overflow-hidden flex flex-col py-2 space-y-4">
            {/* File Info */}
            <div className="flex items-center justify-between text-sm p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <span className="font-medium text-zinc-600 dark:text-zinc-400 truncate max-w-[300px]">
                {file?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('upload')}
                className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Hapus
              </Button>
            </div>

            {/* Metric counters */}
            <div className="grid grid-cols-4 gap-2.5">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-150 dark:border-zinc-850 text-center">
                <div className="text-xs text-zinc-500 font-medium">Total Data</div>
                <div className="text-xl font-bold text-zinc-950 dark:text-zinc-50 mt-0.5">
                  {previewData.total}
                </div>
              </div>
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-xl border border-emerald-100 dark:border-emerald-900/35 text-center">
                <div className="text-xs text-emerald-600 dark:text-emerald-500 font-medium flex items-center justify-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Valid
                </div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {previewData.valid}
                </div>
              </div>
              <div className="p-3 bg-red-50/50 dark:bg-red-950/10 rounded-xl border border-red-100 dark:border-red-900/35 text-center">
                <div className="text-xs text-red-600 dark:text-red-500 font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Error
                </div>
                <div className="text-xl font-bold text-red-700 dark:text-red-400 mt-0.5">
                  {previewData.errorsCount}
                </div>
              </div>
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 rounded-xl border border-amber-100 dark:border-amber-900/35 text-center">
                <div className="text-xs text-amber-600 dark:text-amber-500 font-medium flex items-center justify-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Duplikat
                </div>
                <div className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                  {previewData.duplicatesCount}
                </div>
              </div>
            </div>

            {/* Dynamic Tabs */}
            <Tabs defaultValue={previewData.errorsCount > 0 ? 'errors' : 'preview'} className="flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg h-9 shrink-0">
                <TabsTrigger value="preview" className="text-xs h-7 rounded-md">
                  Preview Rows
                </TabsTrigger>
                <TabsTrigger value="errors" className="text-xs h-7 rounded-md relative">
                  Kesalahan Validasi
                  {previewData.errorsCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-red-600 text-white font-bold rounded-full text-[9px]">
                      {previewData.errorsCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Preview Data */}
              <TabsContent value="preview" className="flex-1 overflow-auto border rounded-xl border-zinc-200 dark:border-zinc-800 p-0 mt-2 bg-white dark:bg-zinc-950 min-h-0">
                {previewData.previewRows.length > 0 ? (
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 text-xs font-semibold uppercase tracking-wider sticky top-0 border-b border-zinc-200 dark:border-zinc-800 z-10">
                      <tr>
                        <th className="p-3 text-center w-12 border-r border-zinc-200 dark:border-zinc-800">Baris</th>
                        {Object.keys(previewData.previewRows[0]).map((key) => (
                          <th key={key} className="p-3 whitespace-nowrap">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {previewData.previewRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                          <td className="p-3 text-center border-r border-zinc-200 dark:border-zinc-800 text-zinc-400 font-mono text-xs">
                            {idx + 2} {/* Sheet starts at header row 1, data starts row 2 */}
                          </td>
                          {Object.values(row).map((val, valIdx) => (
                            <td key={valIdx} className="p-3 whitespace-nowrap text-zinc-700 dark:text-zinc-300">
                              {String(val || '-')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-zinc-400">
                    <FileSpreadsheet className="h-8 w-8 mb-2 opacity-50" />
                    <span className="text-xs">Tidak ada data untuk di-preview</span>
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Errors validation List */}
              <TabsContent value="errors" className="flex-1 overflow-auto mt-2 min-h-0">
                {previewData.errorsCount > 0 ? (
                  <div className="space-y-2.5">
                    {previewData.errorsList.map((err, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-red-50/40 dark:bg-red-950/10 rounded-xl border border-red-150 dark:border-red-900/35 text-left text-xs"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-red-700 dark:text-red-400 mb-1.5">
                          <AlertCircle className="h-4 w-4" />
                          Baris {err.row} — Kolom &quot;{err.column}&quot;
                        </div>
                        <div className="space-y-1 pl-5.5 text-zinc-600 dark:text-zinc-400">
                          <div>
                            <span className="font-semibold">Nilai diinput:</span>{' '}
                            <code className="px-1.5 py-0.5 bg-red-100/50 dark:bg-red-950/40 text-red-800 dark:text-red-300 rounded font-mono">
                              {err.value || '(kosong)'}
                            </code>
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                              Kesalahan:
                            </span>{' '}
                            {err.message}
                          </div>
                          {err.solution && (
                            <div className="flex items-start gap-1 text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                              <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                              <span>Solusi: {err.solution}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 bg-emerald-50/20 dark:bg-emerald-950/5 border border-dashed border-emerald-200 dark:border-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-8 w-8 mb-2" />
                    <span className="text-xs font-semibold">Validasi Selesai: Tidak ada kesalahan data.</span>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 border-t border-zinc-150 dark:border-zinc-800/80 pt-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isExecuting || step === 'importing'}
            className="h-9 text-xs"
          >
            Batal
          </Button>

          {step === 'preview' && (
            <Button
              type="button"
              onClick={handleExecute}
              disabled={isExecuting || (previewData?.errorsCount ?? 0) > 0 || (previewData?.valid ?? 0) === 0}
              className="h-9 text-xs bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            >
              {isExecuting ? 'Menyimpan...' : 'Impor Data'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

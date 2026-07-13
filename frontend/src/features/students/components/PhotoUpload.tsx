import * as React from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoUploadProps {
  value?: File | null | string;
  onChange: (file: File | null) => void;
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === 'string' && value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className={`relative h-28 w-28 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-colors ${preview ? 'border-amber-500' : 'border-zinc-300 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-600 bg-zinc-50 dark:bg-zinc-900'}`}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 h-6 w-6 rounded-full scale-75 shadow-sm"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center text-zinc-400">
            <Camera className="h-8 w-8 mb-1" />
            <span className="text-[10px] font-semibold">Upload Foto</span>
          </div>
        )}
      </div>
      <input 
        type="file" 
        accept="image/png, image/jpeg, image/jpg" 
        className="hidden" 
        ref={inputRef}
        onChange={handleFileChange}
      />
      <div className="text-[10px] text-zinc-500 text-center">
        Format: JPG, PNG. Maks: 2MB.
      </div>
    </div>
  );
}

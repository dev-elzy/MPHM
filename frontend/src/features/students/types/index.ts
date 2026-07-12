export interface Student {
  id: string;
  nis: string | null;
  nisn: string | null;
  name: string;
  birthDate: string | null;
  birthPlace: string | null;
  gender: 'male' | 'female';
  address: string | null;
  parentName: string | null;
  parentPhone: string | null;
  phone: string | null;
  entryYear: string | null;
  entryJenjang: string | null;
  status: string;
  notes: string | null;
  
  // Dynamic class fields resolved by joins
  classId?: string | null;
  className?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface ImportPreviewRow {
  rowNumber: number;
  name: string;
  nis: string;
  status: 'valid' | 'error';
  errors: string[];
}

export interface ImportPreviewResult {
  total: number;
  valid: number;
  failed: number;
  items: ImportPreviewRow[];
}

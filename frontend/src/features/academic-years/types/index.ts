export type AcademicYearStatus = 'Draft' | 'Active' | 'Archived';
export type SemesterStatus = 'Draft' | 'Active' | 'Completed';

export interface Semester {
  id: string;
  academicYearId: string;
  name: string; // e.g. "Semester Ganjil" or "Semester Genap"
  status: SemesterStatus;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AcademicYear {
  id: string;
  name: string; // e.g. "2024/2025"
  status: AcademicYearStatus;
  startDate: string;
  endDate: string;
  description?: string;
  semesters: Semester[];
  createdAt: string;
  updatedAt: string;
}

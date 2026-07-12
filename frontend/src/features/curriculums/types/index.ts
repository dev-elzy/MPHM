export interface Subject {
  id: string;
  name: string;
  arabicName?: string;
  code: string;
  description?: string;
  category: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface Curriculum {
  id: string;
  academicYearId: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  academicYearName?: string; // from join
  createdAt?: string;
  updatedAt?: string;
}

export interface CurriculumSubject {
  id: string;
  curriculumId: string;
  subjectId: string;
  sortOrder: number;
  maxScore: number;
  minScore: number;
  weight: number;
  status: string;
  notes?: string;
  // joined from subject
  name?: string;
  code?: string;
  arabicName?: string;
  category?: string;
}

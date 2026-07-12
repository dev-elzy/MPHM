export type Jenjang = 'I\'dadiyyah' | 'Ibtida\'iyyah' | 'Tsanawiyyah' | 'Aliyyah';

export type Tingkat = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export type ClassStatus = 'Active' | 'Archived';

export interface ClassAssignment {
  id: string;
  classId: string;
  mustahiqId: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'History';
}

export interface Class {
  id: string;
  academicYearId: string;
  semesterId: string;
  curriculumId: string;
  jenjang: Jenjang;
  tingkat: Tingkat;
  bagian: string; // e.g. A, B, C, Tahfidz
  name: string; // e.g. Ibtida'iyyah III-A
  status: ClassStatus;
  
  // Relations mapped by service
  mustahiqId?: string; // Currently active assignment
  waliKelasName?: string;
  studentCount?: number;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface MustahiqLookup {
  id: string;
  name: string;
}

export interface CurriculumLookup {
  id: string;
  name: string;
}

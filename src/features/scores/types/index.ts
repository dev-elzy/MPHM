export interface ScoreSession {
  id: string;
  academicYearId: string;
  semesterId: string;
  classId: string;
  curriculumSubjectId: string;
  status: 'draft' | 'ready' | 'final' | 'locked';
  finalizedAt?: string | null;
  finalizedBy?: string | null;
  lockedAt?: string | null;
  lockedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;

  // Joined fields
  subjectName?: string;
  subjectCode?: string;
  className?: string;
  maxScore?: number;
  minScore?: number;
  weight?: number;
}

export interface Score {
  id: string;
  scoreSessionId: string;
  studentId: string;
  scoreType: 'tamrin' | 'ujian';
  score: number | null;
  notes?: string | null;
  updatedAt?: string;

  // Joined fields
  studentName?: string;
  studentNis?: string | null;
}

export interface ScoreResult {
  id: string;
  scoreSessionId: string;
  studentId: string;
  khosScore: number | null;
  amScore: number | null;
  finalScore: number | null;
  predicate: string | null;
  ranking: number | null;
  passed: boolean | null;
  notes?: string | null;
  calculatedAt?: string | null;

  // Joined fields
  studentName?: string;
  studentNis?: string | null;
}

// Grid row combining student + scores for a session
export interface ScoreEntryRow {
  studentId: string;
  studentName: string;
  studentNis: string | null;
  tamrinScore: number | null;
  ujianScore: number | null;
  khosScore: number | null;
  amScore: number | null;
  finalScore: number | null;
  predicate: string | null;
  ranking: number | null;
  passed: boolean | null;
}

export interface AttendanceRecord {
  id: string | null;
  studentId: string;
  hijriMonth: number;
  hijriYear: number;
  sickCount: number;
  permissionCount: number;
  absentCount: number;
  notes?: string | null;

  // Joined
  studentName?: string;
  studentNis?: string | null;
}

export interface AttendanceSummary {
  studentId: string;
  studentName: string;
  studentNis: string | null;
  sick: number;
  permission: number;
  absent: number;
}

export interface AkhlaqRecord {
  id: string;
  academicYearId: string;
  semesterId: string;
  classId: string;
  studentId: string;
  category: string;
  grade: string;
  description?: string | null;
  notes?: string | null;
  createdAt?: string;

  // Joined
  studentName?: string;
  studentNis?: string | null;
}

export interface Report {
  id: string;
  academicYearId: string;
  semesterId: string;
  classId: string;
  studentId: string;
  reportData?: string | null;
  fileUrl?: string | null;
  status: 'draft' | 'verified' | 'published';
  generatedAt?: string | null;
  generatedBy?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  publishedAt?: string | null;
  createdAt?: string;

  // Joined
  studentName?: string;
  className?: string;
}

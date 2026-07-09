export interface Schedule {
  id: string;
  academicYearId: string;
  semesterId: string;
  targetType: 'jenjang' | 'tingkat' | 'class';
  jenjang?: string | null;
  tingkat?: string | null;
  classId?: string | null;
  day: string;
  startTime: string;
  endTime: string;
  activity: string;
  subjectId?: string | null;
  teacherId?: string | null;
  room?: string | null;
  notes?: string | null;
  isOverride: boolean;
  status: string;
  createdAt: string | number;
}

import { useQuery } from '@tanstack/react-query';
import { scoresService } from '../services/scores.service';

export const SCORE_SESSIONS_KEY = 'score-sessions';
export const SCORE_ENTRIES_KEY = 'score-entries';
export const ATTENDANCE_KEY = 'attendance';
export const AKHLAQ_KEY = 'akhlaq';
export const REPORTS_KEY = 'reports';

export function useScoreSessions(params: {
  academicYearId?: string;
  semesterId?: string;
  classId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [SCORE_SESSIONS_KEY, params],
    queryFn: () => scoresService.getSessions(params),
    enabled: !!(params.academicYearId && params.semesterId),
  });
}

export function useScoreSession(id: string | undefined) {
  return useQuery({
    queryKey: [SCORE_SESSIONS_KEY, id],
    queryFn: () => scoresService.getSessionById(id!),
    enabled: !!id,
  });
}

export function useScoreEntries(sessionId: string | undefined) {
  return useQuery({
    queryKey: [SCORE_ENTRIES_KEY, sessionId],
    queryFn: () => scoresService.getScoreEntries(sessionId!),
    enabled: !!sessionId,
    staleTime: 0, // Always fresh for active score editing
  });
}

export function useAttendance(params: {
  academicYearId?: string;
  semesterId?: string;
  classId?: string;
  hijriMonth?: number | null;
  hijriYear?: number | null;
}) {
  return useQuery({
    queryKey: [ATTENDANCE_KEY, params],
    queryFn: () =>
      scoresService.getAttendance({
        academicYearId: params.academicYearId!,
        semesterId: params.semesterId!,
        classId: params.classId!,
        hijriMonth: params.hijriMonth,
        hijriYear: params.hijriYear,
      }),
    enabled: !!(params.academicYearId && params.semesterId && params.classId && params.hijriMonth && params.hijriYear),
  });
}

export function useAttendanceSummary(params: {
  academicYearId?: string;
  semesterId?: string;
  classId?: string;
}) {
  return useQuery({
    queryKey: [ATTENDANCE_KEY, 'summary', params],
    queryFn: () =>
      scoresService.getAttendanceSummary({
        academicYearId: params.academicYearId!,
        semesterId: params.semesterId!,
        classId: params.classId!,
      }),
    enabled: !!(params.academicYearId && params.semesterId && params.classId),
  });
}

export function useAkhlaq(params: {
  academicYearId?: string;
  semesterId?: string;
  classId?: string;
}) {
  return useQuery({
    queryKey: [AKHLAQ_KEY, params],
    queryFn: () =>
      scoresService.getAkhlaq({
        academicYearId: params.academicYearId!,
        semesterId: params.semesterId!,
        classId: params.classId!,
      }),
    enabled: !!(params.academicYearId && params.semesterId && params.classId),
  });
}

export function useReports(params: {
  academicYearId?: string;
  semesterId?: string;
  classId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [REPORTS_KEY, params],
    queryFn: () =>
      scoresService.getReports({
        academicYearId: params.academicYearId!,
        semesterId: params.semesterId!,
        classId: params.classId,
        status: params.status,
        page: params.page,
        limit: params.limit,
      }),
    enabled: !!(params.academicYearId && params.semesterId),
  });
}

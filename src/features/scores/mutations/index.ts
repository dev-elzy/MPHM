import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { scoresService } from '../services/scores.service';
import {
  SCORE_SESSIONS_KEY,
  SCORE_ENTRIES_KEY,
  ATTENDANCE_KEY,
  AKHLAQ_KEY,
  REPORTS_KEY,
} from '../queries/useScores';

export function useCreateScoreSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      academicYearId: string;
      semesterId: string;
      classId: string;
      curriculumSubjectId: string;
    }) => scoresService.createSession(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SCORE_SESSIONS_KEY] });
      toast.success('Sesi penilaian berhasil dibuat');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useFinalizeScoreSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scoresService.finalizeSession(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: [SCORE_SESSIONS_KEY] });
      qc.invalidateQueries({ queryKey: [SCORE_ENTRIES_KEY, id] });
      toast.success('Nilai berhasil difinalisasi');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSaveScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      scoreSessionId: string;
      studentId: string;
      scoreType: 'tamrin' | 'uts' | 'uas';
      score: number | null;
      notes?: string;
    }) => scoresService.saveScore(payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [SCORE_ENTRIES_KEY, vars.scoreSessionId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSaveBulkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      academicYearId: string;
      semesterId: string;
      classId: string;
      hijriMonth: number;
      hijriYear: number;
      records: { studentId: string; sickCount: number; permissionCount: number; absentCount: number; notes?: string | null }[];
    }) => scoresService.saveBulkAttendance(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ATTENDANCE_KEY] });
      toast.success('Absensi berhasil disimpan');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSaveAkhlaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      academicYearId: string;
      semesterId: string;
      classId: string;
      records: {
        studentId: string;
        category: string;
        grade: string;
        description?: string;
        notes?: string;
      }[];
    }) => scoresService.saveBulkAkhlaq(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [AKHLAQ_KEY] });
      toast.success('Penilaian akhlaq berhasil disimpan');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useGenerateReports() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      academicYearId: string;
      semesterId: string;
      classId: string;
    }) => scoresService.generateReports(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REPORTS_KEY] });
      toast.success('Raport berhasil di-generate');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useFinalizeReports() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      academicYearId: string;
      semesterId: string;
      classId: string;
    }) => scoresService.finalizeReports(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REPORTS_KEY] });
      toast.success('Raport berhasil difinalisasi dan dipublikasikan');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

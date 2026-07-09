import { useQuery } from '@tanstack/react-query';
import { SchedulesService } from '../services/schedules.service';

interface UseSchedulesParams {
  academicYearId?: string;
  semesterId?: string;
  targetType?: string;
  jenjang?: string;
  tingkat?: string;
  classId?: string;
}

export function useSchedules(params: UseSchedulesParams) {
  return useQuery({
    queryKey: ['schedules', params],
    queryFn: () => SchedulesService.getSchedules(params),
    enabled: !!params.academicYearId && !!params.semesterId && (!!params.jenjang || !!params.classId),
  });
}
